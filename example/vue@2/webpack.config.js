/**
 * 自定义 webpack 任务配置
 * 默认配置请查看 wcx/script/webpack-conf
 * 配置项请参考：https://webpack.js.org/configuration/#options
 * 可使用 process.env.NODE_ENV 区分 development、experiment、production 环境
 */
module.exports = function(rcObject) {
  return {
    resolve: {
      alias: {
        // see https://vuejs.org/guide/installation.html#Standalone-vs-Runtime-only-Build
        // https://vuejs.org/v2/guide/installation.html#Explanation-of-Different-Builds
        vue:
          rcObject.env === 'development'
            ? 'vue/dist/vue.js'
            : 'vue/dist/vue.min.js'
      }
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: [
            {
              loader: 'vue-loader',
              options: {
                loaders: {
                  js:
                    'babel-loader?' +
                    JSON.stringify(rcObject.babel) +
                    '!eslint-loader?' +
                    JSON.stringify(rcObject.eslint)
                },
                postcss: rcObject.postcss
              }
            }
          ]
        }
      ]
    }
  }
}
