/**
 * 对axios进行封装
 * 1. 设置请求超时时间
 * 2. 添加请求拦截器，在有token存在时向请求的头部添加token
 * 3. 添加响应拦截器，根据服务器返回状态进行相应的结果返回
 */
import axios from "axios"
import Qs from 'qs'
import router from "../router";

// 创建axios实例，供全局使用
const instance = axios.create({
// 后端请求地址
// baseURL: "localhost:8080/api",
// 请求头的格式
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  timeout: 5000,
// 表示跨域请求时是否需要使用凭证
// withCredentials: true
})

// 在请求前拦截，为请求头里加上token信息
instance.interceptors.request.use(
  config => {
    //当请求路径不是登录的时候，加上token信息
    // 这里在请求/api/solveOrder/update是把对象格式化错误了
    if(config.method == "post"&&(config.url!='/api/solveOrder/update'&&config.url!='/api/solveOrder/insert')){
      config.data = Qs.stringify(config.data);
    }
    console.log(config.data)
    if(config.url!='/api/user/login'){
      config.headers.Authorization = localStorage.getItem('token');
    }
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject();
  }
);

//在响应后拦截
instance.interceptors.response.use(
  response => {
    if (response.status === 200&&response.data.result.code!==402) {
      console.log(response)
      console.log(response.data.result)
      return response.data.result;
    } else {
      //this.$message.error(response.data.result.message)
      window.alert("token is expired,please login again!")
      router.replace({
        path:'/login'
      }).then()
    }
  },
  error => {
    console.log(error);
    return Promise.reject();
  }
);

export default instance;