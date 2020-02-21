import globals from 'rollup-plugin-node-globals'
import builtins from 'rollup-plugin-node-builtins'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: [{
    file: 'manual-test/index.js',
    name: 'zlFetch',
    format: 'umd'
  }],
  plugins: [
    commonjs(),
    globals(),
    builtins(),
    json(),
    resolve(),
    babel({
      exclude: 'node_modules/**', // only transpile our source code
      runtimeHelpers: true,
      babelrc: false,
      presets: [['@babel/env']],
      plugins: ['@babel/plugin-transform-runtime']
    })
  ]
}
