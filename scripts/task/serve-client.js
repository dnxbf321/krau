/*
 * @Author: dengjiayao
 * @Date:   2018-04-25 16:18:40
 * @Last Modified by:   dengjiayao
 * @Last Modified time: 2019-06-22 11:11:52
 */
const webpack = require('webpack')
const DevServer = require('webpack-dev-server')
// const Dashboard = require('webpack-dashboard')
// const DashboardPlugin = require('webpack-dashboard/plugin')
const path = require('path')
const cssMiddleware = require('../util/express-postcss-middleware')
const getWpDevConfig = require('../webpack-conf/webpack-dev-conf')
const getNpxConfig = require('../util/config')

async function setup(krConf, wpConf) {
  const options = {
    contentBase: [
      global.G_PATH.DIST,
      path.join(global.G_PATH.DIST, 'static/'),
      path.join(global.G_PATH.DIST, 'asset/'),
    ],
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=0',
    },
    host: '127.0.0.1',
    port: krConf.client.port,
    publicPath: wpConf.output.publicPath,
    watchOptions: {
      pool: true,
    },
    stats: 'errors-only',
  }

  DevServer.addDevServerEntrypoints(wpConf, options)
  let compiler = webpack(wpConf)

  // const dashboard = new Dashboard()
  // compiler.apply(new DashboardPlugin(dashboard.setData))

  let server = new DevServer(compiler, options)
  server.use(
    cssMiddleware({
      src: global.G_PATH.CONTEXT,
      publicPath: wpConf.output.publicPath,
      env: 'development',
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
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
