const Webpack = require('webpack')
const webpackBaseConfig = require('./webpack.config')
const WebpackDevServer = require('webpack-dev-server')
const portfinder = require('portfinder')
const webpackDevConfig = function () {
  return {
    open: true,
    hot: true,
    host: '0.0.0.0'
  }
}
const buildDev = async function () {
  const compiler = Webpack(webpackBaseConfig)
  portfinder.getPortPromise().then(port => {
    const server = new WebpackDevServer({ ...webpackDevConfig(), port }, compiler)
    server.start()
  })
}

buildDev()
