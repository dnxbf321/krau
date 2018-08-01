/*
* @Author: jiayao.deng
* @Date:   2018-07-31 17:20:19
* @Last Modified by:   jiayao.deng
* @Last Modified time: 2018-08-01 14:51:44
*/
const webpack = require('webpack')
const path = require('path')
const getPostcssrc = require('../util/postcssrc')

module.exports = function(entry, libraryName) {
  const postcssPlugins = getPostcssrc('production', {
    'postcss-pxtorem': false,
    'rucksack-css': false,
    'postcss-assets': false
  }).plugins

  return (conf = {
    mode: 'production',
    cache: false,
    devtool: false,
    context: global.G_PATH.CWD,
    entry,
    output: {
      filename: '[name].js',
      chunkFilename: '[name].js',
      path: global.G_PATH.CWD,
      library: libraryName,
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    resolve: {
      modules: ['node_modules', path.join(global.G_PATH.KR, 'node_modules')]
    },
    resolveLoader: {
      modules: ['node_modules', path.join(global.G_PATH.KR, 'node_modules')]
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    require.resolve('babel-preset-env'),
                    {
                      modules: false,
                      targets: {
                        browsers: ['last 2 versions', '> 5%', 'safari >= 8', 'ie >= 10', 'Firefox ESR', 'iOS >= 8', 'android >= 4']
                      }
                    }
                  ],
                  require.resolve('babel-preset-stage-2')
                ],
                plugins: [require.resolve('babel-plugin-transform-runtime')]
              }
            }
          ]
        },
        {
          test: /\.(css|less|scss)$/,
          use: [
            {
              loader: 'css-loader',
              options: {
                import: false,
                url: false
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: function() {
                  return postcssPlugins
                }
              }
            }
          ]
        }
      ]
    },
    plugins: [new webpack.IgnorePlugin(/vertx/)],
    optimization: {
      noEmitOnErrors: true,
      splitChunks: false
    }
  })
}
