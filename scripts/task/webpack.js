/*
 * @Author: dengjiayao
 * @Date:   2017-12-27 13:10:39
 * @Last Modified by:   dengjiayao
 * @Last Modified time: 2019-06-22 11:12:33
 */
const webpack = require('webpack')
const getProdConf = require('../webpack-conf/webpack-prod-conf')
const aliasEnv = require('../util/alias-env')
const decorate = require('../util/decorate')

module.exports = env => {
  env = aliasEnv(env)

  let conf = getProdConf(env)
  if (!conf) {
    return Promise.resolve()
  }

  let compiler = webpack(conf)
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.log(decorate.error('webpack'), err)
        reject()
      } else {
        console.log(
          decorate.info('webpack'),
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
