<template>
    <div>
        <a-form :label-col="{ span: 8 }" :model="formData" :wrapper-col="{ span: 16 }" autocomplete="off" name="basic"
            @finish="onFinish">
            <a-form-item label="帐号" name="username">
                <a-input v-model:value="formData.username" style="width: 260px"
                    :rules="[{ required: true, message: '请输入帐号', trigger: 'blur' }]" />
            </a-form-item>
            <a-form-item label="密码" name="password">
                <a-input v-model:value="formData.password" style="width: 260px" type="password"
                    :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]" />
            </a-form-item>
            <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                <a-button html-type="submit" type="primary" :loading="loading">修改密码</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import API from '@/api/cloud.js'
import { message } from 'ant-design-vue'
const router = useRouter()
const formData = ref({
    username: window.localStorage.getItem('username'),
    password: '',

})
const loading = ref(false)
const onFinish = (values) => {
    loading.value = true
    API.registerFn(formData.value).then(res => {
        message.success('修改成功')
        window.localStorage.setItem('token', '')
        window.localStorage.setItem('username', '')
        router.push('/login')
    }).finally(() => {
        loading.value = false
    })
}
</script>
<style lang='less' scoped></style>