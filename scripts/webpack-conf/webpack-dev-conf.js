/*
* @Author: dengjiayao
* @Date:   2017-12-27 13:21:05
* @Last Modified by:   jiayao.deng
* @Last Modified time: 2018-08-02 17:18:16
*/
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const { getBaseConf, getCustomConf } = require('./webpack-base-conf')
const getConfig = require('../util/config')

module.exports = () => {
  let baseConfig = getBaseConf('development')
  if (!baseConfig) {
    return
  }

  const renderType = getConfig('development')['renderType']
  if (renderType && renderType.indexOf('react') > -1) {
    Object.keys(baseConfig.entry).forEach(name => {
      let entry = baseConfig.entry[name]
      baseConfig.entry[name] = ['react-hot-loader/patch', entry]
    })
  }

  let customConfig = getCustomConf('development')

  return merge.smart(
    baseConfig,
    {
      cache: true,
      devtool: '#eval-source-map',
      output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: '/'
      },
      plugins: [new webpack.HotModuleReplacementPlugin()]
    },
    customConfig
  )
}
