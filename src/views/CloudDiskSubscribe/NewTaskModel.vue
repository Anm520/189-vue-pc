<template>
    <a-modal :maskClosable="false" :open="model" class="ant-modal-dray" @cancel="handleCancel" width="600px">
        <template #title>
            <div ref="modalTitleRef" class="modal-title" style="width: 100%; cursor: move">
                {{ isAdd ? '新建任务' : '编辑' }}
            </div>
        </template>
        <template #modalRender="{ originVNode }">
            <div ref="modalRef" :style="transformStyle">
                <component :is="originVNode" />
            </div>
        </template>
        <a-form ref="formRef" :label-col="layout.labelCol" :model="formState" :rules="rules" :wrapper-col="layout.wrapperCol">
            <a-form-item label="分享链接" name="share_url">
                <a-input-search v-model:value="formState.share_url" @search="(val) => onSearch(val, true)" />
            </a-form-item>
            <a-form-item label="shareCode" name="share_code">
                <a-input-search v-model:value="formState.share_code" @search="(val) => onSearch(val, false)" />
            </a-form-item>
            <a-form-item label="访问码" name="access_code">
                <a-input v-model:value="formState.access_code" />
            </a-form-item>


            <a-form-item label="任务名称" name="task_name">
                <a-input v-model:value="formState.task_name" />
            </a-form-item>
            <a-form-item label="分享ID" name="share_id">
                <a-input v-model:value="formState.share_id" />
            </a-form-item>

            <a-form-item label="分享目录ID" name="share_file_id">
                <a-input-search v-model:value="formState.share_file_id" @search="ShareFileOpen = true" />
            </a-form-item>
            <a-form-item label="分享模式" name="share_mode">
                <!--3 5-->
                <a-select v-model:value="formState.share_mode" placeholder="请选择">
                    <a-select-option :value="3">3-普通pc链接</a-select-option>
                    <a-select-option :value="5">5-移动端订阅中心链接</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="保存目录ID" name="save_path_id">
                <a-input-search v-model:value="formState.save_path_id" @search="open = true" />
            </a-form-item>
            <a-form-item label="任务状态" name="status">
                <a-select v-model:value="formState.status" placeholder="请选择">
                    <a-select-option :value="1">执行</a-select-option>
                    <a-select-option :value="2">暂停</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="保存模式" name="save_type">
                <a-select v-model:value="formState.save_type" placeholder="请选择">
                    <a-select-option :value="1">文件和文件夹（保存一次，文件内有更新无法同步）</a-select-option>
                    <a-select-option :value="0">仅文件</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="总集数" name="episode_total">
                <a-input-number v-model:value="formState.episode_total" />
            </a-form-item>
            <a-form-item label="更新集数" name="episode"> <a-input-number v-model:value="formState.episode" /> </a-form-item>

        </a-form>
        <template #footer>
            <a-button key="back" @click="handleCancel">取消</a-button>
            <a-button key="submit" :loading="loading" type="primary" @click="handleOk">保存</a-button>
        </template>
    </a-modal>
    <FolderTreeModel v-model="open" @ok="handleFolderTree" :taskName="formState.task_name" />
    <ShareFileIdSelectModal v-if="ShareFileOpen" v-model="ShareFileOpen" :options="shareCodeInfo" @ok="handleShareFile" />
</template>
<script setup>
import { nextTick, onMounted, reactive, ref, toRaw, watch } from 'vue'
import API from '@/api/cloud.js'
import { message } from 'ant-design-vue'
import { useModalDrag } from '@/hooks/index.js'
import FolderTreeModel from '@/components/FolderTreeModel.vue'
import ShareFileIdSelectModal from './ShareFileIdSelectModal.vue'
import dayjs from 'dayjs'
import { useCloudDiskStore } from '@/stores/CloudDisk.js'

const cloudDiskStore = useCloudDiskStore()
const open = ref(false)
const handleFolderTree = (row) => {
    formState.save_path_id = row.id
}
const modalTitleRef = ref(null)
const modalRef = ref(null)
const transformStyle = useModalDrag(modalRef, modalTitleRef)
const model = defineModel()
const $emit = defineEmits(['update'])
const { isAdd, record, url } = defineProps({
    isAdd: Boolean,
    record: Object,
    url: String
})
const loading = ref(false)
const formRef = ref()
const layout = {
    labelCol: { span: 5 },
    wrapperCol: {
        span: 13,
    },
}
onMounted(() => {

})
let formState = reactive({
    task_name: '',
    status: 1,
    share_id: '',
    share_file_id: '',
    access_code: '',
    description: '',
    save_path_id: '',
    share_mode: 3,
    share_code: '',
    share_url: '',
    save_type: 0,
    episode_total: 0,
    episode: 0,
})
watch(
    () => record,
    (newVal) => {
        // console.log('newVal>>>>', newVal)
        if (!isAdd) {
            formState = reactive({
                ...toRaw(newVal),
                create_time: dayjs(newVal.create_time).format('YYYY-MM-DD HH:mm:ss'),
                update_time: '',
            })

            nextTick(() => {
                shareCodeInfo.value = {
                    shareMode: newVal.share_mode,
                    shareId: newVal.share_id,
                    fileId: newVal.share_file_id,
                    accessCode: newVal.access_code,
                }
            })
        }
    },
    { deep: true, immediate: true },
)

const rules = {
    share_id: [
        {
            required: true,
            message: '请输入分享ID',
            trigger: 'blur',
        },
    ],
    share_file_id: [
        {
            required: true,
            message: '请输入分享目录ID',
            trigger: 'blur',
        },
    ],
    status: [
        {
            required: true,
            message: 'Please select activity resource',
            trigger: 'change',
        },
    ],
    save_type: [
        {
            required: true,
            message: '请选择',
            trigger: 'change',
        },
    ],
}
const handleOk = () => {
    loading.value = true
    formRef.value
        .validate()
        .then(async () => {
            if (isAdd) {
                API.createTask({ ...formState, account: cloudDiskStore.CloudDiskUserInfo.account })
                    .then((res) => {
                        message.success('保存成功')
                        model.value = false
                        $emit('update')
                    })
                    .finally(() => {
                        loading.value = false
                    })
            } else {
                API.updateTask({ ...formState, account: cloudDiskStore.CloudDiskUserInfo.account })
                    .then((res) => {
                        message.success('保存成功')
                        model.value = false
                        $emit('update')
                    })
                    .finally(() => {
                        loading.value = false
                    })
            }
        })
        .catch((error) => {
            console.log('error', error)
            loading.value = false
        })
}
const resetForm = () => {
    formRef.value.resetFields()
}

const handleCancel = () => {
    model.value = false
}
const shareCodeInfo = ref({})
const ShareFileOpen = ref(false)
const onSearch = (shareCode, isUrl) => {
    let code = ''
    console.log('isUrl >>>', isUrl)
    if (isUrl) {
        code = shareCode.match(/\/t\/([^\/]+)/)[1] || ''
        console.log('code >>>', code)
        formState.share_code = code
    } else {
        code = shareCode
    }
    console.log('shareCode', shareCode)
    API.getShareInfoByCode({ shareCode: code }).then((res) => {
        const { shareMode, shareId, fileId, fileName, accessCode } = res
        shareCodeInfo.value = { shareMode, shareId: String(shareId), fileId, accessCode }
        formState.share_id = String(shareId)
        formState.share_mode = shareMode
        formState.share_file_id = fileId
        formState.task_name = fileName
        formState.access_code = accessCode
    })
}
const handleShareFile = (id) => {
    // console.log('id>>', id)
    formState.share_file_id = id
    shareCodeInfo.value.fileId = id
}
onMounted(() => {
    if (url) {
        formState.share_url = url
        onSearch(url, true)
    }
})
</script>
<style lang="less"></style>
