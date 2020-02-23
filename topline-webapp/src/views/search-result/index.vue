<template>
    <div class="search-result">

        <!-- 导航栏 -->
        <van-nav-bar
            :title="`${$route.params.q}的搜索结果`"
            left-arrow
            fixed
            @click-left="$router.back()"
        />

        <!-- 搜索结果展示列表 -->
        <van-list
            class="article-list"
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
            <van-cell 
                v-for="item in list" 
                :key="item.art_id.toString()" 
                :title="item.title" 
            />
        </van-list>
    </div>
</template>

<script>
import {getSearch} from '@/api/search'

export default {
    name: 'SearchResult',
    data() {
        return {
            list: [],
            loading: false,
            finished: false,
            page: 1  // 页数
        };
    },
    methods: {
        async onLoad() {
            // 发送请求
            const {data} = await getSearch({
                page: 1,
                perPage: 10,
                q: this.$route.params.q
            })
            // 将请求结果保存到当前组件
            this.list.push(...data.data.results)
            // 关闭loading
            this.loading = false
            // 判断是否已全部加载结束
            if (data.data.results.length) {
                //  如果有,更新页码
                this.page++
            } else {
                //  如果已结束,则将finished设置为true,不在onload
                this.finished = true
            }
        }
    }
}
</script>

<style scoped lang="less">
.article-list {
    margin-top: 46px;
}
</style>