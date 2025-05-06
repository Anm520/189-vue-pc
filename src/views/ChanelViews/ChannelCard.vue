<template>
    <div class="card">
        <div class="card-image">
            <a-image :width="300" :height="200" :src="channel.image_url"
                fallback="data:image/png;base64,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" />

            <div class="card-tags">
                <a-tag v-for="(tag, index) in channel.tags" :key="index" color="blue">{{ tag }}</a-tag>
            </div>
        </div>
        <div class="card-body">
            <div class="card-title">
                {{ channel.title }}
            </div>
            <div class="card-description">
                {{ channel.text }}
            </div>
            <div class="card-author">
                <div>
                    <UserOutlined /> {{ channel.author }}
                </div>
                <span>
                    <HistoryOutlined /> {{ dayjs(channel.time).format('YYYY/MM/DD HH:mm:ss') }}
                </span>
            </div>
        </div>
        <div class="card-download">
            <a-space style="flex-wrap: wrap;">
                <a-button type="primary" size="small" v-for="(link, index) in channel.download_links"
                    @click='handleClick(link.url)'>{{ link.type }}</a-button>
            </a-space>

        </div>
        <NewTaskModel :url="selectUrl" v-model="openModel" v-if="openModel" :isAdd="true" />
    </div>
</template>

<script setup>
import { UserOutlined, HistoryOutlined, EllipsisOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { ref } from 'vue'
import NewTaskModel from '../CloudDiskSubscribe/NewTaskModel.vue';
const props = defineProps({
    channel: {
        type: Object,
        default: () => {
            return {
                author: '🎯Just Silence',
                download_links: [{ type: '主链', url: 'https://cloud.189.cn/t/q6777zqIRZNb' }],
                id: '2436',
                image_url:
                    'https://cdn5.cdn-telegram.org/file/T7LCw9RtNLQ4oF7PeuzpMQOYK_8eW8ati9Ta5FYKs8b1LlJiKySp87YdJDqO0jbhHWwwjS1_fhdeAhp9YuQ7TWE0pYbTm9SqL1tThlDBY5q3VBBRt-5IdRUHlW_0sq6nairtkaC9qQv18uNUMlffa6DTVW3KfxjRC-4LR-WHOvX8sA5TnrQ9vJ08fg4JcSGWm_3Z7ev3zAEYZrsnDtFxZvbwVkGmqojAFFiD8WnsGf3lasvLHyLUPXXfKD8S_B5DDED--A9yDclg4IIDhNYKfAAXwPC3gm8k-TJonhRdq0VHD3Ocl1WTOuuB0XyxuukZlWSZv_KU8DrfT1nVkg1KLg.jpg',
                size: '',
                tags: ['仁心俱乐部', '连续剧'],
                text: '仁心俱乐部（2025）辛芷蕾 白客主演 4K 更至 EP32',
                time: '2025-03-19T13:31:53+00:00',
                title: '仁心俱乐部 (2025)',
                views: '457',
            }
        }
    }
})
const selectUrl = ref('')
const openModel = ref(false)
const handleClick = (url) => {
    console.log('click>>>>>', url)
    selectUrl.value = url
    openModel.value = true
}
</script>
<style lang='less' scoped>
.card {
    width: 300px;
    // border: 1px solid red;
    border: 1px solid #f0f0f0;
    cursor: pointer;

    &:hover {
        transition: box-shadow 0.2s, border-color 0.2s;

    }

    &:hover {
        border-color: transparent;
        box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);
    }

    .card-body {
        padding: 12px;
    }

    .card-title {
        color: rgba(0, 0, 0, 0.88);
        font-weight: 600;
        font-size: 16px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-bottom: 8px;
    }

    .card-description {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        line-height: 1.6;
        margin-bottom: 8px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        /* 设置为2行 */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        /* 允许换行 */
        word-wrap: break-word;
        /* 在需要时断开单词以进行换行 */
    }

    .card-download {
        border-top: 1px solid #f0f0f0;
        display: flex;
        border-radius: 0 0 2px 2px;
        height: 48px;
        padding: 0 12px;
        overflow-y: auto;
    }

    .card-image {
        width: 300px;
        height: 200px;
        position: relative;

        .card-tags {
            position: absolute;
            bottom: 5px;
            width: 100%;
            display: flex;
            justify-content: flex-end;
        }
    }

    .card-author {
        // position: absolute;
        // bottom: 0;
        color: rgba(0, 0, 0, 0.45);
        display: flex;
        justify-content: space-between;
    }
}
</style>
