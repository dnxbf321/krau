/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:31:07
* @Last Modified by:   dengjiayao
* @Last Modified time: 2018-04-26 14:10:01
*/
const webpack = require('webpack')
const merge = require('webpack-merge')
const JsDocPlugin = require('jsdoc-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')
const { getBaseConf, getCustomConf } = require('./webpack-base-conf')
const getConfig = require('../util/config')

module.exports = env => {
  let config = getConfig(env)
  if (!config) {
    return
  }

  let customConfig = getCustomConf(env)

  let publicPath = config.client.publicPath.replace(/\\/g, '/')
  if (!/\/+$/.test(publicPath)) {
    publicPath += '/'
  }

  let plugins = []
  if (config.jsdoc) {
    plugins.push(
      new JsDocPlugin({
        conf: path.join(process.cwd(), '.jsdoc.json')
      })
    )
  }
  if (config.webpack.banner) {
    plugins.push(
      new webpack.BannerPlugin({
        banner:
          config.webpack.banner +
          ' | built at ' +
          new Date(config.version) +
          '\n',
        entryOnly: true
      })
    )
  }

  return merge.smart(
    getBaseConf(env),
    {
      cache: false,
      devtool: false,
      output: {
        filename: '[name].[chunkhash:8].js',
        chunkFilename: '[name].[chunkhash:8].js',
        publicPath
      },
      plugins,
      optimization: {
        minimizer: [
          new UglifyJSPlugin({
            cache: true,
            exclude: /node_modules/,
            parallel: true
          })
        ]
      }
    },
    customConfig
  )
}
