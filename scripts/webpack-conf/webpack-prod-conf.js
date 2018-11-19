/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:31:07
* @Last Modified by:   jiayao.deng
* @Last Modified time: 2018-11-19 09:52:12
*/
const webpack = require('webpack')
const merge = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')
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
  if (config.webpack.banner) {
    plugins.push(
      new webpack.BannerPlugin({
        banner: config.webpack.banner + ' | built at ' + new Date(config.version) + '\n',
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
          new TerserPlugin({
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
