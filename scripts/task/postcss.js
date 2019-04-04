/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:07:28
* @Last Modified by:   jiayao.deng
* @Last Modified time: 2019-04-04 14:01:23
*/
const glob = require('glob')
const mkdirp = require('mkdirp')
const colors = require('colors')
const leftPad = require('left-pad')
const postcss = require('postcss')
const path = require('path')
const fs = require('fs')
const aliasEnv = require('../util/alias-env')
const getPostcssrc = require('../util/postcssrc')

module.exports = async env => {
  env = aliasEnv(env)

  let postcssPlugins = getPostcssrc(env).plugins

  let csses = glob.sync('css/**/[!_]*.css', {
    nodir: true,
    cwd: global.G_PATH.STATIC
  })

  while (csses.length) {
    let it = csses.shift()
    let fromPath = path.join(global.G_PATH.STATIC, it)
    let toPath = path.join(global.G_PATH.DIST, 'static', it)
    let source = fs.readFileSync(fromPath)
    try {
      let result = await postcss(postcssPlugins).process(source.toString(), {
        from: fromPath,
        to: toPath,
        map:
          env === 'production'
            ? false
            : {
                inline: false
              }
      })

      mkdirp.sync(path.dirname(result.opts.to))
      fs.writeFileSync(result.opts.to, result.css)
      env !== 'production' && fs.writeFileSync(result.opts.to + '.map', result.map)

      console.log(colors.bgGreen(`[task ${leftPad('postcss', 12)}]`), path.relative(global.G_PATH.PROJECT, result.opts.to))
    } catch (err) {
      console.log(colors.bgRed(`[task ${leftPad('postcss', 12)}]`), err)
      return Promise.reject(err)
    }
  }

  console.log(colors.bgGreen(`[task ${leftPad('postcss', 12)}]`), 'done')
}
