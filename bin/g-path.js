/*
* @Author: jiayao.deng
* @Date:   2018-06-29 09:50:26
* @Last Modified by:   jiayao.deng
* @Last Modified time: 2018-06-29 10:47:52
*/
const path = require('path')

const CWD = process.cwd()
global.G_PATH = {
  CWD,
  PROJECT: CWD,
  KR: path.join(__dirname, '..'),
  CONTEXT: path.join(CWD, 'client'),
  STATIC: path.join(CWD, 'client/static'),
  DIST: path.join(CWD, 'client/dist')
}
