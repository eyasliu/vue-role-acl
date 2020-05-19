import emit, { changeEvt } from "./emit"

export default class RoleAcl {
  constructor(opt) {
    opt = Object.assign({
      initial: [],
      rules: {},
      ruleFail: '/403',
    }, opt)
    this.role = opt.initial || []
    this.rules = opt.rules || {}
    this.router = opt.router
    this.ruleFail = opt.ruleFail
    this.middleware = opt.middleware
    this.initRule = opt.initRule
    if (this.router) {
      this._initRouter()
    }
  }
  _initRouter() {
    const router = this.router
    const ruleFailPath = typeof this.ruleFail === 'string' ? this.ruleFail : this.ruleFail && this.ruleFail.path

    router.beforeEach(async (to, from, next) => {
      try {
        if (this.initRule && !this._initRuleExeced) {
          this._initRuleExeced = true
          if (typeof this.initRule === 'function') {
            await this.initRule(this, this, router)
          } else {
            await this.initRule
          }
        }
        if (this.middleware) {
          if (typeof this.middleware === 'function') {
            await this.middleware(this, router)
          } else {
            await this.middleware
          }
        }
      } catch (e) { }

      if (to.path === ruleFailPath) {
        return next()
      }
      // 未设置权限的视为公开
      if (!('rule' in to.meta)) {
        return next()
      }
      const routerRule = to.meta.rule
      if (this.check(routerRule)) {
        return next()
      } else {
        const toruleFail = to.meta.ruleFail
        const p = toruleFail || ruleFailPath
        if (from.path !== p) {
          next({ path: p, query: to.query })
        }
      }

    })
  }
  clear() {
    this.role = []
    emit.emit(changeEvt)
  }
  change(...role) {
    if (Array.isArray(role[0])) {
      role = [...role[0]]
    }
    this.role = role
    emit.emit(changeEvt)
  }
  get currentRoles() {
    let role = ['*']
    if (!this.role) {
      return role
    } else if (Array.isArray(this.role)) {
      role.push(...this.role)
    } else {
      role.push(this.role)
    }
    return role
  }

  get allowPermissions() {
    return this.currentRoles.reduce((pers, role) => {
      let rolePers = this.rules[role] || []
      if (!Array.isArray(rolePers)) {
        pers.push(rolePers)
      } else {
        pers.push(...rolePers)
      }
      return pers
    }, [])
  }
  setRules(v) {
    this.rules = v
    emit.emit(changeEvt)
  }
  check(...permissions) {
    const allows = this.allowPermissions
    if (~allows.indexOf('*')) {
      return true
    }
    if (Array.isArray(permissions[0])) {
      permissions = permissions[0]
    }
    return permissions.some(per => !!~allows.indexOf(per))
  }
}