import Vue from 'vue'
import Vuex from 'vuex'
import {getItem, setItem} from '@/utils/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 从本地存储取出数据
    user: getItem('user')
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      // 为了防止数据丢失,将数据存储在本地存储
      setItem('user', state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
