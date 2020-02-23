// 请求模块
// axios封装

// 引入axios
import axios from 'axios'
// 处理大数字
import JSONbig from 'json-bigint'
// 引入vuex容器
import store from '@/store' // 非组件中访问容器中的数据,谁访问谁加载

// 创建axios实例
const request = axios.create({
    baseURL: 'http://ttapi.research.itcast.cn/'
})

// 配置处理js超出安全整数范围
request.defaults.transformResponse = [function (data) {
    try {
        return JSONbig.parse(data)
    } catch (err) {
        return data
    }
}]

// 配置axios
// 请求拦截器
request.interceptors.request.use(function (config) {
    // 判断是否存在token,user里含有token
    const {user} = store.state
    if (user) {
        // 统一在请求头中添加token, 名字, 数据
        config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
}, function (error) {
    return Promise.reject(error)
})

// 响应拦截器
axios.interceptors.response.use(function (response) {
    return response
}, function (error) {
    return Promise.reject(error)
})


// 导出请求对象
export default request