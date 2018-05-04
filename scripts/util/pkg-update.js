/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:14:12
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-05-04 10:24:35
*/
const updateNotifier = require('update-notifier')
const pkg = require('../../package.json')

module.exports = () => {
  let notifier = updateNotifier({
    pkg: pkg,
    updateCheckInterval: 1000 * 60 * 60 * 24
  })
  notifier.notify()
}
