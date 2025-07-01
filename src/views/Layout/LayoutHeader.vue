<template>
  <a-space :size="16">
    <a-avatar>
      <template #icon>
        <UserOutlined />
      </template>
    </a-avatar>
    <span style="cursor: pointer;" @click="showModal">{{ account }}</span>
    <a-modal v-model:open="open" title="账号管理" @ok="handleOk" width="800px">
      <AccountList />
    </a-modal>
  </a-space>

</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
import { useCloudDiskStore } from '@/stores/CloudDisk.js'
import { hidePhone } from '@/utils'
import AccountList from '@/views/AccountList/index.vue'
const cloudDiskStore = useCloudDiskStore()
const account = computed(() => {
  if (cloudDiskStore.CloudDiskUserInfo.account) {
    return hidePhone(cloudDiskStore.CloudDiskUserInfo.account)
  }
  return ''
})
const open = ref(false);
const showModal = () => {
  open.value = true;
};

const handleOk = () => {
  open.value = false;
};
onMounted(() => {
  // getLoginName()
})
</script>
<style lang="less" scoped></style>
