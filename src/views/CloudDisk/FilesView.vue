<template>
  <div class="cloud-disk">
    <!--    <FolderTree v-model="Folder"/>-->
    <div class="files-view">
      <div class="table-top">
        <a-breadcrumb>
          <a-breadcrumb-item v-for="item in breadcrumb" @click="handleBreadcrumb(item)" :key="item.id">
            <a :class="[Folder === item.id ? 'active' : '']">
              {{ item.name }}
            </a>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      <div class="table-top">
        <a-space>
          <div class="center">
            集数：
            <a-input-number v-model:value="eNum" />
          </div>
          <div>文件数:{{ count }}</div>
          <div @click="handleCopyId">
            目录ID：<a>{{ Folder }}</a>
          </div>
        </a-space>
        <a-space>
          <a-button type="primary" @click="getlistFiles" :icon="h(SyncOutlined)">刷新</a-button>
          <a-button type="primary" @click="showCreateFolderModel = true" :icon="h(PlusOutlined)">新建文件夹</a-button>
          <a-button type="primary" @click="showBatchRenameFolderModel = true" :icon="h(FormOutlined)">
            批量重命名
          </a-button>
          <a-button type="primary" @click="showFolderTreeModel = true" :icon="h(FormOutlined)"> 批量移动 </a-button>
          <a-button type="primary" @click="handleDelFolder(state.selectedRows)" :icon="h(DeleteOutlined)">
            批量删除
          </a-button>
          <a-button type="primary" @click="handleFullPath" :icon="h(FormOutlined)"> 获取路径</a-button>
        </a-space>
      </div>

      <a-table :columns="columns" :dataSource="dataSource" :loading="state.loading" :pagination="false"
        :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
        :scroll="{ y: 'clac(100% - 100px)' }" rowKey="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            <span class="file-name" @click="handleClickFolder(record)">
              <a-dropdown :trigger="['contextmenu']">
                <span>
                  <img v-if="record.isFolder" alt="" src="@/assets/img/folder.png"
                    style="width: 28px; height: 28px; margin-right: 10px" />
                  {{ record.name }}
                </span>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="1" @click="handleRenameFile(record)">
                      <FormOutlined />重命名
                    </a-menu-item>
                    <a-menu-item key="2" @click="handleDelFolder([record])">
                      <DeleteOutlined />删除
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </span>
          </template>
          <template v-if="column.dataIndex === 'size'">
            <span v-if="!record.size">文件夹</span>
            <span v-else>{{ getFileSize(record.size) }}</span>
          </template>
          <template v-if="column.dataIndex === 'lastOpTime'">
            <span>{{ dayjs(record.lastOpTime).fromNow() }}</span>
          </template>
          <template v-if="column.key === 'action'">
            <span>
              <a @click="handleRenameFile(record)">重命名</a>
              <a-divider type="vertical" />
              <a @click="handleDelFolder([record])">删除</a>
            </span>
          </template>
        </template>
      </a-table>
      <RenameFolderModel v-model="showRenameFolderModel" :record="selectRecord" @update="getlistFiles" />
      <BatchRenameFolderModel v-model="showBatchRenameFolderModel" :selectedRows="state.selectedRows"
        @update="getlistFiles" />
      <createFolderModel v-model="showCreateFolderModel" :parentFolderId="Folder" @update="getlistFiles" />
      <FolderTreeModel v-model="showFolderTreeModel" @ok="handleBatchMoveFolder" :breadcrumb="breadcrumb" />
    </div>
  </div>
</template>

<script setup>
import { FolderFilled, SyncOutlined, PlusOutlined, DeleteOutlined, FormOutlined } from '@ant-design/icons-vue'
import API from '@/api/cloud.js'
import { ref, watch, computed, onMounted, reactive, h } from 'vue'
import { getFileSize } from '@/utils/index.js'
import dayjs from '@/hooks/useDayjs.js'
import RenameFolderModel from './components/RenameFolderModel.vue'
import createFolderModel from './components/createFolderModel.vue'
import BatchRenameFolderModel from './components/BatchRenameFolderModel.vue'
import FolderTree from './FolderTree.vue'
import { message } from 'ant-design-vue'
import { ROOT_ID } from '@/utils/constant.js'
import { useClipboard } from '@vueuse/core'
import FolderTreeModel from '@/components/FolderTreeModel.vue'

import { useRoute } from 'vue-router'
const route = useRoute()
const path = route.query.path
const breadcrumb = ref([{ name: '根目录', id: ROOT_ID }])
const Folder = ref(path || ROOT_ID)
onMounted(() => {
  if (path) {
    handleFullPath()
  }
})
// legacy:true 解决 ip地址 复制失败的问题
const { text, copy, isSupported, copied } = useClipboard({ Folder, legacy: true })
const handleCopyId = () => {
  copy(Folder.value)
    .then(() => {
      message.success('复制成功')
    })
    .catch((e) => {
      message.error('复制失败')
    })
}
const showBatchRenameFolderModel = ref(false)
const columns = ref([
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
  {
    title: 'Action',
    key: 'action',
  },
])
const state = reactive({
  selectedRowKeys: [],
  selectedRows: [],
  // Check here to configure the default column
  loading: false,
})
const selectedRows = ref([])
const showFolderTreeModel = ref(false)
const count = ref(0) // 总数
// const folderList = ref([]) // 目录列表
// const fileList = ref([]) // 文件列表
const selectRecord = ref({}) // 选中记录-重命名
const showRenameFolderModel = ref(false)
const showCreateFolderModel = ref(false)
const eNum = ref(undefined)
const dataSource = ref([])

watch(eNum, () => {
  console.log('eNum-watch>>>', eNum.value)
  if (eNum) {
    state.selectedRows = dataSource.value.slice(0, eNum.value)
    state.selectedRowKeys = state.selectedRows.map((item) => item.id)
  } else {
    state.selectedRows = []
    state.selectedRowKeys = []
  }
})

function getlistFiles() {
  state.selectedRows = []
  state.selectedRowKeys = []
  const params = {
    pageSize: 1000,
    pageNum: 1,
    mediaType: '0',
    folderId: String(Folder.value),
    iconOption: '5',
    orderBy: 'filename',
    descending: false,
  }
  state.loading = true
  API.getListFiles(params)
    .then((res) => {
      console.log('🚀 ~ API.getlistFiles ~ res:', res)

      count.value = res.fileListAO.count
      const folderList = res.fileListAO.folderList.map((item) => {
        return { ...item, isFolder: true }
      })
      const fileList = res.fileListAO.fileList.map((item) => {
        return { ...item, isFolder: false }
      })
      dataSource.value = [...folderList, ...fileList]
    })
    .finally(() => {
      state.loading = false
    })
}

watch(
  Folder,
  (val) => {
    getlistFiles(val)
  },
  { immediate: true },
)

function handleResizeColumn(w, col) {
  console.log(' handleResizeColumn>>>', w)
  col.width = w
}

function handleRenameFile(record) {
  console.log('🚀 ~ handleRenameFile ~ record:', record)
  selectRecord.value = record
  showRenameFolderModel.value = true
}

// 删除任务
function handleDelFolder(records) {
  const delRecords = records.map((item) => {
    return {
      fileId: item.id,
      fileName: item.name,
      isFolder: item.fileCata,
    }
  })
  const params = {
    type: 'DELETE',
    taskInfos: JSON.stringify(delRecords),
    targetFolderId: '',
  }
  state.loading = true
  API.createBatchTask(params)
    .then((res) => {
      message.success('删除成功')
      getlistFiles()
    })
    .finally(() => {
      state.loading = false
    })
}

// 批量移动
function handleBatchMoveFolder(targetFolderInfo, records) {
  console.log('targetFolderInfo>>', targetFolderInfo.id)
  if (!records) {
    records = state.selectedRows
  }
  const delRecords = records.map((item) => {
    return {
      fileId: item.id,
      fileName: item.name,
      isFolder: item.fileCata,
    }
  })
  const params = {
    type: 'MOVE',
    taskInfos: JSON.stringify(delRecords),
    targetFolderId: targetFolderInfo.id,
  }
  state.loading = true
  API.createBatchTask(params)
    .then((res) => {
      state.selectedRowKeys = []
      state.selectedRows = []
      message.success('移动成功')
      getlistFiles()
    })
    .finally(() => {
      state.loading = false
    })
}

const onSelectChange = (selectedRowKeys, selectedRows) => {
  console.log('selectedRows changed: ', selectedRows)
  state.selectedRowKeys = selectedRowKeys
  state.selectedRows = selectedRows
}
const handleFullPath = () => {
  const params = { fileId: String(Folder.value) }
  API.getFullPath(params).then((res) => {
    console.log('handleFullPath-res >>>', res)
    let list = res.path.map((item) => {
      return {
        id: item.fileId,
        name: item.fileName,
      }
    })
    breadcrumb.value = list
    //   folderList.value = res.path
  })
}
const handleClickFolder = (record) => {
  if (record.isFolder) {
    Folder.value = record.id
    breadcrumb.value.push(record)
  }
}
const handleBreadcrumb = (record) => {
  Folder.value = record.id
  const index = breadcrumb.value.findIndex((item) => item.id === record.id)
  // 如果找到了符合条件的对象
  if (index !== -1) {
    // 截取数组到找到的对象为止
    breadcrumb.value = breadcrumb.value.slice(0, index + 1)
  }
}
</script>
<style lang="less" scoped>
.cloud-disk {
  width: 100%;
  height: 100%;
  // border: 1px solid red;
  display: flex;
}

.files-view {
  padding: 10px 20px;
  //width: calc(100% - 460px);
  height: 100%;
  overflow: auto;
}

.folder-item {
  margin-bottom: 10px;
}

.files-table {}

/deep/ :where(.css-dev-only-do-not-override-cdozky).ant-table-wrapper .ant-table {
  font-size: 13px;
  color: #878c96 !important;
}

.file-name {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
  cursor: pointer;
  //white-space: nowrap;
  vertical-align: middle;
}

.table-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.active {
  color: #1677ff;
}
</style>
