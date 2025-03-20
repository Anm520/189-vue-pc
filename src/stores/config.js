import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  const chanel_url = ref('')
  function setChangelUrl(url) {
    chanel_url.value = url
  }
  return { chanel_url, setChangelUrl }
})
