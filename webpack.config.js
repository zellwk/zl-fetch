const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'zlFetch',
    libraryTarget: 'umd'
  },
  externals: {
    btoa: {
      commonjs: 'btoa',
      commonjs2: 'btoa',
      amd: 'btoa',
      root: '_'
    }
  }
}
