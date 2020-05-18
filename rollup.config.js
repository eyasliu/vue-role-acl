import minify from "rollup-plugin-babel-minify";
import nodeResolve from 'rollup-plugin-node-resolve';
// import babel from '@rollup/plugin-babel'

export default {
  input: 'src/index.js',
  // include: ['mitt'],
  plugins: [
    // babel({
    //   babelHelpers: 'bundled',
    //   exclude: 'node_modules/**'
    // }),
    // nodeResolve({ jsnext: true, main: false })
  ],
  output: [{
    name: 'VueRoleAcl',
    file: 'dist/vue-role-acl.js',
    format: 'umd'
  }, {
    compact: true,
    plugins: [minify({ comments: false })],
    name: 'VueRoleAcl',
    file: 'dist/vue-role-acl.min.js',
    format: 'umd',
  }],
  exports: 'named',
  // moduleName: 'VueRoleAcl',
  external: ['vue']
}
