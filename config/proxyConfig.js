module.exports = {
    proxy: {
      '/api': {
        target: 'http://localhost:80/',  // 接口域名
        changeOrigin: true,  //是否跨域
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }