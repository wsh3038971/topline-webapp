import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Tabbar from '../views/tabbar'
import Home from '../views/home'
import Search from '../views/search'
import SerachResult from '../views/search-result'

Vue.use(VueRouter)

const routes = [
  {
    name: 'login',  // 登录页
    path: '/login',
    component: Login
  },
  // {
  //   name: 'login',  // 登录页重定向
  //   path: '/',
  //   redirect: '/login', 
  //   component: Login
  // },
  {
    name: 'search',  // 搜索列表
    path: '/search',
    component: Search
  },
  {
    name: 'search-result',  // 搜索结果
    path: '/search/:q',
    component: SerachResult
  },
  {
    // 嵌套路由如果有默认子路由则不需要name
    path: '/',
    component: Tabbar,
    children: [
      {
        name: 'home',
        path: '',
        component: Home
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
