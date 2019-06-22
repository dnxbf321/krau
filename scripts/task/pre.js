/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:08:05
* @Last Modified by:   dengjiayao
* @Last Modified time: 2019-06-22 11:11:23
*/
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const path = require('path')
const touchEslintrc = require('../util/touch-eslintrc')
const decorate = require('../util/decorate')

module.exports = () => {
  rimraf.sync(global.G_PATH.DIST)
  rimraf.sync(path.join(global.G_PATH.PROJECT, 'tmp'))

  mkdirp.sync(path.join(global.G_PATH.DIST, 'static/img'), {})
  mkdirp.sync(path.join(global.G_PATH.DIST, 'static/css'), {})
  mkdirp.sync(path.join(global.G_PATH.DIST, 'static/js'), {})

  touchEslintrc()

  console.log(decorate.info('pre'), 'done')
  return Promise.resolve()
}
