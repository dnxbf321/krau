/*
 * @Author: dengjiayao
 * @Date:   2019-06-22 10:44:37
 * @Last Modified by:   dengjiayao
 * @Last Modified time: 2019-06-22 11:00:51
 */
const colors = require('colors')
const leftPad = require('left-pad')
module.exports = {
  info(text) {
    return `${colors.blue('ℹ')} ${colors.grey('｢task ' + leftPad(text, 12) + '｣')}:`
  },
  error(text) {
    return `${colors.red('×')} ${colors.grey('｢task ' + leftPad(text, 12) + '｣')}:`
  },
}
