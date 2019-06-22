/*
 * @Author: dengjiayao
 * @Date:   2017-12-27 13:04:44
 * @Last Modified by:   dengjiayao
 * @Last Modified time: 2019-06-22 11:02:08
 */
const rimraf = require('rimraf')
const path = require('path')
const decorate = require('../util/decorate')

module.exports = () => {
  rimraf.sync(global.G_PATH.DIST)
  rimraf.sync(path.join(global.G_PATH.PROJECT, 'tmp'))
  rimraf.sync(path.join(global.G_PATH.PROJECT, 'zip'))

  console.log(decorate.info('clean'), 'done')
  return Promise.resolve()
}
