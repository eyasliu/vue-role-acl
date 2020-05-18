# Vue Role Acl 权限管理

vue 的权限管理中间件

## Usage

```html
<p v-if="$acl.check('read')">user can read</p>
<p v-if="$acl.check('edit')">user can edit</p>
<p v-if="$acl.check('delete')">user can delete</p>
<p v-if="$acl.check('list')">user can list</p>
<p v-if="$acl.check('read', 'list')">user can read or list</p>
```

```js
const router = new VueRouter({
  routes: [
    { path: '/read', component: { template: '<p>read</p>' }, meta: { rule: ['read'] } },
    { path: '/edit', component: { template: '<p>edit</p>' }, meta: { rule: ['edit'] } },
    { path: '/delete', component: { template: '<p>delete</p>' }, meta: { rule: ['delete'] } },
    { path: '/list', component: { template: '<p>list</p>' }, meta: { rule: ['list'] } },
    { path: '/public', component: { template: '<p>public</p>' } },
    { path: '/not-found', component: { template: '<p>not-found</p>' } },
  ]
})

Vue.use(VueRoleAcl, {
  initial: 'public',
  router,
  notfound: '/not-found',
  rules: {
    '*': ['read'],
    admin: '*',
    login: ['read', 'list'],
    editor: ['read', 'list', 'edit', 'delete'],
  },
})
```