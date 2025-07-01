<template>
    <a-modal :maskClosable="false" :open="model" class="ant-modal-dray" @cancel="handleCancel" width="900px">
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
        <a-form ref="formRef" :model="formState" :rules="rules">
            <a-row>
                <a-col :span="10">
                    <a-form-item label="分享链接" name="share_url">
                        <a-input-search v-model:value="formState.share_url" @search="(val) => onSearch(val, true)"
                            style="width: 100%;" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="shareCode" name="share_code">
                        <a-input-search v-model:value="formState.share_code" @search="(val) => onSearch(val, false)" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="访问码" name="access_code">
                        <a-input v-model:value="formState.access_code" />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row>
                <a-col :span="10">
                    <a-form-item label="分享目录ID" name="share_file_id">
                        <a-input-search v-model:value="formState.share_file_id" @search="ShareFileOpen = true" />
                    </a-form-item>
                </a-col>
                <a-col :span="8"><a-form-item label="分享ID" name="share_id">
                        <a-input v-model:value="formState.share_id" />
                    </a-form-item></a-col>
                <a-col :span="6"> <a-form-item label="分享模式" name="share_mode">
                        <!--3 5-->
                        <a-select v-model:value="formState.share_mode" placeholder="请选择">
                            <a-select-option :value="3">3-普通pc链接</a-select-option>
                            <a-select-option :value="5">5-移动端订阅中心链接</a-select-option>
                        </a-select>
                    </a-form-item></a-col>
            </a-row>





            <a-row>
                <a-col :span="12"><a-form-item label="保存目录ID" name="save_path_id">
                        <a-input-search v-model:value="formState.save_path_id" @search="open = true" />
                    </a-form-item></a-col>
                <a-col :span="12"><a-form-item label="任务名称" name="task_name">
                        <a-input v-model:value="formState.task_name" />
                    </a-form-item></a-col>
            </a-row>



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
            <a-form-item label="执行时间" name="task_week">
                <a-select v-model:value="formState.task_week" placeholder="请选择" mode="multiple">
                    <a-select-option :value="item.value" v-for="item in weeks">{{ item.label }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-row>
                <a-col :span="10"> <a-form-item label="筛选文本" name="filter_text">
                        <a-input v-model:value="formState.filter_text" placeholder="筛选文本" style="width: 90%;" />
                    </a-form-item></a-col>
                <a-col :span="8"> <a-form-item label="筛选文本模式" name="filter_text_type">
                        <a-select v-model:value="formState.filter_text_type" placeholder="请选择">
                            <a-select-option :value="1">包含</a-select-option>
                            <a-select-option :value="2">不包含</a-select-option>
                        </a-select>
                    </a-form-item> </a-col>
            </a-row>
            <a-row>
                <a-col :span="10"> <a-form-item label="筛选集数" name="episode_filter_num">
                        <a-input-number v-model:value="formState.episode_filter_num" placeholder="筛选集数"
                            style="width: 90%;" />
                    </a-form-item> </a-col>
                <a-col :span="8"> <a-form-item label="筛选集数模式" name="episode_filter_type">
                        <a-select v-model:value="formState.episode_filter_type" placeholder="请选择">
                            <a-select-option :value="1">大于</a-select-option>
                            <a-select-option :value="2">小于</a-select-option>
                        </a-select>
                    </a-form-item></a-col>
            </a-row>

            <a-row>
                <a-col :span="10"><a-form-item label="总集数" name="episode_total">
                        <a-input-number v-model:value="formState.episode_total" style="width: 90%;" />
                    </a-form-item></a-col>
                <a-col :span="8"> <a-form-item label="更新集数" name="episode"> <a-input-number
                            v-model:value="formState.episode" style="width: 90%;" />
                    </a-form-item></a-col>
            </a-row>




        </a-form>
        <template #footer>

            <div class="footer-btn">
                <div>
                    <a-button type="primary" @click='onSaveOneClick' :loading="OneClickLoading">一键转存</a-button>
                    <a-button type="primary" @click='onJumpLink'>查看链接</a-button>
                </div>

                <div>
                    <a-button key="back" @click="handleCancel">取消</a-button>
                    <a-button key="submit" :loading="loading" type="primary" @click="handleOk">保存</a-button>
                </div>

            </div>
        </template>
    </a-modal>
    <FolderTreeModel v-if="open" v-model="open" @ok="handleFolderTree" :taskName="formState.task_name" />
    <ShareFileIdSelectModal v-if="ShareFileOpen" v-model="ShareFileOpen" :options="shareCodeInfo"
        @ok="handleShareFile" />
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
const weeks = reactive([
    { label: '每日', value: 8 },
    { label: '周一', value: 1 },
    { label: '周二', value: 2 },
    { label: '周三', value: 3 },
    { label: '周四', value: 4 },
    { label: '周五', value: 5 },
    { label: '周六', value: 6 },
    { label: '周日', value: 7 }
])
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

let formState = reactive({
    episode_filter_num: 0,
    episode_filter_type: 1,
    filter_text: '',
    filter_text_type: 1,
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
    task_week: [8]
})
watch(
    () => record,
    (newVal) => {
        // console.log('newVal>>>>', newVal)
        if (!isAdd) {
            let week = []
            try {
                week = JSON.parse(newVal.task_week)
            } catch (error) {
                console.log('error >>>>>:', error);
            }
            formState = reactive({
                ...toRaw(newVal),
                create_time: dayjs(newVal.create_time).format('YYYY-MM-DD HH:mm:ss'),
                update_time: '',
                task_week: week
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
const OneClickLoading = ref(false)
const handleOk = () => {
    loading.value = true
    formRef.value
        .validate()
        .then(async () => {
            if (isAdd) {
                API.createTask({ ...formState, account: cloudDiskStore.CloudDiskUserInfo.account, task_week: JSON.stringify(formState.task_week) })
                    .then((res) => {
                        message.success('保存成功')
                        model.value = false
                        $emit('update')
                    })
                    .finally(() => {
                        loading.value = false
                    })
            } else {
                API.updateTask({ ...formState, task_week: JSON.stringify(formState.task_week) })
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
const onSaveOneClick = () => {
    OneClickLoading.value = true
    formRef.value
        .validate().then(() => {
            const params = {
                type: 'SHARE_SAVE',
                taskInfos: JSON.stringify([{ fileId: formState.share_file_id, fileName: formState.task_name, isFolder: 1 }]),
                targetFolderId: formState.save_path_id,
                shareId: formState.share_id,
            }

            API.createBatchTask(params)
                .then((res) => {

                    message.success('一键转存成功')
                    model.value = false
                    $emit('update')
                })
                .finally(() => {
                    OneClickLoading.value = false
                })
        }).catch((error) => {

            message.error('一键转存失败')
            OneClickLoading.value = false
        })
}
const onJumpLink = () => {
    window.open(formState.share_url, 'cloud')
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
<style lang="less" scoped>
.footer-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
