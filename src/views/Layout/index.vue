<template>
  <a-layout class="layout">
    <LayoutSider :collapsed="collapsed" />
    <a-layout>
      <div class="layout-header">
        <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
        <LayoutHeader />
      </div>
      <a-layout-content class="layout-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import LayoutSider from './LayoutSider.vue'
  import LayoutHeader from './LayoutHeader.vue'
  import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
  } from '@ant-design/icons-vue'

  const router = useRouter()
  const selectedKeys = ref<string[]>(['1'])
  const collapsed = ref<boolean>(false)
</script>
<style lang="less" scoped>
  .layout {
    height: 100%;
  }

  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }

  .trigger:hover {
    color: #1890ff;
  }

  .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.3);
    margin: 16px;
    border: 1px solid red;
  }

  .site-layout .site-layout-background {
    background: #fff;
  }

  .layout-header {
    height: 60px;
    background: #fff;
    padding: 0 20px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .layout-content {
    //border: 1px solid red;
    padding: 10px 10px;

    /* height: calc(100% - 60px); */
  }
</style>
