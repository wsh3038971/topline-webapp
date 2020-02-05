// 用户相关请求模块

import request from '../utils/request.js'


// 登录请求
export const login = function (data) {
    return request({
        method: 'POST',
        url: '/app/v1_0/authorizations',
        data
    })
}