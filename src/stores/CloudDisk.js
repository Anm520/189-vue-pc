import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCloudDiskStore = defineStore('CloudDisk', () => {

  const CloudDiskUserInfo = ref({ account: window.localStorage.getItem('account') || '', cookies: '' })

  function setCloudDiskUserInfo(params) {
    CloudDiskUserInfo.value = { ...CloudDiskUserInfo.value, ...params }
  }

  return { CloudDiskUserInfo, setCloudDiskUserInfo }
})
