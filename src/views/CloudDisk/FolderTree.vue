<template>
  <div class="folder-tree">
    <a-directory-tree
        :expandedKeys="expandedKeys"
        :selectedKeys="[model]"
        :fieldNames="{ children: 'children', title: 'name', key: 'id' }"
        :load-data="onLoadData"
        :tree-data="treeData"
        @expand="handleExpand"
        @select="handleSelect">
    </a-directory-tree>
    <!--  -->
  </div>
</template>
<script setup>
  import API from '@/api/index.js'
  import { onMounted, watch, ref } from 'vue'
  import { ROOT_ID, ROOT_PATH } from '@/utils/constant.js'

  const { breadcrumb = ROOT_PATH } = defineProps(['breadcrumb'])

  const expandedKeys = ref(breadcrumb.map(item => item.id))
  // const selectedKeys = ref([ROOT_ID])
  const treeData = ref([{ id: ROOT_ID, name: '我的网盘' }])
  const model = defineModel({
    default: ROOT_ID,
  })

  function onLoadData (treeNode) {
    return API.getObjectFolderNodes({
          id: treeNode.dataRef.id,
          //   orderBy: 1,
          //   order: 'ASC',
          Cookie: document.cookie,
          noCache: Math.random(),
        })
        .then((res) => {
          treeNode.dataRef.children = res
        })
        .catch((err) => {
          treeNode.dataRef.children = []
        })
  }

  function handleSelect (hasSelectedKeys, { selected, selectedNodes, node, event }) {
    if (model.value !== node.id) {
      model.value = node.id
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

  function handleExpand (hasExpandedKeys, { expanded, node }) {
    console.log('🚀 ~ handleExpand ~ expanded:', expanded)
    console.log('hasExpandedKeys >>>', hasExpandedKeys)
    expandedKeys.value = [...hasExpandedKeys]
  }

  onMounted(() => {})
</script>
<style lang="less" scoped>
.folder-tree {
  height: 400px;
  width: 460px;
  //border: 1px;
  overflow: auto;
  // padding-bottom: 20px;
  //border-right: 1px solid red;
}
</style>
