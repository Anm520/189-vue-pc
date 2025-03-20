<template>
  <div class="app-container">
    <a-form :label-col="{ span: 8 }" :model="formData" :wrapper-col="{ span: 16 }" autocomplete="off" name="basic"
      @finish="onFinish">

      <a-form-item :rules="[{ required: true, message: '请选择!' }]" label="执行状态">
        <a-radio-group v-model:value="formData.is_execute">
          <a-radio :value="0">暂停</a-radio>
          <a-radio :value="1">执行</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item :rules="[{ required: true, message: '请输入!' }]" label="执行间隔时间">
        <a-input-number v-model:value="formData.time_interval" addon-after="分钟" />
      </a-form-item>
      <a-form-item label="钉钉机器人token" name="ding_talk_token">
        <a-input v-model:value="formData.ding_talk_token" style="width: 260px" />
      </a-form-item>
      <a-form-item label="tg_bot_token" name="tg_bot_token">
        <a-input v-model:value="formData.tg_bot_token" style="width: 260px" />
      </a-form-item>
      <a-form-item label="tg_chat_id" name="tg_chat_id">
        <a-input v-model:value="formData.tg_chat_id" style="width: 260px" />
      </a-form-item>
      <a-form-item label="wx_push_spt" name="wx_push_spt">
        <a-input v-model:value="formData.wx_push_spt" style="width: 260px" />
      </a-form-item>
      <a-form-item label="频道地址" name="chanel_url">
        <a-input v-model:value="formData.chanel_url" style="width: 260px" />
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button html-type="submit" type="primary">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup>
import API from '@/api/cloud.js'
import { onMounted, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { useConfigStore } from '@/stores/config'
const formData = ref({
  is_execute: 0,
  time_interval: '',
  ding_talk_token: '',
  tg_bot_token: '',
  tg_chat_id: '',
  wx_push_spt: '',
  chanel_url: ''
})
const getConfig = () => {
  API.getConfig().then(res => {
    formData.value = res[0]
  })
}

const stores = useConfigStore()
const onFinish = (values) => {
  API.updateConfig(formData.value).then((res) => {
    console.log('Success:', res)
    message.success('保存成功,' + res.res_message)
    if (formData.value.chanel_url) {
      stores.setChangelUrl(formData.value.chanel_url)
    }
  })
}

onMounted(() => {
  getConfig()
})
</script>
<style lang="less" scoped></style>
