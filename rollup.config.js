import minify from "rollup-plugin-babel-minify";
import fs from 'fs'

export default {
  input: 'lib/index.js',
  output: [{
    name: 'VueRoleAcl',
    file: 'dist/vue-role-acl.js',
    format: 'umd',
    intro: fs.readFileSync('node_modules/regenerator-runtime/runtime.js').toString()
  }, {
    compact: true,
    plugins: [minify({ comments: false })],
    name: 'VueRoleAcl',
    file: 'dist/vue-role-acl.min.js',
    format: 'umd',
    intro: fs.readFileSync('node_modules/regenerator-runtime/runtime.js').toString()
  }],
  // exports: 'named',
  // moduleName: 'VueRoleAcl',
  external: ['vue']
}
