/*
* @Author: dengjiayao
* @Date:   2018-04-25 16:18:40
* @Last Modified by:   jiayao.deng
* @Last Modified time: 2018-06-29 14:30:12
*/
const webpack = require('webpack')
const DevServer = require('webpack-dev-server')
const colors = require('colors')
const leftPad = require('left-pad')
const path = require('path')
const cssMiddleware = require('../util/express-postcss-middleware')
const getWpDevConfig = require('../webpack-conf/webpack-dev-conf')
const getNpxConfig = require('../util/config')

async function setup(krConf, wpConf) {
  const options = {
    contentBase: [
      global.G_PATH.DIST,
      path.join(global.G_PATH.DIST, 'static/'),
      path.join(global.G_PATH.DIST, 'asset/')
    ],
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=0'
    },
    host: '127.0.0.1',
    port: krConf.client.port,
    publicPath: wpConf.output.publicPath,
    watchOptions: {
      pool: true
    },
    stats: {
      children: false,
      colors: true,
      entrypoints: false,
      modules: false
    }
  }

  DevServer.addDevServerEntrypoints(wpConf, options)
  let compiler = webpack(wpConf)

  let server = new DevServer(compiler, options)
  server.use(
    cssMiddleware({
      src: global.G_PATH.CONTEXT,
      publicPath: wpConf.output.publicPath,
      env: 'development'
    })
  )

  return server
}

module.exports = async () => {
  let krConf = getNpxConfig('development')
  let wpConf = getWpDevConfig()

  let app = await setup(krConf, wpConf)

  let PORT = krConf.client.port
  return new Promise((resolve, reject) => {
    app.listen(PORT, '0.0.0.0', err => {
      if (err) {
        console.log(colors.bgRed(`\n[task ${leftPad('dev-server', 12)}]`), err)
        reject(err)
      } else {
        console.log(
          colors.bgGreen(`\n[task ${leftPad('dev-server', 12)}]`),
          `files on port: ${PORT}`
        )
        resolve()
      }
    })
  })
}
