import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'


Vue.use(VueRouter)

const routes = [
  {
    name: 'login',  // 登录页
    path: '/login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

export default router
