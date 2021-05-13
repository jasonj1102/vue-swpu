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
          title: '系统首页',
        },
        component: () => import (
            /* webpackChunkName: "dashboard" */
            "../views/Dashboard.vue")
      },
      {
        path: "/number",
        name: "number",
        meta: {
          title: '电话管理',
        },
        component: () => import(
            "../views/Number.vue")
      },
      {
        path: "/order",
        name: "order",
        meta: {
          title: '派单管理',
        },
        component: () => import(
            "../views/Order.vue")
      },
      {
        path: "/student",
        name: "student",
        meta: {
          title: '人员管理',
        },
        component:()=> import(
            "../views/Student.vue")
      },
      {
        path: "/tool",
        name: "tool",
        meta: {
          title: '工具管理',
        },
        component:()=> import(
            "../views/Tool.vue")
      },
      {
        path: "/fine",
        name: "fine",
        meta: {
          title: '奖惩管理',
        },
        component:()=> import(
            "../views/Fine.vue")
      },
      {
        path: "/reward",
        name: "reward",
        meta: {
          title: '总奖惩',
        },
        component:()=> import(
            "../views/Reward.vue")
      },
      {
        path: "/solveOrder",
        name: "solveOrder",
        meta: {
          title: '登单管理',
        },
        component:()=> import(
            "../views/SolveOrder.vue")
      },
      {
        path: "/solveOrderForm",
        name: "solveOrderForm",
        meta: {
          title: '登单表单',
        },
        component:()=> import(
            "../views/SolveOrderForm.vue")
      },
      {
        path: "/workLoad",
        name: "workLoad",
        meta: {
          title: '工作量统计',
        },
        component:()=> import(
            "../views/WorkLoad.vue")
      },
      {
        path: "/system",
        name: "system",
        meta: {
          title: '系统用户设置',
        },
        component:()=> import(
            "../views/System.vue")
      },
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
  document.title = `${to.meta.title} | vue-swpu`;
  const token = localStorage.getItem('token');
  // 要进入的路由不是/login且token为null,跳转至登录界面
  if (to.path !== '/login' && !token){
    next('/login')
  }
  else{
    next()
  }
  /**
   * else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin'
            ? next()
            : next('/403');
    } else {
        next();
    }
   */

});

export default router;