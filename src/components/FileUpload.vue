<template>
  <a-upload :customRequest="handleFileUpload" :file-list="fileList" action="" name="file">
    <a-button>
      {{ title }}
    </a-button>
  </a-upload>
</template>
<script setup>
import { ref } from 'vue'

import * as XLSX from 'xlsx'

const $emit = defineEmits(['ok'])
const fileList = ref([])
const { title } = defineProps({
  title: {
    type: String,
    default: '导入任务'
  }
})
// 处理文件上传
const handleFileUpload = (file) => {
  if (!file) return [];
  try {
    const reader = new FileReader();
    reader.onload = async function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'array' });
      // 获取第一个工作表
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      // 解析工作表为JSON
      const arr = XLSX.utils.sheet_to_json(worksheet);
      $emit('ok', arr)
    };
    reader.readAsArrayBuffer(file.file);
  } catch (error) {
    console.error('Error reading file:', error);
    return []
  }
};

</script>