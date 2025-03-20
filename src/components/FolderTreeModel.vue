<template>
  <a-modal
    :open="open"
    :wrap-style="{ overflow: 'hidden' }"
    @ok="handleOk"
    @cancel="open = false"
    class="ant-modal-dray">
    <FolderTree v-model="selectRow" :breadcrumb="breadcrumb" />
    <div>选中路径：{{ selectRow.fullNames.join(' / ') }}</div>
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
  import { ref, toRaw, watch } from 'vue'
  import FolderTree from './FolderTree.vue'
  import { ROOT_PATH } from '@/utils/constant.js'
  import { useModalDrag } from '@/hooks/index.js'
  const { breadcrumb = [ROOT_PATH] } = defineProps(['breadcrumb'])
  const $emit = defineEmits(['ok'])
  const open = defineModel({ default: false })
  const selectRow = ref(ROOT_PATH)
  const handleOk = (e) => {
    console.log('selectRow>>>>', selectRow.value)
    open.value = false
    $emit('ok', selectRow.value)
  }
  const modalTitleRef = ref(null)
  const modalRef = ref(null)
  const transformStyle = useModalDrag(modalRef, modalTitleRef)
</script>
