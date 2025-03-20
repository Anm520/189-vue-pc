<template>
  <div class="login">
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed">
      <a-form-item
        label="设置cookie"
        name="username"
        :rules="[{ required: true, message: 'Please input your username!' }]">
        <a-textarea v-model:value="formState.username" :auto-size="{ minRows: 8, maxRows: 10 }" style="width: 800px" />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">Submit</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup>
  import API from '@/api/index.js'
  import { reactive, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const formState = reactive({
    username: '',
  })

  const onFinish = (values) => {
    console.log('cookie >>>', values.username.replace(/\s+/g, ''))
    // 去除所有空格
    const noSpacesStr = values.username.replace(/\s+/g, '')
    const arr = noSpacesStr.split(';')
    document.cookie = ''
    arr.forEach((item) => {
      document.cookie = item
    })
    API.setCookies().then((res) => {
      router.push('/home')
    })
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  function parseCookies(cookieString) {
    const cookies = {}
    cookieString.split('; ').forEach((cookie) => {
      const parts = cookie.split('=')
      if (parts.length === 2) {
        cookies[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1])
      }
    })
    return cookies
  }

  function getCookieDetails() {
    const cookieString = document.cookie
    const cookies = parseCookies(cookieString)
    Object.entries(cookies).forEach(([name, value]) => {
      console.log(`Cookie Name: ${name}, Value: ${value}`)
    })
  }

  onMounted(() => {
    // 使用示例
    getCookieDetails()
  })
</script>
<style lang="less" scoped>
  .login {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
