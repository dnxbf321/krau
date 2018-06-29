/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:16:46
* @Last Modified by:   jiayao.deng
* @Last Modified time: 2018-06-29 10:41:06
*/
const path = require('path')
const fs = require('fs')
const { ncp } = require('ncp')

module.exports = () => {
  try {
    fs.accessSync(path.join(global.G_PATH.PROJECT, '.jsdoc.json'))
  } catch (e) {
    console.log(
      '[task          pre] .jsdoc.json can not access, ncp one copy from krau'
    )
    ncp(
      path.join(global.G_PATH.KR, '.jsdoc.json'),
      path.join(global.G_PATH.PROJECT, '.jsdoc.json')
    )
  }
}
