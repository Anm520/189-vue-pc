import axios from '@/utils/axios.js'
import qs from 'qs'

const BASE_URL = '/proxy'
const BASE_LOCAL_URL = '/locality'
const login = (params) => axios.post(`${BASE_LOCAL_URL}/login`, params)

// //获取个人信息
// function getUserBriefInfo () {
//   const params = {
//     noCache: Math.random(),
//   }
//   return axios.get(`${BASE_URL}/api/portal/v2/getUserBriefInfo.action?${qs.stringify(params)}`)
// }
//获取个人信息
function getUserBriefInfo() {
  return axios.post(`${BASE_LOCAL_URL}/getUserBriefInfo`)
}

// 获取文件夹目录
function getObjectFolderNodes(params) {
  return axios.post(`${BASE_LOCAL_URL}/getObjectFolderNodes`, params)
}

// 新建文件夹
function createFolder(params) {
  return axios.post(`${BASE_LOCAL_URL}/createFolder`, params)
}

//获取目录下的文件
function getlistFiles(params) {
  return axios.post(`${BASE_LOCAL_URL}/getListFiles`, params)
}

// 重命名目录
function renameFolder(params) {
  return axios.post(`${BASE_LOCAL_URL}/renameFolder`, params)
}

// 删除文件夹
function createBatchTask(params) {
  return axios.post(`${BASE_LOCAL_URL}/createBatchTask`, params)
}

// 删除文件夹
function checkBatchTask(params) {
  return axios.post(`${BASE_LOCAL_URL}/checkBatchTask`, params)
}

//
function setCookies() {
  return axios.post(`${BASE_LOCAL_URL}/getCookies`)
}

function getFullPath(params) {
  return axios.post(`${BASE_LOCAL_URL}/getFullPath`, params)
}

function getLoginName(params) {
  return axios.post(`${BASE_LOCAL_URL}/getLoginName`, params)
}

function getListShareDir(params) {
  return axios.post(`${BASE_LOCAL_URL}/getListShareDir`, params)
}
function getLinkInfo(params) {
  return axios.post(`${BASE_LOCAL_URL}/getLinkInfo`, params)
}
// 回收站列表
function getRecycleList() {
  return axios.post(`${BASE_LOCAL_URL}/getRecycleList`)
}
export default {
  login,
  getUserBriefInfo,
  getObjectFolderNodes,
  getlistFiles,
  renameFolder,
  setCookies,
  createFolder,
  createBatchTask,
  checkBatchTask,
  getFullPath,
  getLoginName,
  getListShareDir,
  getLinkInfo,
  getRecycleList,
}
