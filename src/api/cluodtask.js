import axios from '@/utils/axios'
import qs from 'qs'

const BASE_URL = '/proxy'
const BASE_LOCAL_URL = '/locality'
const CLOUD_API_URL = '/cloudApi'

// 创建任务
function creatTaskAPI (params) {
  return axios.post(`${BASE_LOCAL_URL}/task/create`, params)
}

function getTaskListAPI (params) {
  return axios.post(`${BASE_LOCAL_URL}/task/list`, params)
}

function getShareInfoAPI (params) {
  return axios.get(`${CLOUD_API_URL}/open/share/listShareDir.action?${qs.stringify(params)}`)
}

function createTaskUserAPI (params) {
  return axios.post(`${BASE_LOCAL_URL}/task/user`, params)
}
// 手动执行任务
function executeTask (params) {
  return axios.post(`${BASE_LOCAL_URL}/task/executeTask`, params)
}
// 手动执行全部任务
function executeTaskAll (params) {
  return axios.post(`${BASE_LOCAL_URL}/task/executeTaskAll`, params)
}

// 更新任务
function updateTask (params) {
  return axios.post(`${BASE_LOCAL_URL}/task/update`, params)
}

// 删除任务
function deleteTask (params) {
  return axios.post(`${BASE_LOCAL_URL}/task/delete`, params)
}

// 获取分享链接信息
function getLinkInfoAPI (code) {
  return axios.get(`${CLOUD_API_URL}/open/share/getShareInfoByCodeV2.action?shareCode=${code}`)
}

//
function getAllTasksAPI () {
  return axios.post(`${BASE_LOCAL_URL}/task/getAll`)
}

function getUserInfo (params) {
  return axios.post(`${BASE_LOCAL_URL}/user/getByloginName`, params)
}

function updateUserInfo (params) {
  return axios.post(`${BASE_LOCAL_URL}/user/update`, params)
}
function createTimedTask (params) {
  return axios.post(`${BASE_LOCAL_URL}/task/timed/create`, params)
}

export default {
  creatTaskAPI,
  getTaskListAPI,
  getShareInfoAPI,
  createTaskUserAPI,
  executeTask,
  updateTask,
  deleteTask,
  getLinkInfoAPI,
  getAllTasksAPI,
  getUserInfo,
  updateUserInfo,createTimedTask,executeTaskAll
}