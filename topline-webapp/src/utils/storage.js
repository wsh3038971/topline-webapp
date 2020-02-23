// 操作本地存储的方法

// 获取
export const getItem = (name) => {
    // 使用JSON.parse将本地存储的json转化为字符串
    return JSON.parse(window.localStorage.getItem(name))
}

// 设置
export const setItem = (name, data) => {
    // 由于本地存储的时候存的是字符串,所以需要使用JSON.stringify()转换成字符串
    window.localStorage.setItem(name, JSON.stringify(data))
}

// 删除
export const removeItem = () => {
    window.localStorage.removeItem(name)
}