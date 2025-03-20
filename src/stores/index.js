import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('default', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  const themeConfig = ref({
    token: {
      colorPrimary: '#165dff',
      borderRadius: 2,
    },
  })
  function setThemeColor(params) {
    themeConfig.value.token.colorPrimary = params
  }
  return { count, doubleCount, increment, themeConfig, setThemeColor }
})
