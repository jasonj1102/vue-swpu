module.exports = {
  publicPath:'./',//静态资源包打包为相对路径
  outputDir:'dist',//输出文件
  devServer:{
      open:false,
      host:'localhost',
      port:8081,
      hot:true,
      proxy: {
          '/api': {
            target:'http://localhost:8080', // 你请求的第三方接口
            changeOrigin:true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
            pathRewrite:{
              '^/api':'/api'  //如果不写为空的话，vue中写成/api/get发送至后端就只剩/get了
            }
          }
      },  
  }
}