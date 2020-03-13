/*
 * @Author: zj.wang
 * @Date: 2020-03-11 11:04:21
 * @LastEditors: zj.wang
 * @LastEditTime: 2020-03-11 11:13:54
 * @Description: 
 */

function resolve (dir) {
  return path.join(__dirname, dir)
}

const name = 'vuede'
const version = new Date().getTime()

module.exports = {

  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static/' + version,
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,

  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
}