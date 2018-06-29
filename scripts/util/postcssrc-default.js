/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:14:56
* @Last Modified by:   jiayao.deng
* @Last Modified time: 2018-06-29 14:14:06
*/
const path = require('path')
const fs = require('fs')
const { ncp } = require('ncp')
const getConfig = require('./config')

module.exports = env => {
  let config = getConfig(env)
  return {
    'postcss-easy-import': {
      prefix: '_'
    },
    precss: {
      import: {
        disable: true
      }
    },
    'postcss-pxtorem': {
      rootValue: 16,
      propWhiteList: [],
      selectorBlackList: [/^html$/]
    },
    'rucksack-css': {
      fallbacks: true
    },
    'postcss-assets': {
      loadPaths: [path.join(global.G_PATH.STATIC, 'img')],
      basePath: 'client',
      baseUrl: '',
      cachebuster: false,
      relative: true
    },
    autoprefixer: {
      browsers: [
        'last 2 versions',
        '> 5%',
        'safari >= 8',
        'ie >= 8',
        'Firefox ESR',
        'iOS >= 8',
        'android >= 4'
      ]
    },
    cssnano: {
      safe: true,
      discardComments: {
        removeAll: true
      },
      filterPlugins: false
    },
    'postcss-reporter': {
      clearMessages: true
    }
  }
}
