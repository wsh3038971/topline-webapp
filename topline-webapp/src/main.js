import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 按需注册vant组件
import { Button, 
          NavBar,
          Field } from 'vant';

  Vue.use(Button)
    .use(NavBar)
    .use(Field);




Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
