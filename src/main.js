import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/icon.css'
import installElementPlus from './plugins/element'
// 引入axios封装
import instance from './request/http'


const app = createApp(App)
// 在原型上扩展,这样不用在每个页面都导入axios实例
app.config.globalProperties.$axios = instance
installElementPlus(app)
app
    .use(store)
    .use(router)
    .mount('#app')