/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:12:16
* @Last Modified by:   tungjason
* @Last Modified time: 2018-05-02 11:08:23
*/
const fs = require('fs')
const path = require('path')

const krRoot = path.join(__dirname, '../../')

let babelrc = fs.readFileSync(path.join(krRoot, '.babelrc'), {
  encoding: 'utf8'
})
babelrc = JSON.parse(babelrc.toString())

babelrc.presets = babelrc.presets.map(it => {
  if (typeof it === 'string') {
    return require.resolve('babel-preset-' + it)
  } else {
    return [require.resolve('babel-preset-' + it[0]), it[1]]
  }
})
babelrc.plugins = babelrc.plugins.map(it => {
  if (typeof it === 'string') {
    return it.indexOf('react-hot-loader') > -1
      ? require.resolve(it)
      : require.resolve('babel-plugin-' + it)
  } else {
    return [require.resolve('babel-plugin-' + it[0]), it[1]]
  }
})
babelrc.cacheDirectory = true

module.exports = babelrc
