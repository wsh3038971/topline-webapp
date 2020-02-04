// 请求模块
// axios封装

// 引入axios
import axios from 'axios'
// 处理大数字
import JSONbig from 'json-bigint'

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
// 相应拦截器

// 导出请求对象
export default request