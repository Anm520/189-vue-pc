<template>
  <a-modal :open="open" :wrap-style="{ overflow: 'hidden' }" class="ant-modal-dray" @cancel="open = false">
    <FolderTree v-model="selectRow" :breadcrumb="breadcrumb" v-if="open" />
    <div>选中路径：{{ selectRow.fullNames.join(' / ') }}</div>
    <template #title>
      <div ref="modalTitleRef" class="modal-title" style="width: 100%; cursor: move">分享目录选择</div>
    </template>
    <template #modalRender="{ originVNode }">
      <div ref="modalRef" :style="transformStyle">
        <component :is="originVNode" />
      </div>
    </template>
    <template #footer>
      <div class="footer-btn">
        <a-button type="primary" @click="showCreateFolderModel = true">新建文件夹</a-button>
        <div>
          <a-button @click="open = false">取消</a-button>
          <a-button type="primary" @click="handleOk">确定</a-button>
        </div>
      </div>
    </template>
    <createFolderModel
      v-model="showCreateFolderModel"
      :parentFolderId="selectRow.id"
      @update="handleCreateFolder"
      :folderName="taskName" />
  </a-modal>
</template>
<script setup>
  import { handleError, ref, toRaw, watch } from 'vue'
  import FolderTree from './FolderTree.vue'
  import { ROOT_PATH } from '@/utils/constant.js'
  import { useModalDrag } from '@/hooks/index.js'
  import createFolderModel from '@/views/CloudDisk/components/createFolderModel.vue'
  const { breadcrumb = [ROOT_PATH], taskName = '' } = defineProps(['breadcrumb', 'taskName'])
  const $emit = defineEmits(['ok'])
  const open = defineModel({ default: false })
  const selectRow = ref(ROOT_PATH)
  const showCreateFolderModel = ref(false)

  const handleOk = (e) => {
    console.log('selectRow>>>>', selectRow.value)
    open.value = false
    $emit('ok', selectRow.value)
  }
  const modalTitleRef = ref(null)
  const modalRef = ref(null)
  const transformStyle = useModalDrag(modalRef, modalTitleRef)

  const handleCreateFolder = (folder) => {
    // selectRow.value = folderId
    showCreateFolderModel.value = false
    open.value = false
    $emit('ok', folder)
  }
</script>
<style lang="less" scoped>
  .footer-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
