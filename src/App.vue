<template>
  <a-config-provider :getPopupContainer="getPopupContainer" :locale="zhCN" :theme="themeConfig" componentSize="small">
    <router-view/>
  </a-config-provider>
</template>

<script setup>
  import zhCN from 'ant-design-vue/es/locale/zh_CN'

  import { useStore } from '@/stores'
  import { storeToRefs } from 'pinia'
  // import { theme } from 'ant-design-vue'
  // const { darkAlgorithm, compactAlgorithm } = theme

  const store = useStore()

  const { themeConfig } = storeToRefs(store)

  // 弹窗挂载位置
  function getPopupContainer (el, dialogContext) {
    if (dialogContext) {
      return dialogContext.getDialogWrap()
    } else {
      return document.body
    }
  }


</script>
<style lang="less" scoped></style>
