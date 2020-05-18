import injectAcl, { RoleAcl } from './acl'


export default (Vue, opts) => {

  const $acl = new RoleAcl(opts)

  function created() {
    injectAcl(this, $acl)
  }

  Vue.mixin({
    created,
  })
}