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


// 获取文章详情
export const getArticle = (article_id) => {
    return request({
        method: 'get',
        url: `/app/v1_0/articles/${article_id}`
    })
}