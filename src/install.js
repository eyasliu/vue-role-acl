import RoleAcl from './acl'
import emit, { changeEvt } from './emit'


export default (Vue, opts) => {

  const $acl = new RoleAcl(opts)

  function beforeCreate() {
    const vm = this
    vm.$acl = $acl
    vm.$_vueRoleAclListenFn = () => {
      vm.$forceUpdate()
    }
    emit.on(changeEvt, vm.$_vueRoleAclListenFn)
  }
  function beforeDestroy() {
    const vm = this
    emit.off(changeEvt, vm.$_vueRoleAclListenFn)
  }

  Vue.mixin({
    beforeCreate,
    beforeDestroy,
  })
}
