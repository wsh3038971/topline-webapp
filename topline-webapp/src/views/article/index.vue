<template>
    <div class="article-container">
        <!-- 标题 -->
        <van-nav-bar
            fixed
            left-arrow
            @click-left="$router.back()"
            title="文章详情"
        ></van-nav-bar>
        
        <!-- loading加载状态 -->
        <van-loading class="article-loading" v-if="loading" />

        <!-- 文章详情 -->
        <div class="detail" v-else-if="article.title">
            <h3 class="title">{{article.title}}</h3>

            <!-- 用户信息 -->
            <div class="author">
                <!-- 头像 -->
                <van-image round width="2rem" height="2rem" fit="fill" :src="article.aut_photo" />
                <!-- 用户名及时间 -->
                <div class="text">
                    <p class="name">{{article.aut_name}}</p>
                    <p class="time">{{article.pubdate}}</p>
                </div>
                <!-- 关注按钮 -->
                <van-button 
                    round 
                    size="small" 
                    type="info"
                    @click="onFollow"
                >{{article.is_followed ? '取消关注' : '+ 关注'}}</van-button>
            </div>

            <!-- 详细内容 -->
            <div class="content" v-html="article.content"></div>

            <!-- 点赞 -->
            <div class="zan">
                <van-button round size="small" hairline type="primary" plain icon="good-job-o">点赞</van-button>
                &nbsp;&nbsp; &nbsp;&nbsp;
                <van-button round size="small" hairline type="danger" plain icon="good-job-o">不喜欢</van-button>
            </div>
        </div>

        <!-- 请求失败 -->
        <div class="error" v-else>
            <p>网络超时,点击<a href="#" @click.prevent="loadArticle">刷新</a>试一试.</p>
        </div>
    
    </div>
</template>

<script>
import {getArticle} from '@/api/article'
import {followUser, unFollowUser} from '@/api/user'

export default {
    name: 'ArticleIndex',
    data () {
        return {
            loading: true,
            article: {}
        }
    },

    methods: {
        // 加载文章详情
        async loadArticle () {
            this.loading = true
            try {
                const {data} = await getArticle(this.$route.params.articleId)
                this.article = data.data
            } catch (err) {
                console.log(err)
            }
            this.loading = false
        },

        // 关注按钮
        onFollow () {
            const {is_followed: isFollow, aut_id: autId} = this.article
            // 判断是否关注
            if (isFollow) {
                // 已关注的情况下,点击取消关注
                unFollowUser(autId)
            } else {
                // 未关注的情况下,点击关注
                followUser(autId)
            }

            // 修改视图
            this.article.is_followed = !isFollow
        }
    },

    created () {
        this.loadArticle()
    }
}
</script>

<style lang="less" scoped>
.article-container {
    position: absolute;
    left: 0;
    top: 0;
    overflow-y: scoll;
    width: 100%;
    height: 100%;
    .article-loading {
        padding-top: 100px;
        text-align: center;
    }
    .error {
        padding-top: 100px;
        text-align: center;
    }
    .detail {
        padding: 50px 10px;
        .title {
            font-size: 16px;
        }
        .zan {
            text-align: center;
        }
        .author {
            padding: 10px 0;
            display: flex;
            .text {
                flex: 1;
                padding-left: 10px;
                line-height: 1.3;
                .name {
                    font-size: 14px;
                    margin: 0;
                }
                .time {
                    margin: 0;
                    font-size: 12px;
                    color: #999;
                }
            } 
        }
        .content {
                overflow: hidden;
                white-space: pre-wrap; // 保留空白符序列，但是正常地进行换行。
                word-break: break-all;  // 允许在单词内换行。
                /deep/ img {
                    min-width: 100%;
                    background: #f9f9f9;
                }
            }
    }
    /deep/ pre {
        overflow: auto;
    }
}
</style>