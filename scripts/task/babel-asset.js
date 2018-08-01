/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:04:04
* @Last Modified by:   jiayao.deng
* @Last Modified time: 2018-07-31 17:17:50
*/
const webpack = require('webpack')
const colors = require('colors')
const leftPad = require('left-pad')
const path = require('path')
const getBabelAssetconf = require('../webpack-conf/webpack-babel-asset-conf')
const aliasEnv = require('../util/alias-env')

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
        console.log(colors.bgRed(`[task ${leftPad('babel-asset', 12)}]`), err)
        reject(err)
      } else {
        console.log(
          colors.bgGreen(`[task ${leftPad('babel-asset', 12)}]`),
          stats.toString({
            children: false,
            colors: true,
            entrypoints: false,
            modules: false
          })
        )
        resolve()
      }
    })
  })
}
