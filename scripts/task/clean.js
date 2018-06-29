/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:04:44
* @Last Modified by:   jiayao.deng
* @Last Modified time: 2018-06-29 10:44:42
*/
const rimraf = require('rimraf')
const colors = require('colors')
const leftPad = require('left-pad')
const path = require('path')

module.exports = () => {
  rimraf.sync(global.G_PATH.DIST)
  rimraf.sync(path.join(global.G_PATH.PROJECT, 'tmp'))
  rimraf.sync(path.join(global.G_PATH.PROJECT, 'jsdoc'))
  rimraf.sync(path.join(global.G_PATH.PROJECT, 'zip'))

  console.log(colors.bgGreen(`[task ${leftPad('clean', 12)}]`), 'done')
  return Promise.resolve()
}
