/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:16:46
* @Last Modified by:   tungjason
* @Last Modified time: 2018-05-02 11:08:16
*/
const path = require('path')
const fs = require('fs')
const { ncp } = require('ncp')

const krRoot = path.join(__dirname, '../../')
const projectRoot = process.cwd()

module.exports = () => {
  try {
    fs.accessSync(path.join(projectRoot, '.jsdoc.json'))
  } catch (e) {
    console.log('[task          pre] .jsdoc.json can not access, ncp one copy from krau')
    ncp(path.join(krRoot, '.jsdoc.json'), path.join(projectRoot, '.jsdoc.json'))
  }
}
