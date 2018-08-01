/*
* @Author: jiayao.deng
* @Date:   2018-07-31 16:03:30
* @Last Modified by:   jiayao.deng
* @Last Modified time: 2018-08-01 14:47:33
*/
const path = require('path')
const fs = require('fs')
const colors = require('colors')
const leftPad = require('left-pad')
const webpack = require('webpack')
const getCjsConf = require('../webpack-conf/webpack-umd-conf')

function checkExtJs(src) {
  if (path.extname(src) !== '.js') {
    console.log(colors.bgRed(`[task ${leftPad('umd', 12)}]`), `${src} should end with '.js'`)
    return false
  }
  return true
}

function pathExist(src) {
  try {
    fs.accessSync(src)
    return true
  } catch (e) {
    console.log(colors.bgRed(`[task ${leftPad('umd', 12)}]`), `${src} is not accessible`)
    return false
  }
}

module.exports = (libraryName, sourcePath, distPath) => {
  if (!libraryName) {
    console.log(colors.bgRed(`[task ${leftPad('umd', 12)}]`), 'library is not named')
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
          console.log(colors.bgRed(`[task ${leftPad('umd', 12)}]`), err)
          reject(err)
        } else {
          console.log(
            colors.bgGreen(`[task ${leftPad('umd', 12)}]`),
            stats.toString({
              children: false,
              colors: true,
              entrypoints: false,
              modules: false
            })
          )
          console.log(colors.bgGreen(`[task ${leftPad('umd', 12)}]`), distPath + ' generagted')
          resolve()
        }
      })
    })
  }
}
