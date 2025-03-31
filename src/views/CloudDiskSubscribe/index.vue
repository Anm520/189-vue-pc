<template>
  <div class="app-container">
    <div class="table-top">
      <div style="display: flex">
        <div style="display: flex; margin-right: 10px; align-items: center">
          <span> 任务名称：</span>
          <a-input v-model:value="task_name" allow-clear style="width: 180px" @keyup.enter="handleSeach" />
        </div>
        <a-button type="primary" @click="handleSeach">搜索</a-button>
      </div>
      <a-space>
        <a-button type="primary" @click="getData">刷新</a-button>
        <a-button type="primary" @click="handleRunAll('')" :loading="runAllLoading">全部执行</a-button>
        <a-button type="primary" @click="handleRunAll('account')" :loading="runAllLoading">执行当前账号</a-button>
        <a-button type="primary" @click="exportToExcel">导出任务</a-button>
        <FileUpload @ok="importExcelData"></FileUpload>
        <!--        <a-button type="primary" @click="getLoginName">登录</a-button>-->
        <a-button :icon="h(PlusOutlined)" type="primary" @click="; (open = true), (isAdd = true)">新建任务</a-button>
      </a-space>
    </div>
    <a-table :columns="columns" :dataSource="dataSource" :loading="tableLoading" :pagination="pagination"
      @change="handleTableChange">
      <template #bodyCell="{ column, record, index, text }">
        <template v-if="column.dataIndex === 'task_name'">
          <a :href="record.share_url" target="_blank" v-if="record.share_url">{{ text }}</a>
          <span v-else>{{ text }}</span>
        </template>
        <template v-if="column.dataIndex === 'save_path_id'">
          <a @click="onSavePath(text)">{{ text }}</a>
        </template>
        <template v-if="column.dataIndex === 'serial'">
          {{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
        </template>
        <template v-if="column.dataIndex === 'create_time'">
          {{ text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '' }}
        </template>
        <template v-if="column.dataIndex === 'update_time'">
          {{ dayjs(text).fromNow() }}
        </template>
        <template v-if="column.dataIndex === 'account'"> {{ hidePhone(text) }} </template>
        <template v-if="column.dataIndex === 'status'">
          <span v-if="text === STATUS_RUN">执行</span>
          <span v-if="text === STATUS_PAUSE">暂停</span>
          <span v-if="text === STATUS_DONE">完结</span>
        </template>
        <template v-if="column.dataIndex === 'operate'">
          <a-space>
            <a-button @click="handleExecute(record)">执行</a-button>
            <a-button @click="handleEdit(record)">编辑</a-button>
            <a-button @click="handleDel(record)">删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
    <NewTaskModel v-if="open" v-model="open" :isAdd="isAdd" :record="editRecord" @update="getData" />
  </div>
</template>
<script setup>
import API from '@/api/cloud.js'
import OtherAPI from '@/api/index.js'
import { createVNode, h, onMounted, ref } from 'vue'
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'
import NewTaskModel from './NewTaskModel.vue'
import dayjs from '@/hooks/useDayjs.js'
import { STATUS_DONE, STATUS_PAUSE, STATUS_RUN } from '@/utils/constant.js'
import { useCloudDiskStore } from '@/stores/CloudDisk.js'
import { message, Modal } from 'ant-design-vue'
import excel from '@/utils/excel.js'
import FileUpload from '@/components/FileUpload.vue'
import router from '@/router'
import { hidePhone } from '@/utils/index.js'

const open = ref(false)
const isAdd = ref(true)
const editRecord = ref()
const handleEdit = (record) => {
  // console.log('record>>', record)
  editRecord.value = record
  console.log('editRecord>>>>', editRecord.value)
  isAdd.value = false
  open.value = true
}

const tableLoading = ref(false)
const task_name = ref('')
const handleDel = (record) => {
  Modal.confirm({
    title: `删除确认`,
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode('div', { style: 'color:red;' }, `是否要删除任务： 《${record.task_name}》 ？`),
    okText: '删除',
    // okType: 'danger',
    okButtonProps: {
      size: 'small',
    },
    cancelButtonProps: {
      size: 'small',
    },
    onOk() {
      tableLoading.value = true
      return API.deleteTask({ list: [record.id] })
        .then((res) => {
          message.success('删除成功')
          getData()
        })
        .catch((error) => {
          tableLoading.value = false
        })
    },
    onCancel() { },
  })
}
const dataSource = ref([])
const columns = ref([
  {
    title: '序号',
    dataIndex: 'serial',
  },
  {
    title: '任务名称',
    dataIndex: 'task_name',
  },
  {
    title: '任务状态',
    dataIndex: 'status',
  },
  {
    title: '当前集数',
    dataIndex: 'episode',
  },
  {
    title: '总集数',
    dataIndex: 'episode_total',
  },
  {
    title: '保存目录ID',
    dataIndex: 'save_path_id',
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
  },
  {
    title: '创建帐号',
    dataIndex: 'account',
  },
  {
    title: '操作',
    dataIndex: 'operate',
  },
])
const pagination = ref({
  current: 1,
  pageSize: 15,
  total: 0,
  showTotal: (total) => `共计 ${total} 条`,
})

const getData = () => {
  tableLoading.value = true
  const params = {
    current: pagination.value.current,
    pageSize: pagination.value.pageSize,
    task_name: task_name.value,
  }

  API.getTaskList(params)
    .then((res) => {
      console.log('🚀 ~ .then ~ res:', res)
      dataSource.value = res.data
      pagination.value.total = res.total
    })
    .finally(() => {
      tableLoading.value = false
    })
}
const handleSeach = () => {
  pagination.value.current = 1
  getData()
}
const handleTableChange = ({ current }) => {
  console.log('pagination>>>>', current)
  pagination.value.current = current
  getData()
}

const CloudDiskStore = useCloudDiskStore()

const getLoginName = () => {
  OtherAPI.getLoginName().then((res) => {
    // console.log('用户信息》〉》', res)
    CloudDiskStore.setCloudDiskUserInfo({ loginName: res.loginName })
  })
  OtherAPI.getUserBriefInfo().then((res) => {
    // console.log('getUserBriefInfo>>>>', res)
    CloudDiskStore.setCloudDiskUserInfo({ nickname: res.nickname, sessionKey: res.sessionKey })
  })
}
const createTaskUser = () => {
  API.createTaskUserAPI({ login_name: CloudDiskStore.CloudDiskUserInfo.loginName }).then((res) => {
    // console.log('createTaskUser>>>', res)
  })
}
const handleExecute = (record) => {
  tableLoading.value = true
  API.runTask({ id: record.id })
    .then((res) => {
      console.log('🚀 ~ .handleExecute ~ res:', res)
      // console.log('res>>', res)
      let str = res.successedCount ? `成功更新${res.successedCount}个文件` : res.res_message
      message.success(str)
      setTimeout(() => {
        getData()
      }, 10)
    })
    .finally(() => {
      tableLoading.value = false
    })
}
const executeTaskAll = () => {
  API.executeTaskAll().then((res) => {
    message.success(res.res_message)
    getData()
  })
}
const runAllLoading = ref(false)
const handleRunAll = (type) => {
  let account = ''
  if (type == 'account') {
    account = window.localStorage.getItem('account')
  }
  runAllLoading.value = true
  API.runAllTask({ account })
    .then((res) => {
      getData()
      message.success(res.res_message)
    })
    .finally(() => {
      runAllLoading.value = false
    })
}
onMounted(() => {
  getData()
})
// 导出所有数据
const exportToExcel = () => {
  API.getAllTaskList().then((res) => {
    console.log('导出所有数据>>', res)
    excel.exportToExcel(res, '任务列表.xlsx')
  })
}
const importExcelData = (data) => {
  console.log('导入的数据', data)
  let arr = []
  data.forEach((item) => {
    item.task_week = item.task_week || '[8]'
    arr.push(API.createTask(item))
  })
  Promise.all(arr).finally(() => {
    message.success('导入成功')
    getData()
  })
}
const onSavePath = (path) => {
  router.push({
    path: '/cloud/index',
    query: {
      path: path,
    },
  })
}
</script>
<style lang="less" scoped>
.table-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
</style>
