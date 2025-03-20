<template>
  <div class="app-container">
    <div>
      <a-button type="primary" @click="onClearRecycle" :loading="loading">清空回收站</a-button>
    </div>
    <a-table :columns="columns" :dataSource="dataSource" :pagination="false" :scroll="{ y: 'clac(100% - 100px)' }"
      :loading="tableLoading" rowKey="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <span>
            <img v-if="record.isFolder" alt="" src="@/assets/img/folder.png"
              style="width: 28px; height: 28px; margin-right: 10px" />
            {{ record.name }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'size'">
          <span v-if="!record.size">文件夹</span>
          <span v-else>{{ getFileSize(record.size) }}</span>
        </template>
        <template v-if="column.dataIndex === 'lastOpTime'">
          <span>{{ dayjs(record.lastOpTime).fromNow() }}</span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import API from '@/api/cloud.js'
import { onMounted, ref } from 'vue'
import { getFileSize } from '@/utils/index.js'
import dayjs from '@/hooks/useDayjs.js'
const tableLoading = ref(false)
const columns = [
  {
    title: '文件名',
    dataIndex: 'name',
    key: 'name',
    //   maxWidth: 800,
    width: '40%',
    //   minWidth: 100,
    //   resizable: true,
  },
  {
    title: '大小',
    dataIndex: 'size',
    key: 'size',
  },
  {
    title: '修改时间',
    dataIndex: 'lastOpTime',
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
  },
]
const dataSource = ref([])
onMounted(() => {
  getList()
})
const getList = () => {
  tableLoading.value = true
  API.getRecycleList()
    .then((res) => {
      console.log('回收站列表>>', res)
      const folderList = res.folderList.map((item) => {
        return { ...item, isFolder: true }
      })
      const fileList = res.fileList.map((item) => {
        return { ...item, isFolder: false }
      })
      dataSource.value = [...folderList, ...fileList]
    })
    .finally(() => {
      tableLoading.value = false
    })
}
const loading = ref(false)
// 清空回收站
const onClearRecycle = () => {
  loading.value = true
  API.createBatchTask({
    type: 'EMPTY_RECYCLE',
    taskInfos: JSON.stringify([]),
    targetFolderId: '',
  })
    .then((res) => {
      console.log('res >>>', res)
      setTimeout(() => {
        getList()
      }, 2000)
    })
    .finally(() => {
      loading.value = false
    })
}
</script>
<style lang="less" scoped></style>
