/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:13:12
* @Last Modified by:   tungjason
* @Last Modified time: 2018-05-02 11:05:04
*/
const extend = require('extend')
const path = require('path')
const requireUncached = require('require-uncached')
const configJson = require('../../krau.json')

const projectRoot = process.cwd()
let projectConf = {}

try {
  projectConf = requireUncached(path.join(projectRoot, 'krau.json'))
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
      ftp: config['ftp'],
      jsdoc: config['jsdoc'],
      postcss: config['postcss'],
      webpack: config['webpack'] || {}
    })
  }
  return envConfig
}
