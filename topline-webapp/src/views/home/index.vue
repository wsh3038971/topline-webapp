<template>
  <div class="home">
      <!-- 顶部 -->
      <van-nav-bar fixed>
          <van-button 
            class="search-btn"
            round 
            type="info" 
            slot="title"
            size="small"
            @click="$router.push('/search')"
          >搜索</van-button>
      </van-nav-bar>

      <!-- 频道列表 -->
        <van-tabs v-model="active">
            <van-tab :title="item.name" v-for="item in channels" :key="item.id">
                <!--  下拉刷新组件 -->
                <van-pull-refresh v-model="item.pullDownLoading" @refresh="onRefresh">
                    <!-- 文章列表 -->
                    <van-list
                        v-model="item.loading"
                        :finished="item.finished"
                        finished-text="没有更多了"
                        @load="onLoad"
                        >
                        <!-- 每一条的内容 -->
                        <van-cell 
                            v-for="article in item.articles" 
                            :key="article.art_id.toString()" 
                            :title="article.title"
                            @click="$router.push({
                                name: 'article',
                                params: {
                                    articleId: article.art_id.toString()
                                }    
                            })">
                            <!-- label插槽可以自定义标题下方描述 -->
                            <div slot="label">
                                <!-- 文章图片 -->
                                <van-grid :border="false" :column-num="3">
                                    <van-grid-item v-for="(img, index) in article.cover.images" :key="index">
                                        <!-- 图片懒加载插件
                                            使用v-lazy代替src
                                         -->
                                        <van-image height="80" :src="img" lazy-load></van-image>
                                    </van-grid-item>
                                </van-grid>

                                <!-- 描述信息 -->
                                <div class="article-info">
                                    <div class="meta">
                                        <span>{{article.aut_name}}</span>
                                        <span>{{article.comm_count}}评论</span>
                                        <!-- 相对时间处理 -->
                                        <span>{{article.pubdate | relativeTime}}</span>
                                    </div>
                                    <van-icon name="close" style="float: right"></van-icon>
                                </div>
                            </div>
                        </van-cell>
                    </van-list>
                </van-pull-refresh>
            </van-tab>

            <!-- 面包按钮 -->
            <div slot="nav-right" class="wap-nav" @click="show = true">
                <van-icon name="wap-nav" size="24"></van-icon>
            </div>
        </van-tabs>

        <!-- 编辑频道弹层 -->
        <van-popup
        v-model="show"
        position="bottom"
        round
        closeable
        close-icon-position="top-left"
        :style="{ height: '95%' }">
            <!-- 我的频道 -->
            <van-cell-group>
                <van-cell title="我的频道">
                    <van-button 
                        type="danger" 
                        size="mini"
                        @click="isEdit = !isEdit"
                    >{{isEdit ? '完成' : '编辑'}}</van-button>
                </van-cell>
                <van-grid :gutter="10">
                <van-grid-item
                    v-for="(channel, index) in channels"
                    :key="channel.id"
                    :text="channel.name"
                    @click="onUserChannelClick(channel, index)"
                >
                    <van-icon 
                        v-show="isEdit" 
                        class="close-icon" 
                        slot="icon" 
                        name="close" 
                    />
                </van-grid-item>
                </van-grid>
            </van-cell-group>

            <!-- 频道推荐 -->
            <!-- 所有频道减去我的频道 -->
            <van-cell-group>
                <van-cell title="频道推荐">
                </van-cell>
                <van-grid :gutter="10">
                <van-grid-item
                    v-for="channel in remainingChannels"
                    :key="channel.id"
                    :text="channel.name"
                    @click="addChannel(channel)"
                />
                </van-grid>
            </van-cell-group>
        </van-popup>
  </div>
</template>

<script>
import {getAllChannels, getUserChannels, resetUserChannels, deleteUserChannel} from '@/api/channel.js'
import {getArticles} from '@/api/article.js'
import {mapState} from "vuex"
import {getItem, setItem} from '@/utils/storage'

export default {
    name: 'HomeIndex',
    data () {
        return {
            active: 2,  // 默认激活的tab标签页的下标
            channels: [], // 我的频道
            show: false,  // 控制编辑频道弹窗的显示隐藏
            allChannels: [], // 所有频道
            isEdit: false  // 控制右上角关闭按钮
        }
    },

    computed: {
        ...mapState(['user']),

        // 获取当前频道数据
        currentChannel () {
            return this.channels[this.active]
        },

        // 获取推荐频道(所有频道减去我的频道)
        remainingChannels () {
            const channels = []
            // 遍历所有频道
            this.allChannels.forEach(item => {
                // 遍历我的频道
                // find()  遍历数组,返回符合条件的元素
                const index = this.channels.findIndex(channel => {
                    return channel.id === item.id
                })

                if (index == -1) {
                    // 如果没找到的话,将当前项push进新数组
                    channels.push(item)
                }
            })
            return channels
        }
    },

    methods: {

        // 我的频道中点击处理函数(切换&删除)
        async onUserChannelClick (channel, index) {
            if (this.isEdit) {
                // 如果是编辑状态下,删除频道
                
                this.channels.splice(index, 1)  // 将数据丛视图删除
                if (this.user) {
                    // 已登录,请求删除
                    await deleteUserChannel(channel.id)
                } else {
                    // 未登录,删除本地存储
                    setItem('channels', this.channels)
                }

            } else {
                // 如果是非编辑转态下,跳转到对应频道
                this.show = false
                this.active = index
            }
        },

        // 添加频道
        async addChannel (channel) {
            this.channels.push(channel)

            // 持久化
            if (this.user) {
                // 已登录,保存到服务器
                const channels = []
                // 遍历我的频道,但不包含第一个推荐频道,使用slice从第一个之后开始遍历
                this.channels.slice(1).forEach((item, index) => {
                    channels.push({
                        id: item.id,
                        seq: index + 2
                    })
                })
                await resetUserChannels(channels)
            } else {
                // 未登录,保存在本地
                setItem('channels', this.channels)
            }
        },

        // 下拉刷新处理函数
        async onRefresh () {
            // 1. 请求获取文章列表
            const {data} = await getArticles({
                channel_id: this.currentChannel.id,
                timestamp: Date.now(),  // 每次下拉刷新都给最新的时间戳
                with_top: 1
            })
            // 2. 将数据添加到当前频道数据列表顶部
            this.currentChannel.articles.unshift(...data.data.results)
            // 3. 关闭当前频道loading状态
            this.currentChannel.pullDownLoading = false
            // 4. 提示用户刷新成功
            this.$toast('刷新成功')
        },
        
        // 获取所有频道列表
        async loadChannels () {
            const {data} = await getAllChannels()
            const channels = data.data.channels
            channels.forEach(channel => {
                channel.articles = []
                channel.loading = false
                channel.finished = false
                channel.timestamp = null  // 用于获取下一页数据的时间戳
                channel.pullDownLoading = false // 当前频道下拉刷新默认状态
            })
            this.allChannels = channels
        },

        // 获取用户频道列表
        async loadAllChannels () {
            // const {data} = await getAllChannels ()


            // 判断用户是否登录
            //  已登录: 获取后端存储的频道列表
            //  未登录: 查看本地是否存储频道列表
            //         本地已存储频道列表,则获取使用
            //         本地没有储存频道列表,则获取推荐频道列表

            var channels = []
            // 判断用户是否登录
            if (this.user) {
                // 已登录的情况下
                const {data} = await getUserChannels()
                channels = data.data.channels
            } else {
                // 未登录的情况下
                const localChannels = getItem('channels')
                // 判断本地是否存有token
                if (localChannels) {
                    // 如果有拿来用
                    channels = localChannels
                } else {
                    // 如果没有则获取默认推荐频道列表,和已登录是同一个方法,后端会判断是否传入token,从而返回需要的频道数据
                    const {data} = await getUserChannels()
                    channels = data.data.channels
                }
            }


            // 为每一个频道初始化一个数组,存储文章列表,给每个频道初始化loading和finished控制每个频道的loading状态和是否加载结束
            channels.forEach(channel => {
                channel.articles = []
                channel.loading = false
                channel.finished = false
                channel.timestamp = null  // 用于获取下一页数据的时间戳
                channel.pullDownLoading = false // 当前频道下拉刷新默认状态
            })

            this.channels = channels
        },

        // 上拉加载更多处理函数
        async onLoad () {
            // 1. 请求加载文章列表
            const {data} = await getArticles({
                channel_id: this.currentChannel.id,
                // 第一页数据传递当前最新时间戳
                // 下一页数据传递上一页返回数据中的pre_timestamp
                // 有就传上一页返回数据中的时间戳,没有就传当前最新的时间戳
                timestamp: this.currentChannel.timestamp || Date.now(),
                with_top: 1
            })
            // 2. 将得到的文章列表添加到当前频道的.articles中
            this.currentChannel.articles.push(...data.data.results)
            // 3. 本次数据加载完毕,将onLoad设置为false 
            this.currentChannel.loading = false
            // 4. 判断数据是否已全部加载完毕
            if (data.data.pre_timestamp == null) {
                // 当pre_timestamp为null时,表示数据已经加载完毕
                this.currentChannel.finished = true;
            } else {
                // 如果pre_timestamp不为null,则存储上一次的时间戳
                this.currentChannel.timestamp = data.data.pre_timestamp
            }
        }
    },

    created () {
        this.loadAllChannels()  // 获取频道列表
        this.loadChannels()  // 获取全部频道列表
    }
}
</script>

<style lang='less' scoped>
.home {
    & /deep/ .van-tabs__content {
        margin-bottom: 50px;
    }
    & /deep/ .van-tabs__wrap {
        position: fixed;
        top: 45px;
        z-index: 2;
        left: 0;
        right: 0;
    }
    & /deep/ .van-tabs__content {
        margin-top: 90px;
    }
    .article-info {
        .meta span {
            margin-right: 10px;
        }
    }
    .wap-nav {
        position: sticky;  //粘性定位
        right: 5px;
        display: flex;
        align-items: center;
        background-color: #fff;
        opacity: 0.8;
    }
    .close-icon {
        position: absolute;
        top: -24px;
        left: 30px;
    }
    .van-cell {
        margin-top: 30px;
    }
    .search-btn {
        width: 100%;
        background-color: rgba(255, 255, 255, 0.4);
        border-color: transparent;
    }
}

    

</style>