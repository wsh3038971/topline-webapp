// 时间处理模块
// 引入组件
import dayjs from 'dayjs'
// 引入相对时间插件
import rTime from 'dayjs/plugin/relativeTime'
// 引入语言包
import 'dayjs/locale/zh-cn'

// 配置使用中文
dayjs.locale('zh-cn')

// 注册使用相对时间插件
dayjs.extend(rTime)

// 导出
export const relativeTime = dateTime => {
    return dayjs().from(dayjs(dateTime))
}