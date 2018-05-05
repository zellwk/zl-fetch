const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'zlFetch',
    libraryTarget: 'umd'
  },
  externals: {
    btoa: {
      commonjs: 'bota',
      commonjs2: 'bota',
      amd: 'bota',
      root: '_'
    }
  },
  mode: 'production'
}
