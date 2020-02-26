import globals from 'rollup-plugin-node-globals'
import builtins from 'rollup-plugin-node-builtins'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

const pkg = require('./package.json')
require('rimraf').sync('dist')

const outputs = [
  { file: pkg.main, format: 'cjs' },
  { file: pkg.module, format: 'esm' },
  { file: pkg.browser, format: 'umd' }
]

export default {
  input: 'src/index.js',
  output: outputs.map(output => {
    return {
      ...output,
      name: 'zlFetch',
      sourcemap: true,
      plugins: [terser()]
    }
  }),
  plugins: [
    json(),
    resolve(),
    globals(),
    builtins(),
    babel({
      exclude: 'node_modules/**', // only transpile our source code
      runtimeHelpers: true,
      babelrc: false,
      presets: [['@babel/env']],
      plugins: ['@babel/plugin-transform-runtime']
    }),
    commonjs()
  ],
  inlineDynamicImports: true
}
