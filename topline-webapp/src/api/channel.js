// 频道相关请求模块

import request from '../utils/request.js'

// 获取所有频道列表
export const getAllChannels =  () => {
    return request({
        method: 'get',
        url: '/app/v1_0/channels'
    })
}

// 获取用户频道列表或默认推荐频道列表
export const getUserChannels =  () => {
    return request({
        method: 'get',
        url: '/app/v1_0/user/channels'
    })
}

// 重置用户列表
export const resetUserChannels = (channels) => {
    return request({
        method: 'put',
        url: '/app/v1_0/user/channels',
        data: {
            channels
        }
    })
}

// 删除指定频道
export const deleteUserChannel = (channelId) => {
    return request({
        method: 'delete',
        url: `/app/v1_0/user/channels/${channelId}`
    })
}