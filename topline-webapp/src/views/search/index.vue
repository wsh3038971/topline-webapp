<template>
	<div class="search">

		<!-- 搜索框 -->
		<form action="/">
			<van-search
				v-model="searchText"
				placeholder="请输入搜索关键词"
				show-action
				@search="onSearch(searchText)"
				@cancel="onCancel"
			/>
		</form>

		<!-- 联想建议 -->
		<van-cell-group v-if="searchText">
			<van-cell
				icon="search"
				v-for="item in suggestions"
				:key="item"
				@click="onSearch(item)"
			>	
				<!-- 直接写渲染不出来HTML标签 -->
				<!-- <div slot="title">{{item}}</div> -->
				<!-- 需要渲染HTML标签需要使用v-html -->
				<div slot="title" v-html="highLight(item)"></div>
			</van-cell>
		</van-cell-group>

		<!-- 历史记录 -->
		<van-cell-group v-else>
			<van-cell title="历史记录">
				<template v-if="isDeleteShow">
					<span style="margin-right: 10px" @click="searchHistories = []">全部删除</span>
					<span @click="isDeleteShow = false">完成</span>
				</template>
				<van-icon
					v-else
					slot="right-icon"
					name="delete"
					style="line-height: inherit"
					@click="isDeleteShow = true"
				/>
			</van-cell>
			<van-cell 
				:title="value" 
				v-for="(value, index) in searchHistories" 
				:key="value"
				@click="onSearch(item)"
			>
				<van-icon 
					slot="right-icon" 
					name="close" 
					style="line-height: inherght"
					v-show="isDeleteShow"
					@click.stop="searchHistories.splice(index, 1)"
				/>
			</van-cell>
		</van-cell-group>
	</div>
</template>

<script>

import {getSearchSuggestions} from '@/api/search'
import {setItem, getItem} from '@/utils/storage'
import {debounce} from 'lodash'

export default {
	name: 'SearchIndex',
	data () {
		return {
			searchText: '',  // 搜索框数据
			suggestions: [],  // 联想建议数据
			isDeleteShow: false,  // 删除图标显示隐藏
			searchHistories: getItem('search-histories') || []  // 搜索历史记录(本地如果有就用本地,没有就用空数组)
		}
	},

	watch: {
		// 监听data中的searchText数据变化
		searchText: debounce(async function (newValue) {
			// 校验非空
			if (!newValue.length) {
				return 
			}

			// 请求获取数据
			const {data} = await getSearchSuggestions(newValue)

			// 搜索结果高亮处理
			// data.data.options.forEach((item,index) => {
			// 	// 使用正则匹配搜索的字符串
			// 	// g为全局,i为忽略大小写
			// 	const reg = new RegExp(newValue, 'gi')
			// 	// 将所有正则匹配到的字符串替换为高亮显示的
			// 	data.data.options[index] = item.replace(reg, `<span style="color: red">${newValue}</span>`)	
			// });


			this.suggestions = data.data.options
			// 模板绑定
		}, 1000),

		// 搜索历史记录删除同步至本地
		searchHistories (newValue) {
			// 数据变化后将新数据存至本地覆盖原数据
			setItem('search-histories', newValue)
		}
	},

	methods: {
		onSearch (q) {
			// 记录历史记录
			// 判断历史记录列表内是否包含当前搜索的关键词
			if (!this.searchHistories.includes(q)) {
				// 不包含的话存入数组
				this.searchHistories.unshift(q)
			} else {
				// 包含的话,则先将其移除
				const index = this.searchHistories.findIndex(item => {
					return item.trim() === q
				})
				if (index !== -1) {
					this.searchHistories.splice(index, 1)
				}
				// 再将其追加至数组头部
				this.searchHistories.unshift(q)

			}
				// 为了防止数据丢失,将历史搜索记录存至本地
				setItem('search-histories', this.searchHistories)
		

			// 跳转到搜索页面
			this.$router.push({
				name: 'search-result',
				params: {
					q
				}
			})
		},
		onCancel () {},
		// 关键字高亮处理(只改变视图渲染结果,不改变原数据的情况下)
		highLight (str) {
			const reg = new RegExp(this.searchText, 'gi')
			return str.replace(reg, `<span style="color: red">${this.searchText}</span>`)	
		}
	}
}
</script>

<style>

</style>