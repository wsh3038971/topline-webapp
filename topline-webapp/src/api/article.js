// 文章相关请求模块

import request from '@/utils/request.js'


// 获取文章列表
export const getArticles = ({
    channel_id,
    timestamp,
    with_top
}) => {
    return request({
        method: 'GET',
        url: '/app/v1_1/articles',
        params: {
            channel_id,
            timestamp,
            with_top
        }
    })
}