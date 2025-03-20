<template>
  <a-modal v-model:open="model" title="批量重命名" @ok="handleOk" width="1500px">
    <div>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="按顺序替换">
          <a-form :model="formState" name="basic" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
            <a-form-item label="开始字符" name="destFolderName">
              <a-input v-model:value="formState.destFolderName" />
            </a-form-item>
            <a-form-item label="开始数字" name="num">
              <a-input-number v-model:value="formState.num" style="width: 120px" />
            </a-form-item>
            <a-form-item label="结尾" name="end">
              <a-input v-model:value="formState.end" style="width: 120px" />
            </a-form-item>
          </a-form>
          <div style="display: flex">
            <div>
              <div class="" v-for="(item, index) in props.selectedRows">
                {{ item.name }}
              </div>
            </div>
            <div style="margin-left: 10px">
              <div class="" v-for="(item, index) in props.selectedRows">
                <span v-if="formState.destFolderName">
                  <span style="color: red"> {{ formState.destFolderName }}</span>
                  {{ index + formState.num > 9 ? index + formState.num : '0' + (index + formState.num)
                  }}{{ formState.end }}
                </span>
              </div>
            </div>
            <div></div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="按字符替换">
          <a-space>
            <div>匹配字符：</div>
            <a-input v-model:value="replaceForm.oldStr" style="width: 500px"></a-input>
            <a-space>
              <div>替换字符：</div>
              <a-input v-model:value="replaceForm.newStr" style="width: 500px"></a-input>
            </a-space>
          </a-space>
          <div style="display: flex">
            <div>
              <div class="" v-for="(item, index) in oldArr">
                <span v-html="item.name"></span>
              </div>
            </div>
            <div style="margin-left: 10px">
              <div class="" v-for="(item, index) in newArr">
                <span v-html="item.name"> </span>
              </div>
            </div>
            <div></div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <template #footer>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">确认</a-button>
    </template>
  </a-modal>
</template>
<script setup>
import { ref, watch, reactive, onMounted, computed } from 'vue'
import { Form, message } from 'ant-design-vue'
import API from '@/api/cloud.js'
const useForm = Form.useForm
const loading = ref(false)
const model = defineModel()
const emit = defineEmits(['update:update'])
const props = defineProps({
  selectedRows: {
    type: Array,
    default: () => [],
  },
})
const activeKey = ref('2')
const replaceForm = reactive({ oldStr: '', newStr: '' })
const formState = reactive({
  destFolderName: '',
  num: 1,
  end: '',
})
watch(
  () => props.selectedRows,
  (val) => { },
  { deep: true, immediate: true },
)

const rulesRef = reactive({
  destFolderName: [
    {
      required: true,
      message: '请填写',
    },
  ],
  num: [
    {
      required: true,
      message: '请填写',
    },
  ],
  end: [
    {
      required: true,
      message: '请填写',
    },
  ],
})
const { resetFields, validate, validateInfos } = useForm(formState, rulesRef)
function escapeRegExp(string) {
  // 使用 replace 方法将所有正则表达式特殊字符转义
  let newStr = string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& 表示整个匹配的结果
  console.log('newStr >>>', newStr)
  return newStr
}
const handleOk = () => {
  loading.value = true
  if (activeKey.value === '1') {
    validate()
      .then(() => {
        props.selectedRows.forEach((item, index) => {
          const num = index + formState.num > 9 ? index + formState.num : '0' + (index + formState.num)
          setTimeout(() => {
            API.renameFolder({
              folderId: item.id,
              destFolderName: formState.destFolderName + num + formState.end,
            })
          }, 300)
        })
        setTimeout(() => {
          message.success('批量重命名成功！')
          loading.value = false
          emit('update')
          model.value = false
        }, 1000)
      })
      .catch((err) => {
        console.log('error', err)
        loading.value = false
      })
  } else {
    props.selectedRows.forEach((item, index) => {
      setTimeout(() => {
        API.renameFolder({
          folderId: item.id,
          destFolderName: item.name.replace(new RegExp(escapeRegExp(replaceForm.oldStr), 'g'), replaceForm.newStr),
        })
      }, 300)
    })
    setTimeout(() => {
      message.success('批量重命名成功！')
      loading.value = false
      emit('update')
      model.value = false
    }, 1000)
  }
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
function replacedStr(str) {
  if (!replaceForm.regStr) {
    return str
  }
  return str.replace(new RegExp(replaceForm.regStr, 'g'), function (match) {
    return `<span style="color:red;">${replaceForm.resStr}</span>`
  })
}

const oldArr = computed(() => {
  return props.selectedRows.map((item) => {
    return {
      name: replaceForm.oldStr
        ? item.name.replace(new RegExp(escapeRegExp(replaceForm.oldStr), 'g'), function (match) {
          return `<span style="color:red;">${match}</span>`
        })
        : item.name,
      id: item.id,
    }
  })
})
const newArr = computed(() => {
  return props.selectedRows.map((item) => {
    return {
      name:
        replaceForm.newStr && replaceForm.oldStr
          ? item.name.replace(new RegExp(escapeRegExp(replaceForm.oldStr), 'g'), function (match) {
            return `<span style="color:red;">${replaceForm.newStr}</span>`
          })
          : item.name,
      id: item.id,
    }
  })
})
</script>
