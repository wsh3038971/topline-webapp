import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入公共样式
import './styles/index.css'

// 引入vee-validate验证插件

import {ValidationProvider, extend, ValidationObserver} from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'  // 加载所有验证规则
import zhCN from 'vee-validate/dist/locale/zh_CN.json' // 加载中文 


// 按需注册vant组件
import { Button, 
          NavBar,
          Field,
          Cell,
          CellGroup,
          Toast} from 'vant';

Vue.use(Button)
    .use(NavBar)
    .use(Field)
    .use(Cell)
    .use(CellGroup)
    .use(Toast);

// 配置表单验证插件

// 配置中文提示
for (let rule in rules) {
  extend(rule, {
    ...rules[rule],
    message: zhCN.messages[rule] 
  })
}

// 自定义验证规则
extend('phone', {
  validate (value) {
    return /^1[3456789]\d{9}$/.test(value)
  },
  message: '手机号格式不正确'
})


Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);




Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
