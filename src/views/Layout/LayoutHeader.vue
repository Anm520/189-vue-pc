<template>
  <a-space :size="16">
    <a-avatar>
      <template #icon>
        <UserOutlined />
      </template>
    </a-avatar>
    <span>{{ cloudDiskStore.CloudDiskUserInfo.account }}</span>
  </a-space>
</template>

<script setup>
import { onMounted } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'

import TaskAPI from '@/api/cluodtask.js'
import OtherAPI from '@/api/index.js'
import { useCloudDiskStore } from '@/stores/CloudDisk.js'
const cloudDiskStore = useCloudDiskStore()
const getLoginName = () => {
  OtherAPI.getLoginName().then((res) => {
    cloudDiskStore.setCloudDiskUserInfo({ loginName: res.loginName })
    TaskAPI.updateUserInfo({ login_name: res.loginName }).then((update) => {
      // TaskAPI.getUserInfo({ login_name: res.loginName }).then((user) => {
      //   //   console.log(user)
      // })
    })
  })
  OtherAPI.getUserBriefInfo().then((res) => {
    cloudDiskStore.setCloudDiskUserInfo({ nickname: res.nickname, sessionKey: res.sessionKey })
  })
}
onMounted(() => {
  // getLoginName()
})
</script>
<style lang="less" scoped></style>
