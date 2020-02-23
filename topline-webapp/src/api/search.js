// 搜索相关接口模块

import request from '../utils/request'


// 获取联想建议
export const getSearchSuggestions = (q) => {
    return request({
        method: 'get',
        url: '/app/v1_0/suggestion',
        params: {
            q
        }
    })
}

// 获取搜索结果
export const getSearch = ({page, per_page, q}) => {
    return request({
        method: 'get',
        url: '/app/v1_0/search',
        params: {
            page,  // 页数,不传默认为1
            per_page,  // 每页数量
            q // 搜索关键词
        }
    })
}