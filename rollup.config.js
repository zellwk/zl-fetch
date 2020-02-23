import globals from 'rollup-plugin-node-globals'
import builtins from 'rollup-plugin-node-builtins'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import babel from 'rollup-plugin-babel'

require('rimraf').sync('dist')

const plugins = [
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
]

const createConfig = ({ input, format, ext = 'js' }) => {
  return {
    input: `src/${input}.js`,
    output: {
      name: 'zlFetch',
      file: `dist/${input}.${ext}`,
      format,
      sourcemap: true
    },
    plugins,
    inlineDynamicImports: true
  }
}

export default [
  { input: 'index', format: 'esm', ext: 'mjs' },
  { input: 'index', format: 'esm' },
  { input: 'index', format: 'umd' }
].map(createConfig)
