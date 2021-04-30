import Vue, {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/icon.css'
// 引入axios封装
import instance from './request/http.js'

// 在原型上扩展,这样不用在每个页面都导入axios实例
Vue.prototype.$axios = instance;

const app = createApp(App)
app
    .use(store)
    .use(router)
    .mount('#app')