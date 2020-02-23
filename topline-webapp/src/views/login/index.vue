<template>
    <div class="login">

        <!-- 导航栏 -->
        <van-nav-bar title="登录" />
            <!-- <ValidationProvider rules="required" v-slot="{ errors }">
    <input v-model="user.code" type="text">
    <span>{{ errors[0] }}</span>
    </ValidationProvider> -->

        <!-- 登录表单 -->

        <ValidationObserver tag="form" ref="loginForm">
            <!-- 手机号 -->
            <ValidationProvider rules="required|phone" v-slot="{ errors }" name="手机号">
                <van-field 
                    placeholder="请输入手机号" 
                    v-model="user.mobile" 
                    label="手机号" 
                    :error-message="errors[0]"/>
            </ValidationProvider>

            <!-- 验证码 -->
            <ValidationProvider rules="required" v-slot="{ errors }" name="验证码">
                <van-field 
                    placeholder="请输入验证码" 
                    type="password" 
                    v-model="user.code" 
                    label="验证码" 
                    :error-message="errors[0]"/>
            </ValidationProvider>

        </ValidationObserver>

        <!-- 登录按钮 -->
        <div class="btn_login">
            <van-button color="linear-gradient(70deg, #eae5c9, #6cc6cb)" :loading="isLoading" size="large" @click="onLogin">登录</van-button>
        </div>
    </div>
</template>

<script>
// 引入请求模块
import { login } from '../../api/user.js'
export default {
    name: 'Login',

    data () {
        return {
            // 手机号和验证码
            user: {
                mobile: '13911111111',
                code: '246810'
            },
            // 控制登录按钮的loading状态
            isLoading: false
        }
    },
    
    methods: {
        // 登录按钮
        async onLogin () {
         
            try {

                // 表单验证
                const isValid = await this.$refs.loginForm.validate()
                if (!isValid) {
                    // 如果验证失败不能提交表单
                    return
                }

                // 验证成功,提交表单
                // 开启按钮loading状态
                this.isLoading = true

                const { data } = await login(this.user)

                // 登陆成功,将token存储至vuex容器中
                this.$store.commit('setUser', data.data)

                this.$toast.success('登陆成功')
                this.$router.push('/')
            } catch (err) {
                if (err.response && err.response.status === 400) {
                    this.$toast.fail('登陆失败')
                }
            }
            // 关闭按钮loading状态
            this.isLoading = false
        }
        
    }

}
</script>

<style lang="less" scoped>
.login {
    .btn_login {
        padding: 20px;
    }
}
</style>