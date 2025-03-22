<template>
  <div class="app-container">
    <div style="margin: 5px 0 15px 0">
      <a-input-search
        v-model:value="searchValue"
        placeholder="请输入搜索关键词"
        :loading="searchLoading"
        enter-button
        style="width: 305px"
        @search="onSearch"
        allow-clear />
    </div>
    <div class="views">
      <a-flex wrap="wrap" gap="small">
        <ChannelCard v-for="item in data" :key="item.id" :channel="item" />
      </a-flex>
      <div class="flex-center">
        <a-button type="primary" @click="getLinksList" :loading="loading" v-if="!searchValue">加载更多</a-button>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { onMounted, ref } from 'vue'
  import { useConfigStore } from '@/stores/config'
  import API from '@/api/cloud.js'
  import axios from 'axios'
  import ChannelCard from './ChannelCard.vue'
  import { message } from 'ant-design-vue'
  const configStore = useConfigStore()
  const baseurl = ref(configStore.chanel_url)
  const loading = ref(false)
  const data = ref([])
  const searchValue = ref('')
  const searchLoading = ref(false)
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
        data.value = [...data.value, ...res.data.data.reverse()]
        loading.value = false
      })
      .catch(() => {
        loading.value = false
      })
  }
  const onSearch = () => {
    if (!baseurl.value) {
      message.console.error('请先去【定时配置】页面配频道地址')
      return
    }
    if (searchValue.value) {
      data.value = []
      loading.value = true
      searchLoading.value = true
      axios
        .get(`${baseurl.value}/search?q=${searchValue.value}`)
        .then((res) => {
          data.value = res.data.data.reverse() || []
          loading.value = false
          searchLoading.value = false
        })
        .catch((err) => {
          data.value = []
          loading.value = false
          searchLoading.value = false
          console.log('error失败', err)
          message.error(err)
        })
    } else {
      data.value = []
      getLinksList()
    }
  }
  onMounted(() => {
    getLinksList()
  })
</script>
<style lang="less" scoped>
  .views {
    height: calc(100% - 50px);
    // border: 1px solid red;
    overflow: auto;
  }

  .flex-center {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
</style>
