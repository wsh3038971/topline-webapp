<template>
    <div class="login">

        <!-- 导航栏 -->
        <van-nav-bar title="登录" />

        <!-- 登录表单 -->
        <van-cell-group>
            <van-field placeholder="请输入手机号" label="手机号" />
            <van-field placeholder="请输入验证码" label="验证码" />
        </van-cell-group>

        <!-- 登录按钮 -->
        <van-button color="linear-gradient(to right, #4bb0ff, #6149f6)" size="large">登录</van-button>
    </div>
</template>

<script>
export default {
    name: 'Login'
}
</script>

<style>

</style>