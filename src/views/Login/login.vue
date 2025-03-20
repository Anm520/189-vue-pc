<template>
  <!--  :label-col="{ span: 8 }"-->
  <!--  :wrapper-col="{ span: 16 }"-->
  <a-form :model="formState" name="basic" @finish="onFinish" @finishFailed="onFinishFailed">
    <a-form-item label="账号" name="username" :rules="[{ required: true, message: '请输入账号!' }]">
      <a-input v-model:value="formState.username" placeholder="默认admin" />
    </a-form-item>

    <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码!' }]">
      <a-input-password v-model:value="formState.password" placeholder="默认admin" />
    </a-form-item>
    <!-- <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
      <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
    </a-form-item> -->
    <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
      <a-button type="primary" html-type="submit">登录</a-button>
    </a-form-item>
  </a-form>
</template>
<script setup>
import API from '@/api/cloud.js'
import { message } from 'ant-design-vue'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const formState = reactive({
  username: '',
  password: '',
})
const loginFn = () => {
  API.loginFn(formState).then((res) => {
    localStorage.setItem('username', formState.username)
    localStorage.setItem('token', res)
    message.success('登录成功')
    router.push('/cloud/index')
  })
}
const onFinish = (values) => {
  console.log('Success:', values)
  loginFn()
}
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo)
}
</script>
