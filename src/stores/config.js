import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  const chanel_url = ref('http://141.147.11.144:9528')
  function setChangelUrl(url) {
    chanel_url.value = url
  }
  return { chanel_url, setChangelUrl }
})
