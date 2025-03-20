<template>
  <div class="app-container">
    <FilesView :FolderId="Folder.id"/>
  </div>

</template>

<script setup lang="ts">
  import {ref, watch} from 'vue'
  import FolderTree from './FolderTree.vue'
  import FilesView from './FilesView.vue'
  import {ROOT_ID} from '@/utils/constant.js'

  const Folder = ref({id: ROOT_ID, name: '我的网盘'})
</script>
<style lang="less" scoped></style>
