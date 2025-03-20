<template>

  <a-card class="folder-tree">
    <a-directory-tree :expandedKeys="expandedKeys" :selectedKeys="[model.id]"
      :fieldNames="{ children: 'children', title: 'name', key: 'id' }" :load-data="onLoadData" :tree-data="treeData"
      @expand="handleExpand" @select="handleSelect">
    </a-directory-tree>
    <!--  -->
  </a-card>
</template>
<script setup>
import API from '@/api/cloud.js'
import { onMounted, watch, ref } from 'vue'
import { ROOT_ID, ROOT_PATH } from '@/utils/constant.js'

const { breadcrumb = [ROOT_PATH] } = defineProps(['breadcrumb'])
const keys = breadcrumb.map(item => item.id)
const expandedKeys = ref(keys)
// const selectedKeys = ref([ROOT_ID])
const treeData = ref([ROOT_PATH])
const model = defineModel({
  default: () => {
    return ROOT_PATH
  },
})

function onLoadData(treeNode) {
  const pData = treeNode.dataRef
  return API.getObjectFolderNodes({
    id: pData.id,
    //   orderBy: 1,
    //   order: 'ASC',
    Cookie: document.cookie,
    noCache: Math.random(),
  })
    .then((res) => {
      treeNode.dataRef.children = res.map(item => {
        return { ...item, fullIds: [...pData.fullIds, item.id], fullNames: [...pData.fullNames, item.name] }
      })
    })
    .catch((err) => {
      treeNode.dataRef.children = []
    })
}

function handleSelect(hasSelectedKeys, { selected, selectedNodes, node, event }) {
  console.log('selectedNodes>>>', node)
  if (model.value.id !== node.id) {
    model.value = node
  }
  if (expandedKeys.value.includes(node.id)) {
    expandedKeys.value = expandedKeys.value.filter((item) => item !== node.id)
  } else {
    expandedKeys.value = [...expandedKeys.value, node.id]
  }
}

watch(model, (val) => {
  expandedKeys.value = [...expandedKeys.value, val]
})

function handleExpand(hasExpandedKeys, { expanded, node }) {
  expandedKeys.value = [...hasExpandedKeys]
}

</script>
<style lang="less" scoped>
.folder-tree {
  height: 400px;
  width: 460px;
  overflow: auto;

}
</style>
