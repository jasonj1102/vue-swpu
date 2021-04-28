import {createRouter, createWebHistory} from "vue-router";
import Home from "../views/Home.vue";

// 路由信息对象
const routes = [
    {
      // 匹配到根路径，重定向至系统主页
        path: '/',
        redirect: '/dashboard'
    }, {
      // 根路径是home组件
        path: "/",
        name: "Home",
        component: Home,
        children: [
          {
            // 跳转至系统首页组件
              path: "/dashboard",
              name: "dashboard",
              meta: {
                  title: '系统首页'
              },
              component: () => import (
              /* webpackChunkName: "dashboard" */
              "../views/Dashboard.vue")
          }
        ]
    }, {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import (
        /* webpackChunkName: "login" */
        "../views/Login.vue")
    }
];

// 创建一个路由实例
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

// 判断是否为登录状态，没有登录默认跳转至/login路径下
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin'
            ? next()
            : next('/403');
    } else {
        next();
    }
});

export default router;