<template>
  <a-modal v-model:open="model" title="重命名" @ok="handleOk">
    <div style="height: 60px;padding-top:20px ">
      <a-form
          :model="formState"
          name="basic"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 16 }"
          autocomplete="off"
          @finish="handleOk"
          @finishFailed="onFinishFailed">
        <a-form-item label="文件名" name="destFolderName">
          <a-input v-model:value="formState.destFolderName"/>
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
  import API from '@/api/index.js'

  const useForm = Form.useForm
  const loading = ref(false)
  const model = defineModel()
  const emit = defineEmits(['update:update'])
  const props = defineProps({
    record: {
      type: Object,
      default: () => {
        return {
          //   folderId: '',
          //   destFolderName: '',
        }
      },
    },
  })
  const formState = reactive({
    folderId: '',
    destFolderName: '',
  })
  watch(
      () => props.record,
      (val) => {
        console.log('🚀 ~ record:', val)
        formState.folderId = String(val.id)
        formState.destFolderName = val.name
      },
      { deep: true },
  )
  const rulesRef = reactive({
    destFolderName: [
      {
        required: true,
        message: '请填写',
      },
    ],
  })
  const { resetFields, validate, validateInfos } = useForm(formState, rulesRef)
  const handleOk = () => {
    loading.value = true
    validate()
        .then(() => {
          console.log(formState)
          API.renameFolder({ ...formState, Cookie: document.cookie, noCache: Math.random() })
              .then((res) => {
                console.log('🚀 ~ API.renameFolder ~ res:', res)
                message.success('重命名成功')
                emit('update')
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
