<template>
  <a-layout-sider :collapsed="collapsed" :trigger="null" collapsible style="background: #000" :width="230">
    <div class="logo" />
    <a-menu :selectedKeys="selectedKeys" theme="dark" mode="inline" @click="handleClick" :items="menuItems"> </a-menu>
  </a-layout-sider>
</template>

<script lang="ts" setup>
  import { ref, reactive, h, computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { menuRoutes } from '@/router/index.js'

  defineProps({
    collapsed: Boolean,
  })
  const route = useRoute()
  const router = useRouter()

  const selectedKeys = computed(() => [route.path])

  // key: 'sub1',
  // icon: () => h(SettingOutlined),
  // label: 'Navigation Three - Submenu',
  // title: 'Navigation Three - Submenu',
  // children: []
  function getItems(routes) {
    let menus = []
    routes.forEach(({ path, name, children = null, meta = {} }) => {
      menus.push({
        key: path,
        icon: () => h(meta.icon),
        label: name,
        title: name,
        children: children ? getItems(children) : null,
      })
    })
    return menus
  }

  const menuItems = reactive(getItems(menuRoutes))

  function handleClick(params) {
    // console.log('params', params)
    if (params.key.includes('/')) router.push(params.key)
  }
</script>
<style lang="less" scoped>
  .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.3);
    margin: 16px;
    border: 1px solid red;
  }
</style>
