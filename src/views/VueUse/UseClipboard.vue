<template>
  <div>
    <div>是否支持一键复制：{{ isSupported }}</div>
    <div>是否复制：{{ copied }}</div>
    <div>复制的内容：{{ text }}</div>
    <a-input v-model:value="source"></a-input>
    <a-button type="primary" @click="onClick" style="margin-top: 5px">
      {{ copied ? '已复制' : '复制' }}
    </a-button>
  </div>
</template>

<script setup lang="ts">
  import { useClipboard } from '@vueuse/core'
  import { ref } from 'vue'
  import { message } from 'ant-design-vue'

  const source = ref('')

  // legacy:true 解决 ip地址 复制失败的问题
  const { text, copy, isSupported, copied } = useClipboard({ source, legacy: true })

  function onClick() {
    copy(source.value)
      .then(() => {
        message.success('复制成功')
      })
      .catch((e) => {
        message.error('复制失败')
      })
  }
</script>
<style lang="less" scoped></style>
