import emit, { changeEvt } from "./emit"

export class RoleAcl{
  constructor(opt) {
    this.role = opt.initial || []
    this.rules = opt.rules || {}
    this.router = opt.router
    this.notfound = opt.notfound
    this.middleware = opt.middleware
    if (this.router) {
      this._initRouter()
    }
  }
  _initRouter() {
    const router = this.router
    const notfound = this.notfound
    router.beforeEach(async (to, from, next) => {
      if (this.middleware) {
        if (typeof this.middleware === 'function') {
          await this.middleware(this, router)
        } else {
          await this.middleware
        }
      }
      // 未设置权限的视为公开
      if (!('rule' in to.meta)) {
        return next()
      }
      const routerRule = to.meta.rule
      if (this.check(routerRule)) {
        return next()
      } else {
        const p = notfound.path || notfound
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
  change (...role) {
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

export default function(vm, acl) {
  vm.$acl = acl
  const listenFn = () => {
    vm.$forceUpdate()
  }
  emit.on(changeEvt, listenFn)
}