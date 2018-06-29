/*
* @Author: jiayao.deng
* @Date:   2018-06-28 13:42:00
* @Last Modified by:   jiayao.deng
* @Last Modified time: 2018-06-29 10:33:28
*/
const HtmlWebpackPlugin = require('html-webpack-plugin')
const glob = require('glob')
const path = require('path')
const getEntry = require('./webpack-entry')
const getConfig = require('../util/config')

const minify = {
  // 行内元素内容至多保留一个空格
  collapseBooleanAttributes: true, // disabled="disabled" => disabled
  collapseInlineTagWhitespace: true, // display:inline element collapseWhitespace=true
  collapseWhitespace: true, // <div> <p>    foo </p>    </div> => <div><p>foo</p></div>
  conservativeCollapse: true, // collapse to 1 space (never remove it entirely)
  preserveLineBreaks: true, // collapse to 1 line break (never remove it entirely)

  quoteCharacter: '"',

  removeComments: true, // 删除注释
  removeScriptTypeAttributes: true, // remove type="text/javascript"
  removeStyleLinkTypeAttributes: true, // remove type="text/css"
  useShortDoctype: true // html5 doctype
}

function collectHtmls(config) {
  let filters = config.webpack['entry-filter'] || []

  let htmlsInFolders = glob.sync('!(partial)/**/*', {
    cwd: global.G_PATH.CONTEXT + '/static/html'
  })
  let htmlsInCurDir = glob.sync('*.@(html|hbs)', {
    cwd: global.G_PATH.CONTEXT + '/static/html'
  })
  let htmls = [].concat(htmlsInFolders, htmlsInCurDir)

  let ret = []
  if (filters.length) {
    while (filters.length) {
      let filter = filters.shift()
      let reg = new RegExp(filter, 'i')
      ret = ret.concat(
        htmls.filter(name => {
          return reg.test(name)
        })
      )
    }
  } else {
    ret = htmls
  }

  return ret
}

function setHTMLPlugins(env, config, htmls) {
  let entryPrefixer = config.webpack['entry-prefixer'] || ''
  let webpackNoCommon = config.webpack['no-common'] || false
  let webpackNoHtmlInject = config.webpack['no-html-inject'] || false

  let chunks = getEntry(env)

  let plugins = htmls.map(it => {
    let withoutExt = it.replace(path.extname(it), '')

    let plugin = {}
    plugin.filename = withoutExt + '.html'
    plugin.template = 'static/html/' + it
    plugin.inject = !webpackNoHtmlInject
    plugin.minify = minify
    plugin.cache = true
    if (plugin.inject) {
      let chunkMatch = Object.keys(chunks).find(chunk => {
        return (
          chunk ===
          path.join('static/js', entryPrefixer + withoutExt).replace(/\\/g, '/')
        )
      })
      if (chunkMatch) {
        plugin.chunks = [chunkMatch]
        if (!webpackNoCommon) {
          plugin.chunks.unshift('static/js/' + entryPrefixer + 'common')
        }
      } else {
        plugin.chunks = []
      }
    } else {
      plugin.chunks = []
    }

    return new HtmlWebpackPlugin(plugin)
  })

  return plugins
}

module.exports = env => {
  let config = getConfig(env)
  let definitionConfig = getConfig(env, true)

  let htmls = collectHtmls(config)
  let plugins = setHTMLPlugins(env, config, htmls)

  return {
    module: {
      rules: [
        {
          test: /\.(hbs|html)$/,
          use: [
            {
              loader: 'handlebars-loader',
              options: {
                helperDirs: [path.join(global.G_PATH.STATIC, 'js/hbs-helper')],
                partialDirs: [path.join(global.G_PATH.STATIC, 'html/partial')]
              }
            },
            {
              loader: 'npx-handlebars-inject-loader',
              options: {
                data: definitionConfig
              }
            }
          ]
        }
      ]
    },
    plugins: [...plugins]
  }
}
