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


// 关注用户
export const followUser = (userId) => {
    return request({
        method: 'post',
        url: '/app/v1_0/user/followings',
        data: {
            target: userId
        }
    })
}


// 取消关注用户
export const unFollowUser = (userId) => {
    return request({
        method: 'delete',
        url: `/app/v1_0/user/followings/${userId}`
    })
}