<template>
    <div class="app-container">
        <a-space>
            <a-card hoverable style="width: 300px" v-for="item in data" :key="item.id">
                <template #cover>
                    <img alt="example" :src="item.image_url" v-if="item.image_url" />
                    <div style="width: 300px;height: 200px;" v-else>
                    </div>
                </template>
                <template #actions>
                    <setting-outlined key="setting" />
                    <edit-outlined key="edit" />
                    <ellipsis-outlined key="ellipsis" />
                </template>
                <a-card-meta :title="item.title" :description="item.text">
                    1111
                </a-card-meta>
            </a-card>
        </a-space>

    </div>
</template>
<script setup>
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue';
import { onMounted, ref } from 'vue'
import { useConfigStore } from '@/stores/config'
import API from '@/api/cloud.js'
import axios from 'axios'
const configStore = useConfigStore()
const baseurl = ref(configStore.chanel_url)
const data = ref([
    { "author": "直直直直直直男", "download_links": [{ "type": "高码", "url": "https://cloud.189.cn/t/nIBJZrqyAjmm" }], "id": "2437", "image_url": "", "size": "3.00GB", "tags": ["师兄", "师兄啊师兄", "动画", "连续剧"], "text": "师兄啊师兄（2023）4K 高码率 3G/集 更至EP81", "time": "2025-03-20T02:49:49+00:00", "title": "师兄啊师兄率 3G/集 (2023)", "views": "312" }, { "author": "🎯Just Silence", "download_links": [{ "type": "主链", "url": "https://cloud.189.cn/t/q6777zqIRZNb" }], "id": "2436", "image_url": "https://cdn5.cdn-telegram.org/file/T7LCw9RtNLQ4oF7PeuzpMQOYK_8eW8ati9Ta5FYKs8b1LlJiKySp87YdJDqO0jbhHWwwjS1_fhdeAhp9YuQ7TWE0pYbTm9SqL1tThlDBY5q3VBBRt-5IdRUHlW_0sq6nairtkaC9qQv18uNUMlffa6DTVW3KfxjRC-4LR-WHOvX8sA5TnrQ9vJ08fg4JcSGWm_3Z7ev3zAEYZrsnDtFxZvbwVkGmqojAFFiD8WnsGf3lasvLHyLUPXXfKD8S_B5DDED--A9yDclg4IIDhNYKfAAXwPC3gm8k-TJonhRdq0VHD3Ocl1WTOuuB0XyxuukZlWSZv_KU8DrfT1nVkg1KLg.jpg", "size": "", "tags": ["仁心俱乐部", "连续剧"], "text": "仁心俱乐部（2025）辛芷蕾 白客主演 4K 更至 EP32", "time": "2025-03-19T13:31:53+00:00", "title": "仁心俱乐部 (2025)", "views": "457" }])
const getLinksList = async () => {
    if (!baseurl.value) {
        API.getConfig().then(res => {
            if (res[0].chanel_url) {
                baseurl.value = res[0].chanel_url
                configStore.setChangelUrl(res[0].chanel_url)
                getLinksList()
            } else {
                showNotify({
                    type: 'danger',
                    message: '请先去【定时配置】页面配频道地址',
                    duration: 1000,
                })
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
    axios
        .get(url)
        .then((res) => {
            console.log('res>>>>', res.data.data)
            data.value = [...data.value, ...res.data.data.reverse()]
            console.log('data >>>>>:', JSON.stringify(data.value));
            // loading.value = false
            // refreshing.value = false
        })
        .catch(() => {
            // loading.value = false
            // refreshing.value = false
            // finished.value = true
        })
}
onMounted(() => {
    // getLinksList()
})
</script>
<style lang='less' scoped></style>