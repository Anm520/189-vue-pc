<template>
  <a-modal :open="open" :wrap-style="{ overflow: 'hidden' }" @ok="handleOk" @cancel="open = false"
    class="ant-modal-dray">
    <a-spin :spinning="spinning">
      <div v-if="hasFolder">该目录下无文件夹</div>
      <a-radio-group v-model:value="value" v-else>
        <div v-for="item in folderList" :key="item.id">
          <a-radio :value="item.id">{{ item.name }}</a-radio>
        </div>
      </a-radio-group>
    </a-spin>
    <template #title>
      <div ref="modalTitleRef" class="modal-title" style="width: 100%; cursor: move">分享目录选择</div>
    </template>
    <template #modalRender="{ originVNode }">
      <div ref="modalRef" :style="transformStyle">
        <component :is="originVNode" />
      </div>
    </template>
  </a-modal>
</template>
<script setup>
import { onMounted, ref, useTemplateRef } from 'vue'
import { useModalDrag } from '@/hooks/index.js'
import API from '@/api/cloud.js'

const value = ref('')
const folderList = ref([])
const { options } = defineProps(['options'])
const modalTitleRef = ref(null)
const modalRef = ref(null)
const transformStyle = useModalDrag(modalRef, modalTitleRef)
const open = defineModel()
const hasFolder = ref(false)
const spinning = ref(false)
const $emit = defineEmits(['ok'])
onMounted(() => {
  console.log('options', options)
  spinning.value = true
  const shareParams = {
    noCache: Math.random(),
    ...options,
    // fileId,
    shareDirFileId: options.fileId,
    isFolder: true,
    orderBy: 'filename',
    descending: false,
  }
  API.getListShareDir(shareParams)
    .then((res) => {
      console.log('getListShareDir >>>>>:', res);
      folderList.value = res.fileListAO.folderList
      hasFolder.value = res.fileListAO.folderList.length == 0
    })
    .finally(() => {
      spinning.value = false
    })
})
const handleOk = () => {
  $emit('ok', value.value)
  open.value = false
}
</script>
<style scoped lang="less"></style>
