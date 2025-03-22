<template>
  <a-space :size="16">
    <a-avatar>
      <template #icon>
        <UserOutlined />
      </template>
    </a-avatar>
    <span>{{ account }}</span>
  </a-space>
</template>

<script setup>
  import { onMounted, computed } from 'vue'
  import { UserOutlined } from '@ant-design/icons-vue'
  import { useCloudDiskStore } from '@/stores/CloudDisk.js'
  import { hidePhone } from '@/utils'
  const cloudDiskStore = useCloudDiskStore()
  const account = computed(() => {
    if (cloudDiskStore.CloudDiskUserInfo.account) {
      return hidePhone(cloudDiskStore.CloudDiskUserInfo.account)
    }
    return ''
  })
  onMounted(() => {
    // getLoginName()
  })
</script>
<style lang="less" scoped></style>
