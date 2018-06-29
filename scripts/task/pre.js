/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:08:05
* @Last Modified by:   jiayao.deng
* @Last Modified time: 2018-06-29 10:54:11
*/
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const colors = require('colors')
const leftPad = require('left-pad')
const path = require('path')
const touchJsdoc = require('../util/touch-jsdoc')
const touchEslintrc = require('../util/touch-eslintrc')

module.exports = () => {
  rimraf.sync(global.G_PATH.DIST)
  rimraf.sync(path.join(global.G_PATH.PROJECT, 'tmp'))
  rimraf.sync(path.join(global.G_PATH.PROJECT, 'jsdoc'))

  mkdirp.sync(path.join(global.G_PATH.DIST, 'static/img'), {})
  mkdirp.sync(path.join(global.G_PATH.DIST, 'static/css'), {})
  mkdirp.sync(path.join(global.G_PATH.DIST, 'static/js'), {})

  touchJsdoc()
  touchEslintrc()

  console.log(colors.bgGreen(`[task ${leftPad('pre', 12)}]`), 'done')
  return Promise.resolve()
}
