/*
* @Author: jiayao.deng
* @Date:   2018-06-29 13:39:01
* @Last Modified by:   jiayao.deng
* @Last Modified time: 2018-08-01 16:14:13
*/
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = env => {
  return {
    plugins: [
      new CopyWebpackPlugin(
        [
          {
            // 拷贝图片、文字
            from: '!(dist)/**/*.+(png|jpg|gif|svg|woff2?|eot|ttf)',
            to: '[path][name].[ext]',
            toType: 'template'
          },
          {
            // 拷贝 asset 目录下除 .bl.js 文件
            from: 'asset/**/*!(.bl.)',
            to: '[path][name].[ext]',
            toType: 'template'
          }
        ],
        {
          context: global.G_PATH.CONTEXT
        }
      )
    ]
  }
}
