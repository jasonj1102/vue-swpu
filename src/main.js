import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/icon.css'
import installElementPlus from './plugins/element'
// 引入axios封装
// import instance from './request/http'
import api from './api/index'


const app = createApp(App)
// 在原型上扩展,这样不用在每个页面都导入axios实例,vue3.0过后这样写
// app.config.globalProperties.$axios = instance
app.config.globalProperties.$api = api
installElementPlus(app)
app
    .use(store)
    .use(router)
    .mount('#app')