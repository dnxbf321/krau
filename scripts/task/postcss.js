/*
 * @Author: dengjiayao
 * @Date:   2017-12-27 13:07:28
 * @Last Modified by:   dengjiayao
 * @Last Modified time: 2019-06-22 11:10:51
 */
const glob = require('glob')
const mkdirp = require('mkdirp')
const postcss = require('postcss')
const path = require('path')
const fs = require('fs')
const aliasEnv = require('../util/alias-env')
const getPostcssrc = require('../util/postcssrc')
const decorate = require('../util/decorate')

module.exports = async env => {
  env = aliasEnv(env)

  let postcssPlugins = getPostcssrc(env).plugins

  let csses = glob.sync('css/**/[!_]*.css', {
    nodir: true,
    cwd: global.G_PATH.STATIC,
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
                inline: false,
              },
      })

      mkdirp.sync(path.dirname(result.opts.to))
      fs.writeFileSync(result.opts.to, result.css)
      env !== 'production' && fs.writeFileSync(result.opts.to + '.map', result.map)

      console.log(decorate.info('postcss'), path.relative(global.G_PATH.PROJECT, result.opts.to))
    } catch (err) {
      console.log(decorate.error('postcss'), err)
      return Promise.reject(err)
    }
  }

  console.log(decorate.info('postcss'), 'done')
}
