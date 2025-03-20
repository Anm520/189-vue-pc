<template>
  <a-modal :open="model" title="新建任务" @cancel="handleCancel" :maskClosable="false">
    <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
    >
      <a-form-item ref="name" label="Activity name" name="name">
        <a-input v-model:value="formState.name"/>
      </a-form-item>
      <a-form-item label="Activity zone" name="region">
        <a-select v-model:value="formState.region" placeholder="please select your zone">
          <a-select-option value="shanghai">Zone one</a-select-option>
          <a-select-option value="beijing">Zone two</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Activity time" required name="date1">
        <a-date-picker
            v-model:value="formState.date1"
            show-time
            type="date"
            placeholder="Pick a date"
            style="width: 100%"
        />
      </a-form-item>
      <a-form-item label="Instant delivery" name="delivery">
        <a-switch v-model:checked="formState.delivery"/>
      </a-form-item>
      <a-form-item label="Activity type" name="type">
        <a-checkbox-group v-model:value="formState.type">
          <a-checkbox value="1" name="type">Online</a-checkbox>
          <a-checkbox value="2" name="type">Promotion</a-checkbox>
          <a-checkbox value="3" name="type">Offline</a-checkbox>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item label="Resources" name="resource">
        <a-radio-group v-model:value="formState.resource">
          <a-radio value="1">Sponsor</a-radio>
          <a-radio value="2">Venue</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="Activity form" name="desc">
        <a-textarea v-model:value="formState.desc"/>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="onSubmit">Create</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>
<script setup>
  import { ref } from 'vue'

  const model = defineModel()
  const loading = ref(false)

  const handleCancel = () => {
    model.value = false
  }
  const handleOk = () => {
    loading.value = true
    setTimeout(() => {
      loading.value = false
      model.value = false
    }, 1500)

  }
</script>
<style scoped lang="less">

</style>