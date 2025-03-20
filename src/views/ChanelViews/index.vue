<template>
    <div class="app-container">
        <a-flex wrap="wrap" gap="small">
            <ChannelCard v-for="item in data" :key="item.id" :channel="item" />
        </a-flex>
        <div class="flex-center">
            <a-button type="primary" @click="getLinksList" :loading="loading">加载更多</a-button>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useConfigStore } from '@/stores/config'
import API from '@/api/cloud.js'
import axios from 'axios'
import ChannelCard from './ChannelCard.vue';
import { message } from 'ant-design-vue';
const configStore = useConfigStore()
const baseurl = ref(configStore.chanel_url)
const loading = ref(false)
const data = ref([])
const getLinksList = async () => {
    if (!baseurl.value) {
        API.getConfig().then((res) => {
            if (res[0].chanel_url) {
                baseurl.value = res[0].chanel_url
                configStore.setChangelUrl(res[0].chanel_url)
                getLinksList()
            } else {

                message.error('请先去【定时配置】页面配频道地址')
            }
        })
        return
    }

    let url = ''
    if (data.value.length > 0) {
        url = `${baseurl.value}/messages?before=${data.value[data.value.length - 1].id}`
    } else {
        url = `${baseurl.value}/messages`
    }
    loading.value = true
    axios
        .get(url)
        .then((res) => {
            // console.log('res>>>>', res.data.data)
            data.value = [...data.value, ...res.data.data.reverse()]
            // console.log('data >>>>>:', JSON.stringify(data.value))
            loading.value = false
            // refreshing.value = false
        })
        .catch(() => {
            loading.value = false
            // refreshing.value = false
            // finished.value = true
        })
}
onMounted(() => {
    getLinksList()
})
</script>
<style lang="less" scoped>
.flex-center {
    display: flex;
    justify-content: center;
    margin: 20px 0;
}
</style>
