/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:07:28
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-04-23 19:25:55
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

const projectRoot = process.cwd()

module.exports = async env => {
  env = aliasEnv(env)

  let postcssPlugins = getPostcssrc(env).plugins

  let csses = glob.sync('css/**/[!_]*.css', {
    nodir: true,
    cwd: path.join(projectRoot, 'client/static')
  })

  while (csses.length) {
    let it = csses.shift()
    let fromPath = path.join(projectRoot, 'client/static', it)
    let toPath = path.join(projectRoot, 'client/dist/static', it)
    let source = fs.readFileSync(fromPath)
    try {
      let result = await postcss(postcssPlugins).process(source.toString(), {
        from: fromPath,
        to: toPath,
        map: {
          inline: false
        }
      })

      mkdirp.sync(path.dirname(result.opts.to))
      fs.writeFileSync(result.opts.to, result.css)
      fs.writeFileSync(result.opts.to + '.map', result.map)

      console.log(
        colors.bgGreen(`[task ${leftPad('postcss', 12)}]`),
        path.relative(projectRoot, result.opts.to)
      )
    } catch (err) {
      console.log(colors.bgRed(`[task ${leftPad('postcss', 12)}]`), err)
      return Promise.reject(err)
    }
  }

  console.log(colors.bgGreen(`[task ${leftPad('postcss', 12)}]`), 'done')
}
