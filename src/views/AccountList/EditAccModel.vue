<template>
  <a-modal :maskClosable="false" :open="model" class="ant-modal-dray" @cancel="handleCancel" width="500px">
    <template #title>
      <div ref="modalTitleRef" class="modal-title" style="width: 100%; cursor: move">编辑云盘账号</div>
    </template>
    <template #modalRender="{ originVNode }">
      <div ref="modalRef" :style="transformStyle">
        <component :is="originVNode" />
      </div>
    </template>
    <a-form ref="formRef" :model="formState">
      <a-form-item
        label="账号"
        name="account"
        :rules="{
          required: true,
          message: '请输入云盘账号',
          trigger: 'change',
        }">
        <a-input
          v-model:value="formState.account"
          placeholder="请输入云盘账号"
          disabled
          style="width: 150px; margin-right: 8px" />
      </a-form-item>
      <a-form-item
        label="密码"
        name="password"
        :rules="{
          required: true,
          message: '请输入云盘密码',
          trigger: 'change',
        }">
        <a-input
          v-model:value="formState.password"
          placeholder="请输入云盘密码"
          style="width: 150px; margin-right: 8px"
          type="password" />
      </a-form-item>
      <a-form-item
        label="cookies"
        name="cookies"
        :rules="{
          required: false,
          message: '请输入云盘cookies',
          trigger: 'change',
        }">
        <a-input v-model:value="formState.cookies" placeholder="cookies选填" style="width: 350px; margin-right: 8px" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" :loading="loading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>
<script setup>
  import { onMounted, reactive, ref } from 'vue'
  import API from '@/api/cloud.js'
  import { message } from 'ant-design-vue'
  import { useModalDrag } from '@/hooks/index.js'
  const modalTitleRef = ref(null)
  const modalRef = ref(null)
  const transformStyle = useModalDrag(modalRef, modalTitleRef)
  const model = defineModel()
  const $emit = defineEmits(['update'])
  const props = defineProps({
    account: {
      type: String,
      default: '',
    },
  })
  const loading = ref(false)
  const formRef = ref()
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: {
      span: 13,
    },
  }
  onMounted(() => {})
  let formState = reactive({
    account: props.account,
    password: '',
    cookies: '',
  })

  const handleOk = () => {
    loading.value = true
    formRef.value
      .validate()
      .then(async () => {
        API.BatchUpdate({ list: [formState] })
          .then((res) => {
            message.success('保存成功')
            model.value = false
            $emit('update', { account: props.account, cookies: formState.cookies })
            formState = { account: '', password: '', cookies: '' }
          })
          .finally(() => {
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
</style>
