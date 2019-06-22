/*
 * @Author: dengjiayao
 * @Date:   2017-12-27 13:04:04
 * @Last Modified by:   dengjiayao
 * @Last Modified time: 2019-06-22 10:56:10
 */
const webpack = require('webpack')
const path = require('path')
const getBabelAssetconf = require('../webpack-conf/webpack-babel-asset-conf')
const aliasEnv = require('../util/alias-env')
const decorate = require('../util/decorate')

module.exports = env => {
  // 打包处理 .bl.js 文件
  env = aliasEnv(env)
  let conf = getBabelAssetconf(env)
  if (!conf) {
    return Promise.resolve()
  }

  let compiler = webpack(conf)
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.log(decorate.error('babel-asset'), err)
        reject(err)
      } else {
        console.log(
          decorate.info('babel-asset'),
          stats.toString({
            children: false,
            colors: true,
            entrypoints: false,
            modules: false,
          })
        )
        resolve()
      }
    })
  })
}
