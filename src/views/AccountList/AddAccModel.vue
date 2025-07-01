<template>
    <a-modal :maskClosable="false" :open="model" class="ant-modal-dray" @cancel="handleCancel" width="650px">
        <template #title>
            <div ref="modalTitleRef" class="modal-title" style="width: 100%; cursor: move">
                添加云盘账号
            </div>
        </template>
        <template #modalRender="{ originVNode }">
            <div ref="modalRef" :style="transformStyle">
                <component :is="originVNode" />
            </div>
        </template>
        <div style="height: 100%;overflow-y: auto;" ref="formBodyRef">

            <a-form ref="formRef" :model="formState">
                <template v-for="(domain, index) in formState.domains" :key="domain.key">
                    <a-row>
                        <a-col :span="11">
                            <a-form-item label="账号" :name="['domains', index, 'account']" :rules="{
                                required: true,
                                message: '请输入云盘账号',
                                trigger: 'change',
                            }">
                                <a-input v-model:value="domain.account" placeholder="请输入云盘账号"
                                    style="width: 150px; margin-right: 8px" />

                            </a-form-item>
                        </a-col>
                        <a-col :span="10">
                            <a-form-item label="密码" :name="['domains', index, 'password']" :rules="{
                                required: true,
                                message: '请输入云盘密码',
                                trigger: 'change',
                            }">
                                <a-input v-model:value="domain.password" placeholder="请输入云盘密码"
                                    style="width: 150px; margin-right: 8px" type="password" />
                                <MinusCircleOutlined v-if="formState.domains.length > 1" class="dynamic-delete-button"
                                    @click="removeDomain(domain)" />
                            </a-form-item>
                        </a-col>
                    </a-row>


                </template>

            </a-form>
        </div>


        <template #footer>
            <a-button type="dashed" @click="addDomain">
                <PlusOutlined />
                添加云盘账号
            </a-button>
            <div> <a-button key="back" @click="handleCancel">取消</a-button>
                <a-button key="submit" :loading="loading" type="primary" @click="handleOk">保存</a-button>
            </div>

        </template>
    </a-modal>

</template>
<script setup>
import { nextTick, onMounted, reactive, ref, toRaw, watch } from 'vue'
import API from '@/api/cloud.js'
import { message } from 'ant-design-vue'
import { useModalDrag } from '@/hooks/index.js'
import dayjs from 'dayjs'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'
const modalTitleRef = ref(null)
const modalRef = ref(null)
const transformStyle = useModalDrag(modalRef, modalTitleRef)
const model = defineModel()
const $emit = defineEmits(['update'])

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
    domains: [
        {
            account: '',
            password: '',
        }
    ]
})
const formBodyRef = ref(null)
const addDomain = () => {
    formState.domains.push({
        account: '',
        password: '',
    });
// 使用 nextTick 确保 DOM 更新后再滚动
    nextTick(() => {
        formBodyRef.value.scrollTo({
        top: formBodyRef.value.scrollHeight,
        behavior: 'smooth',
    });
    })
    
};
const removeDomain = item => {
    const index = formState.domains.indexOf(item);
    if (index !== -1) {
        formState.domains.splice(index, 1);
    }
};
const handleOk = () => {
    loading.value = true
    formRef.value
        .validate()
        .then(async () => {
            API.BatchUpdate({ list: formState.domains }).then(res => {
                message.success('保存成功')
                formState.domains = [
                    { account: '', password: '' },
                ]
                model.value = false
                $emit('update')
            }).finally(() => {
                loading.value = false
            })

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

</script>
<style lang="less" scoped>
:deep(.ant-modal-body) {
    height: 200px;
    overflow: auto;
}

:deep(.ant-modal-footer) {
    display: flex;
    justify-content: space-between !important;
    align-items: center;
}
</style>