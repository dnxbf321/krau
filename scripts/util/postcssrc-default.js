/*
 * @Author: dengjiayao
 * @Date:   2017-12-27 13:14:56
 * @Last Modified by:   dengjiayao
 * @Last Modified time: 2019-06-16 12:13:19
 */
const path = require('path')

module.exports = () => {
  return {
    'postcss-easy-import': {
      prefix: '_',
    },
    precss: {
      import: {
        disable: true,
      },
    },
    'postcss-pxtorem': {
      rootValue: 16,
      propWhiteList: [],
      selectorBlackList: [/^html$/],
    },
    'rucksack-css': {
      fallbacks: true,
    },
    'postcss-assets': {
      loadPaths: [path.join(global.G_PATH.STATIC, 'img')],
      basePath: 'client',
      baseUrl: '',
      cachebuster: false,
      relative: true,
    },
    autoprefixer: {},
    cssnano: {
      safe: true,
      discardComments: {
        removeAll: true,
      },
      filterPlugins: false,
    },
    'postcss-reporter': {
      clearMessages: true,
    },
  }
}
