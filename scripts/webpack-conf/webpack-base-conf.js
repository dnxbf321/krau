/*
* @Author: dengjiayao
* @Date:   2018-01-26 15:42:48
* @Last Modified by:   tungjason
* @Last Modified time: 2018-05-02 11:08:13
*/
const webpack = require('webpack')
const progressBarWebpackPlugin = require('progress-bar-webpack-plugin')

const path = require('path')
const colors = require('colors')
const leftPad = require('left-pad')

const requireUncached = require('require-uncached')

const getDefinition = require('./webpack-definition')
const getEntry = require('./webpack-entry')
const getHtmlPlugins = require('./webpack-html-plugins')
const getConfig = require('../util/config')
const getPostcssrc = require('../util/postcssrc')
const babelrc = require('../util/babelrc')

const projectRoot = process.cwd()
const contextPath = path.join(projectRoot, 'client')
const staticRoot = path.join(contextPath, 'static')
const krRoot = path.join(__dirname, '../../')

const eslintrc = {
  cache: false,
  configFile: path.join(projectRoot, '.eslintrc.js'),
  formatter: require('eslint-friendly-formatter')
}

function getBaseConf(env) {
  let postcssPlugins = getPostcssrc(env).plugins
  let envConfig = getConfig(env)
  let definitionConfig = getConfig(env, true)
  let entry = getEntry(env)
  let htmlPlugins = getHtmlPlugins(env)
  let definition = getDefinition(env)

  let entryPrefixer = envConfig.webpack['entry-prefixer'] || ''
  let webpackNoCommon = envConfig.webpack['no-common'] || false

  // 无 entry，跳过
  if (Object.keys(entry).length === 0) {
    return
  }

  let conf = {
    mode: env === 'development' ? 'development' : 'production',
    context: contextPath,
    entry: entry,
    output: {
      path: path.join(projectRoot, 'client/dist')
    },
    resolve: {
      modules: [
        path.join(projectRoot, 'node_modules'),
        path.join(krRoot, 'node_modules')
      ],
      alias: {
        // see https://vuejs.org/guide/installation.html#Standalone-vs-Runtime-only-Build
        // https://vuejs.org/v2/guide/installation.html#Explanation-of-Different-Builds
        vue: env === 'development' ? 'vue/dist/vue.js' : 'vue/dist/vue.min.js'
      }
    },
    resolveLoader: {
      modules: [
        path.join(projectRoot, 'node_modules'),
        path.join(krRoot, 'node_modules')
      ]
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: [staticRoot],
          exclude: /node_modules/,
          use: [
            {
              loader: 'eslint-loader',
              options: eslintrc
            }
          ],
          enforce: 'pre'
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: babelrc
            }
          ]
        },
        {
          test: /\.(png|jpg|gif|svg|woff2?|eot|ttf)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1,
                name: '[path][name].[ext]?[hash]'
              }
            }
          ]
        },
        {
          test: /\.hbs$/,
          use: [
            {
              loader: 'handlebars-loader',
              options: {
                helperDirs: [path.join(staticRoot, 'js/hbs-helper')],
                partialDirs: [path.join(staticRoot, 'html/partial')]
              }
            },
            {
              loader: 'npx-handlebars-inject-loader',
              options: {
                data: definitionConfig
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: function() {
                  return postcssPlugins
                }
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.IgnorePlugin(/vertx/),
      new webpack.DefinePlugin(definition),
      new progressBarWebpackPlugin({
        format:
          colors.bgCyan(`[webpack ${leftPad('build', 9)}]`) +
          '[:bar] ' +
          colors.green.bold(':percent') +
          ' (:elapsed seconds)',
        clear: false
      })
    ].concat(htmlPlugins),
    optimization: {
      noEmitOnErrors: true
    }
  }
  if (!webpackNoCommon) {
    conf.optimization.splitChunks = {
      name: 'static/js/' + entryPrefixer + 'common',
      minChunks: 2
    }
  }
  return conf
}

function getCustomConf(env) {
  let webpackConfJs = path.join(projectRoot, 'webpack.config.js')
  try {
    let conf = requireUncached(webpackConfJs)
    return conf({
      babel: babelrc,
      eslint: eslintrc,
      postcss: getPostcssrc(env)
    })
  } catch (e) {
    return {}
  }
}

module.exports = {
  getBaseConf,
  getCustomConf
}
