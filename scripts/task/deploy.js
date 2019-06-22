/*
 * @Author: dengjiayao
 * @Date:   2017-12-27 13:10:13
 * @Last Modified by:   dengjiayao
 * @Last Modified time: 2019-06-22 11:06:03
 */
const scp = require('scp2')
const glob = require('glob')
const extend = require('extend')
const fs = require('fs')
const path = require('path')
const getConfig = require('../util/config')
const decorate = require('../util/decorate')

function collectPaths(patterns = ['*', '.*']) {
  let paths = []
  patterns.forEach(pattern => {
    let _paths = glob.sync(pattern, {
      cwd: global.G_PATH.PROJECT,
      ignore: ['.git', '*.log*', 'node_modules', 'zip', 'log', 'tmp', '.DS_Store'],
    })
    paths = paths.concat(_paths)
  })
  return paths
}

function deploy(currentPath, ftp, options) {
  const { remotePath, keepWrapFolder } = ftp
  let local = path.resolve(global.G_PATH.PROJECT, currentPath)
  let stats = fs.statSync(local)
  let remote
  if (keepWrapFolder) {
    if (stats.isFile()) {
      remote = path.dirname(path.resolve(remotePath, currentPath))
    } else if (stats.isDirectory()) {
      remote = path.resolve(remotePath, currentPath)
    }
  } else {
    remote = remotePath
  }

  return new Promise((resolve, reject) => {
    scp.scp(
      local,
      extend(options, {
        path: remote,
      }),
      err => {
        if (err) {
          console.log(decorate.error('deploy'), err)
          reject(err)
        } else {
          console.log(decorate.info('deploy'), local + ' => ' + remote)
          resolve()
        }
      }
    )
  })
}

module.exports = async () => {
  let { ftp } = getConfig('development')
  let remotePath = ftp.remotePath
  let time = Date.now()

  const options = {
    port: 22,
    host: ftp.host,
    username: ftp.username,
    password: ftp.password,
  }
  let client = new scp.Client(options)

  await client.mkdir(remotePath)

  let paths = collectPaths(ftp.patterns)
  while (paths.length) {
    let currentPath = paths.shift()
    try {
      await deploy(currentPath, ftp, options)
    } catch (err) {
      console.log(decorate.error('deploy'), err)
    }
  }

  client.close()

  console.log(decorate.info('deploy'), 'done in ' + (Date.now() - time) / 1000 + 's')
}
