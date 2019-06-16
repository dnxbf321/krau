/*
 * @Author: dengjiayao
 * @Date:   2018-01-26 15:42:48
 * @Last Modified by:   dengjiayao
 * @Last Modified time: 2019-06-16 14:45:22
 */
const webpack = require('webpack')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const path = require('path')
const colors = require('colors')
const leftPad = require('left-pad')

const importFresh = require('import-fresh')

const getDefinition = require('./webpack-definition')
const getEntry = require('./webpack-entry')
const getHTMLConf = require('./webpack-html-conf')
const getCopyConf = require('./webpack-copy-conf')
const getConfig = require('../util/config')
const getPostcssrc = require('../util/postcssrc')

// automatically look for .eslintrc files
const eslintrc = {
  cache: false,
  formatter: require('eslint-friendly-formatter'),
}

function getBaseConf(env) {
  let postcssPlugins = getPostcssrc(env).plugins
  let envConfig = getConfig(env)
  let entry = getEntry(env)
  let definition = getDefinition(env)

  let entryPrefixer = envConfig.webpack['entry-prefixer'] || ''
  let webpackNoCommon = envConfig.webpack['no-common'] || false

  // 无 entry，跳过
  if (Object.keys(entry).length === 0) {
    return
  }

  let conf = {
    mode: env === 'development' ? 'development' : 'production',
    context: global.G_PATH.CONTEXT,
    entry: entry,
    output: {
      path: global.G_PATH.DIST,
    },
    resolve: {
      modules: [
        'node_modules',
        path.join(global.G_PATH.PROJECT, 'node_modules'),
        path.join(global.G_PATH.KR, 'node_modules'),
      ],
    },
    resolveLoader: {
      modules: [
        'node_modules',
        path.join(global.G_PATH.PROJECT, 'node_modules'),
        path.join(global.G_PATH.KR, 'node_modules'),
      ],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: [global.G_PATH.STATIC],
          exclude: /node_modules/,
          use: [
            {
              loader: 'eslint-loader',
              options: eslintrc,
            },
          ],
          enforce: 'pre',
        },
        {
          test: /\.jsx?$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: 'babel-loader',
            },
          ],
        },
        {
          test: /\.(png|jpg|gif|svg|woff2?|eot|ttf)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1,
                name: env === 'development' ? '[path][name].[ext]' : '[path][name].[hash:8].[ext]',
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: env === 'development',
              },
            },
            {
              loader: 'css-loader',
              options: {
                import: false,
                url: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: function() {
                  return postcssPlugins
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.IgnorePlugin(/vertx/),
      new webpack.DefinePlugin(definition),
      new MiniCssExtractPlugin({
        filename: env === 'development' ? '[name].css' : '[name].[hash:8].css',
      }),
    ],
    optimization: {
      noEmitOnErrors: true,
    },
    stats: {
      children: false,
      colors: true,
      entrypoints: false,
      modules: false,
    },
    performance: {
      maxEntrypointSize: Infinity,
      maxAssetSize: Infinity,
    },
  }
  if (!webpackNoCommon) {
    conf.optimization.splitChunks = {
      minChunks: 1,
      minSize: 30000,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      cacheGroups: {
        'async-vendor': {
          chunks: 'async',
          name: 'async-vendor',
          minChunks: 2,
          priority: -10,
        },
        async: {
          chunks: 'async',
          priority: -20,
          reuseExistingChunk: true,
        },
        default: {
          chunks: 'initial',
          name: 'static/js/' + entryPrefixer + 'common',
          minChunks: 2,
          priority: -30,
          reuseExistingChunk: true,
        },
      },
    }
  }

  let htmlConf = getHTMLConf(env)
  let copyConf = getCopyConf(env)
  return merge.smart(conf, htmlConf, copyConf)
}

function getCustomConf(env) {
  let webpackConfJs = path.join(global.G_PATH.PROJECT, 'webpack.config.js')
  try {
    let conf = importFresh(webpackConfJs)
    return conf({
      env,
      eslint: eslintrc,
      postcss: getPostcssrc(env),
    })
  } catch (e) {
    return {}
  }
}

module.exports = {
  getBaseConf,
  getCustomConf,
}
