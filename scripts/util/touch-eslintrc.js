/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:16:19
* @Last Modified by:   jiayao.deng
* @Last Modified time: 2018-06-29 10:40:08
*/
const path = require('path')
const fs = require('fs')
const { ncp } = require('ncp')

module.exports = () => {
  try {
    fs.accessSync(path.join(global.G_PATH.PROJECT, '.eslintrc.js'))
  } catch (e) {
    console.log(
      '[task          pre] eslintrc.js can not access, ncp one copy from krau'
    )
    ncp(
      path.join(global.G_PATH.KR, '.eslintrc.js'),
      path.join(global.G_PATH.PROJECT, '.eslintrc.js')
    )
  }
}
