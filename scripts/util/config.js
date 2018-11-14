/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:13:12
* @Last Modified by:   jiayao.deng
* @Last Modified time: 2018-11-14 17:38:53
*/
const extend = require('extend')
const path = require('path')
const importFresh = require('import-fresh')
const configJson = require('../../krau.json')

let projectConf = {}
try {
  projectConf = importFresh(path.join(global.G_PATH.PROJECT, 'krau.json'))
} catch (e) {
  projectConf = {}
}

let config = extend(true, {}, configJson, projectConf)

module.exports = (env, isDefinition) => {
  env = env || global.NODE_ENV || process.env.NODE_ENV
  let defaultConfig = config['default']
  let envConfig = extend(true, {}, defaultConfig, config[env || 'production'] || {}, {
    version: Date.now()
  })
  if (!isDefinition) {
    envConfig = extend(true, {}, envConfig, {
      renderType: config['renderType'],
      ftp: config['ftp'],
      postcss: config['postcss'],
      webpack: config['webpack'] || {}
    })
  }
  return envConfig
}
