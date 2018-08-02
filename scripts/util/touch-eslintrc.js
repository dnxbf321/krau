/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:16:19
* @Last Modified by:   jiayao.deng
* @Last Modified time: 2018-08-02 14:56:11
*/
const path = require('path')
const fs = require('fs')
const { ncp } = require('ncp')

module.exports = () => {
  try {
    fs.accessSync(path.join(global.G_PATH.PROJECT, '.eslintrc'))
  } catch (e) {
    console.log('[task          pre] .eslintrc is not accessible, use copy from krau')
    ncp(path.join(global.G_PATH.KR, '.eslintrc'), path.join(global.G_PATH.PROJECT, '.eslintrc'))
  }
}
