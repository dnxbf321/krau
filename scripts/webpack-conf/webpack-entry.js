/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:22:50
* @Last Modified by:   jiayao.deng
* @Last Modified time: 2018-06-29 10:32:01
*/
const path = require('path')
const glob = require('glob')
const getConfig = require('../util/config')

function collectJses(filters) {
  let jses = glob.sync(global.G_PATH.CONTEXT + '/static/**/*.wp.js', {
    cwd: global.G_PATH.CONTEXT
  })

  let ret = []
  if (filters.length) {
    while (filters.length) {
      let filter = filters.shift()
      let reg = new RegExp(filter, 'i')
      ret = ret.concat(
        jses.filter(name => {
          return reg.test(name)
        })
      )
    }
  } else {
    ret = jses
  }
  return ret
}

module.exports = env => {
  let config = getConfig(env)
  let entryPrefixer = config.webpack['entry-prefixer'] || ''
  let entryFilter = config.webpack['entry-filter'] || []

  let jses = collectJses(entryFilter)
  let ret = {}
  for (let it of jses) {
    let filePath = path.relative(global.G_PATH.CONTEXT, it)
    let entryName = filePath.slice(0, -6)
    if (entryPrefixer) {
      entryName =
        path.dirname(entryName) + '/' + entryPrefixer + path.basename(entryName)
    }
    entryName = entryName.replace(/\\/g, '/')
    ret[entryName] = './' + filePath
  }

  return ret
}
