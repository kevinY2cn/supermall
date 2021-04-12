const path = require('path')

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  test:123,
  configureWebpack: {
    resolve : {
      alias: {
        '@views' : path.resolve(__dirname,'src/views'),
        '@components' : path.resolve(__dirname,'src/components'),
        '@request' : path.resolve(__dirname,'src/request')
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:1111',
        pathRewrite: {'^/api' : ''},
        changOrigin: true,
      }
    }
  }
}
