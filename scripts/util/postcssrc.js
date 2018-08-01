/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:15:48
* @Last Modified by:   jiayao.deng
* @Last Modified time: 2018-07-31 18:27:30
*/
const extend = require('extend')
const postcssEasyImport = require('postcss-easy-import')
const precss = require('precss')
const postcssPxtorem = require('postcss-pxtorem')
const rucksackCss = require('rucksack-css')
const postcssAssets = require('postcss-assets')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const postcssRepoter = require('postcss-reporter')
const getConfig = require('./config')
const getPostcssDefault = require('./postcssrc-default')

const pkgs = {
  'postcss-easy-import': postcssEasyImport,
  precss: precss,
  'postcss-pxtorem': postcssPxtorem,
  'rucksack-css': rucksackCss,
  'postcss-assets': postcssAssets,
  autoprefixer: autoprefixer,
  cssnano: cssnano,
  'postcss-reporter': postcssRepoter
}

module.exports = (env, stdinConf = {}) => {
  let { postcss: postcssConf } = getConfig(env)
  let postcssDefault = getPostcssDefault()

  let enable = {
    'postcss-easy-import': true,
    precss: true,
    'postcss-pxtorem': true,
    'rucksack-css': true,
    'postcss-assets': true,
    autoprefixer: true,
    cssnano: env !== 'development',
    'postcss-reporter': true
  }
  Object.keys(enable).forEach(key => {
    enable[key] = key in stdinConf ? !!stdinConf[key] : key in postcssConf ? !!postcssConf[key] : enable[key]
  })

  let plugins = []
  Object.keys(enable).forEach(key => {
    if (enable[key]) {
      let conf = extend(true, {}, postcssDefault[key], postcssConf[key] || {}, stdinConf[key] || {})
      let plugin = pkgs[key](conf)
      plugins.push(plugin)
    }
  })

  return { plugins }
}
