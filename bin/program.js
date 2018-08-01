#!/usr/bin/env node

const program = require('commander')
const utils = require('lazy-cache')(require)
const pkg = require('../package.json')
const pkgUpdate = require('../scripts/util/pkg-update')

require('./g-path')

pkgUpdate()

program.version(pkg.version)

// 新建项目
// 项目命名，生成模板文件
program
  .command('create')
  .description('create project')
  .action(() => {
    let exe = utils('../scripts/task/create')
    exe()()
  })

// 运行任务
program
  .command('flow')
  .description('take workflow')
  .action(() => {
    let exe = utils('../scripts/task/flow')
    exe()()
  })

// clean 任务
program
  .command('clean')
  .description('remove all tmp folders')
  .action(() => {
    let exe = utils('../scripts/task/clean')
    exe()()
  })

// pack 任务
program
  .command('pack')
  .description('pack files')
  .action(() => {
    let exe = utils('../scripts/task/pack')
    exe()()
  })

// upload 任务
program
  .command('deploy')
  .description('deploy to remote server')
  .action(() => {
    let exe = utils('../scripts/task/deploy')
    exe()()
  })

// 编译单文件，dist 文件符合 commonjs 规范
program
  .command('umd <library> <source> <dist>')
  .description('generate source code to dist, dist code conforms to the umd spec.')
  .action((library, source, dist) => {
    let exe = utils('../scripts/task/generate-umd')
    exe()(library, source, dist)
  })

program.parse(process.argv)
