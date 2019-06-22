/*
 * @Author: jiayao.deng
 * @Date:   2018-07-31 16:03:30
 * @Last Modified by:   dengjiayao
 * @Last Modified time: 2019-06-22 11:08:19
 */
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const getCjsConf = require('../webpack-conf/webpack-umd-conf')
const decorate = require('../util/decorate')

function checkExtJs(src) {
  if (path.extname(src) !== '.js') {
    console.log(decorate.error('umd'), `${src} should end with '.js'`)
    return false
  }
  return true
}

function pathExist(src) {
  try {
    fs.accessSync(src)
    return true
  } catch (e) {
    console.log(decorate.error('umd'), `${src} is not accessible`)
    return false
  }
}

module.exports = (libraryName, sourcePath, distPath) => {
  if (!libraryName) {
    console.log(decorate.error('umd'), 'library is not named')
    return false
  }

  sourcePath = path.resolve(global.G_PATH.CWD, sourcePath)
  distPath = path.resolve(global.G_PATH.CWD, distPath)

  if (checkExtJs(sourcePath) && checkExtJs(distPath) && pathExist(sourcePath)) {
    const entry = {}
    const entryName = path.relative(global.G_PATH.CWD, distPath).slice(0, -3)
    entry[entryName] = './' + path.relative(global.G_PATH.CWD, sourcePath)

    let conf = getCjsConf(entry, libraryName)
    let compiler = webpack(conf)
    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) {
          console.log(decorate.error('umd'), err)
          reject(err)
        } else {
          console.log(
            decorate.info('umd')
            stats.toString({
              children: false,
              colors: true,
              entrypoints: false,
              modules: false,
            })
          )
          console.log(decorate.info('umd'), distPath + ' generagted')
          resolve()
        }
      })
    })
  }
}
