<template>
    <div class="app-container">
        <div class="table-top">
            <div></div>
            <a-space>
                <a-button type="primary" @click="getData">刷新</a-button>
                <a-button :icon="h(PlusOutlined)" type="primary" @click="openAddAcc = true">新增账号</a-button>
            </a-space>
        </div>
        <a-table :columns="columns" :dataSource="dataSource" :loading="tableLoading" :pagination="pagination">
            <template #bodyCell="{ column, record, index, text }">
                <template v-if="column.dataIndex === 'account'">
                    {{ text }}
                    <a-tag v-if="text == cuurrentAcc" color="green">当前</a-tag>
                </template>
                <template v-if="column.dataIndex === 'serial'">
                    {{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
                </template>
                <template v-if="column.dataIndex === 'login'">
                    <a-tag v-if="record.cookies" color="green">已登录</a-tag>
                    <a-tag v-else color="red">未登录</a-tag>
                </template>

                <template v-if="column.dataIndex === 'update_time'">
                    {{ dayjs(text).fromNow() }}
                </template>
                <template v-if="column.dataIndex === 'operate'">
                    <a-space>
                        <a-button @click="onSelect(record)">切换</a-button>
                        <a-button @click="onLogin(record.account)">登陆</a-button>
                        <a-button @click="handleEdit(record)">编辑</a-button>
                        <a-button @click="handleDel(record.account)">删除</a-button>
                    </a-space>
                </template>
            </template>
        </a-table>
        <AddAccModel v-if="openAddAcc" v-model="openAddAcc" @update="getData" />
        <EditAccModel v-if="openEditAcc" v-model="openEditAcc" :account="editAccount" @update="getData" />
    </div>
</template>
<script setup>
import API from '@/api/cloud.js'
import { createVNode, h, nextTick, onMounted, ref } from 'vue'
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'
import AddAccModel from './AddAccModel.vue'
import EditAccModel from './EditAccModel.vue'
import dayjs from '@/hooks/useDayjs.js'
import { message, Modal } from 'ant-design-vue'
import router from '@/router'
import { useCloudDiskStore } from '@/stores/CloudDisk'
const openAddAcc = ref(false)
const openEditAcc = ref(false)
const editAccount = ref('')
const CloudDiskStore = useCloudDiskStore()
// 当前选中的云盘账号
const cuurrentAcc = ref(window.localStorage.getItem('account'))
const handleEdit = (record) => {
    // console.log('record>>', record)
    editAccount.value = record.account

    openEditAcc.value = true
}

const tableLoading = ref(false)

const handleDel = (account) => {
    Modal.confirm({
        title: `删除确认`,
        icon: createVNode(ExclamationCircleOutlined),
        content: createVNode('div', { style: 'color:red;' }, `是否要删除账号： ${account} ？`),
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
            return API.BatchDelete({ list: [account] })
                .then((res) => {
                    message.success('删除成功')
                    if (cuurrentAcc.value == account) {
                        cuurrentAcc.value = ''
                        window.localStorage.setItem('account', '')
                        window.sessionStorage.setItem('cloud', '')
                    }
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
        title: '账号',
        dataIndex: 'account',
    },
    {
        title: '是否登录',
        dataIndex: 'login',
    },
    {
        title: '更新时间',
        dataIndex: 'update_time',
    },
    {
        title: '操作',
        dataIndex: 'operate',
    },
])
const pagination = ref({
    current: 1,
    pageSize: 1000,
    total: 0,
    showTotal: (total) => `共计 ${total} 条`,
})

const getData = () => {
    tableLoading.value = true
    API.getAccountList()
        .then((res) => {
            // console.log('res >>>>>:', res);
            if (res.length == 1 && !res[0].cookies) {
                onLogin(res[0].account)
            }
            dataSource.value = res
            pagination.value.total = res.length
        })
        .finally(() => {
            tableLoading.value = false
        })
}
const setAccount = (res) => {
    window.sessionStorage.setItem('cloud', res.cookies || '')
    window.localStorage.setItem('account', res.account)
    cuurrentAcc.value = res.account
    CloudDiskStore.setCloudDiskUserInfo({ account: res.account })
}
const onLogin = (account) => {
    tableLoading.value = true
    API.cloudLogin({ account }).then((res) => {
        setAccount(res)
        message.success('登陆成功')
        nextTick(() => {
            getData()
        })
    }).finally(() => {
        tableLoading.value = false
    })
}

const onSelect = (res) => {
    // console.log("🚀 ~ onSelect ~ res:", res)
    if (!res.cookies) {
        onLogin(res.account)
    } else {
        setAccount(res)
    }

}


onMounted(() => {
    getData()
})
// 导出所有数据
const exportToExcel = () => {
    API.getAllTasksAPI().then((res) => {
        console.log('导出所有数据>>', res)
        excel.exportToExcel(res, '任务列表.xlsx')
    })
}
const importExcelData = (data) => {
    console.log('导入的数据', data)
    let arr = []
    data.forEach((item) => {
        arr.push(API.creatTaskAPI(item))
    })
    Promise.all(arr).finally(() => {
        message.success('导入成功')
        getData()
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