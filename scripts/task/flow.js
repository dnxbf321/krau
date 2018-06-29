/*
* @Author: dengjiayao
* @Date:   2018-04-26 14:15:51
* @Last Modified by:   jiayao.deng
* @Last Modified time: 2018-06-29 14:32:54
*/
const inquirer = require('inquirer')
const utils = require('lazy-cache')(require)

const TASKS = {
  webpack: './webpack',
  pre: './pre',
  clean: './clean',
  pack: './pack',
  deploy: './deploy',
  babelAsset: './babel-asset',
  serveClient: './serve-client',
  postcss: './postcss'
}

async function exec(tasks, env) {
  while (tasks.length) {
    let task = tasks.shift()
    let taskExe = utils(task)
    await taskExe()(env)
  }
}

module.exports = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'flow',
        message: 'Choose a workflow:',
        choices: [
          {
            value: 0,
            name: 'local development (本地开发服务)'
          },
          { value: 1, name: 'build:development (项目编译：测试环境)' },
          { value: 2, name: 'build:experiment (项目编译：预发环境)' },
          { value: 3, name: 'build:production (项目编译：生产环境)' },
          { value: 4, name: 'pack (项目打包)' },
          { value: 5, name: 'deploy to remote server (部署到远程服务器)' },
          { value: 6, name: 'clean (清理)' }
        ]
      }
    ])
    .then(answers => {
      try {
        switch (answers.flow) {
          case 0:
            exec(
              [TASKS.pre, TASKS.babelAsset, TASKS.serveClient],
              'development'
            )
            break
          case 1:
            exec(
              [TASKS.pre, TASKS.babelAsset, TASKS.webpack, TASKS.postcss],
              'development'
            )
            break
          case 2:
            exec(
              [TASKS.pre, TASKS.babelAsset, TASKS.webpack, TASKS.postcss],
              'experiment'
            )
            break
          case 3:
            exec(
              [TASKS.pre, TASKS.babelAsset, TASKS.webpack, TASKS.postcss],
              'production'
            )
            break
          case 4:
            exec([TASKS.pack])
            break
          case 5:
            exec([TASKS.deploy])
            break
          case 6:
            exec([TASKS.clean])
            break
          default:
        }
      } catch (err) {
        throw new Error(err)
      }
    })
}
