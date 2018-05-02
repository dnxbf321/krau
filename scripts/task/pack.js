/*
* @Author: dengjiayao
* @Date:   2018-01-26 15:56:28
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-04-26 15:49:58
*/
const archiver = require('archiver')
const mkdirp = require('mkdirp')
const colors = require('colors')
const leftPad = require('left-pad')
const path = require('path')
const fs = require('fs')

const projectRoot = process.cwd()

function getNow() {
  const now = new Date()
  return (
    now.getFullYear() +
    ('0' + (now.getMonth() + 1)).slice(-2) +
    ('0' + now.getDate()).slice(-2) +
    'T' +
    ('0' + now.getHours()).slice(-2) +
    ('0' + now.getMinutes()).slice(-2) +
    ('0' + now.getSeconds()).slice(-2)
  )
}

module.exports = async () => {
  let packageConfig = require(path.join(projectRoot, 'package.json'))

  mkdirp(path.join(projectRoot, 'zip'))

  let pack = (zipName, patterns, ctx) => {
    return new Promise((resolve, reject) => {
      let zip = archiver('zip', {
        level: 9
      })

      let outputFilename = getNow() + '_' + packageConfig.name + '-' + zipName
      let output = fs.createWriteStream(path.join(projectRoot, 'zip', outputFilename))
      output.on('close', () => {
        console.log(
          colors.bgGreen(`[task ${leftPad('pack', 12)}]`),
          outputFilename + ' has been finalized. ' + zip.pointer() + ' total bytes'
        )
        resolve()
      })

      zip.on('error', err => {
        console.log(colors.bgRed(`[task ${leftPad('pack', 12)}]`), err)
        reject(err)
      })
      zip.pipe(output)

      patterns = [].concat(patterns)
      patterns.forEach(pattern => {
        zip.glob(pattern, {
          cwd: ctx,
          ignore: [
            '*.log*',
            'node_modules',
            'node_modules/**/*',
            'zip',
            'zip/**/*',
            'log',
            'log/**/*',
            'tmp',
            'tmp/**/*',
            '.git',
            '.git/**/*',
            '.DS_Store'
          ]
        })
      })
      zip.finalize()
    })
  }

  try {
    await pack('static.zip', '**/*', path.join(projectRoot, 'client/dist'))
    await pack('source.zip', ['.*', '*', '*/**/*', 'client/**/*'], projectRoot)
  } catch (err) {
    return Promise.reject(err)
  }
}
