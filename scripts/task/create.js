/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:06:03
* @Last Modified by:   jiayao.deng
* @Last Modified time: 2018-06-29 10:46:42
*/
const colors = require('colors')
const leftPad = require('left-pad')
const DecompressZip = require('decompress-zip')
const inquirer = require('inquirer')
const mkdirp = require('mkdirp')
const path = require('path')
const fs = require('fs')

function createProjectFolder(destPath) {
  if (fs.existsSync(destPath)) {
    let stats = fs.statSync(destPath)
    if (stats.isDirectory()) {
      throw new Error(`${destPath} is already exists`)
    }
  }
  mkdirp.sync(destPath, {})
}

function makeFile(tpl, destPath) {
  let zipFile = path.join(global.G_PATH.KR, 'template/' + tpl + '.zip')
  let unzipper = new DecompressZip(zipFile)
  unzipper.on('error', err => {
    throw new Error(err)
  })
  unzipper.on('extract', () => {
    console.log(colors.bgGreen(`[task ${leftPad('create', 12)}]`), 'done')
  })
  unzipper.extract({
    path: destPath
  })
}

/**
 * 新建项目
 *  step 1: 命名
 *  step 2: 选取模板
 */
module.exports = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'pkg',
        message: 'Name the project:'
      },
      {
        type: 'list',
        name: 'tpl',
        message: 'Choose a template:',
        choices: [
          {
            name: 'normal (compatible with react.js)',
            value: 'normal(react)'
          },
          { name: 'vue@2.x', value: 'vue@2' }
        ]
      }
    ])
    .then(answers => {
      const destPath = path.join(process.cwd(), answers.pkg)
      try {
        createProjectFolder(destPath)
        makeFile(answers.tpl, destPath)
      } catch (err) {
        console.log(colors.bgRed(`[task ${leftPad('create', 12)}]`), err)
      }
    })
}
