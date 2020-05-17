import pkg from './package.json'

export default {
  entry: 'src/index.js',
  dest: 'dist/index.js',
  format: 'umd',
  exports: 'named',
  moduleName: pkg.name
}
