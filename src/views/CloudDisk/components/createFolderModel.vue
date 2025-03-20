<template>
    <a-modal v-model:open="model" title="新建文件夹">
        <div>
            <a-form :model="formState" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" autocomplete="off" @finish="handleOk" @finishFailed="onFinishFailed">
                <a-form-item label="文件名" name="folderName">
                    <a-input v-model:value="formState.folderName" />
                </a-form-item>
            </a-form>
        </div>
        <template #footer>
            <a-button key="back" @click="handleCancel">取消</a-button>
            <a-button key="submit" type="primary" :loading="loading" @click="handleOk">确认</a-button>
        </template>
    </a-modal>
</template>
<script setup>
import { ref, watch, reactive } from 'vue'
import { Form, message } from 'ant-design-vue'
import { useClipboard } from '@vueuse/core'
import API from '@/api/cloud.js'

const useForm = Form.useForm
const loading = ref(false)
const model = defineModel()
const emit = defineEmits(['update:update'])
const props = defineProps({
    parentFolderId: {
        type: [String, Number],
        default: '',

    },
    folderName: {
        type: String,
        default: '',
    }
})
const formState = reactive({
    folderName: props.folderName,
})

const rulesRef = reactive({
    folderName: [
        {
            required: true,
            message: '请填写',
        },
    ],
})
const { resetFields, validate, validateInfos } = useForm(formState, rulesRef)
const copyText = ref('')
// legacy:true 解决 ip地址 复制失败的问题
const { text, copy, isSupported, copied } = useClipboard({ copyText, legacy: true })

const handleOk = () => {
    loading.value = true
    validate()
        .then(() => {
            console.log(formState)
            console.log(' parentFolderId>>>', props.parentFolderId)
            API.createFolder({ ...formState, parentFolderId: props.parentFolderId })
                .then((res) => {
                    console.log('🚀 ~ API.renameFolder ~ res:', res)
                    // 没有传文件名才复制id
                    !props.folderName && copy(res.id)
                        .then(() => {
                            message.success('复制成功, 文件夹ID: ' + res.id)
                        })
                        .catch((e) => {
                            message.error('复制失败')
                        })
                    // res.id
                    message.success('创建成功')
                    emit('update', res)
                    model.value = false
                })
                .finally(() => {
                    loading.value = false
                })
        })
        .catch((err) => {
            console.log('error', err)
            loading.value = false
        })
}
const handleCancel = () => {
    model.value = false
}

const onFinish = (values) => {
    console.log('Success:', values)
}
const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
}
</script>
