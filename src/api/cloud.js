import axios from '../utils/axios'
const BASE_LOCAL_URL = '/locality'
/**
 * 云盘登录
 * @param {*} params ==> {account}
 * @returns 
 */
const cloudLogin = (params) => axios.post(`${BASE_LOCAL_URL}/cloud/serve/login`, params)
// 获取云盘容量信息
const getUserSizeInfo = (params) => axios.post(`${BASE_LOCAL_URL}/cloud/serve/getUserSizeInfo`, params)
// 获取文件列表
const getListFiles = (params) => axios.post(`${BASE_LOCAL_URL}/cloud/serve/getListFiles`, params)

// 获取文件列表
const getObjectFolderNodes = (params) => axios.post(`${BASE_LOCAL_URL}/cloud/serve/getObjectFolderNodes`, params)
function getFullPath(params) {
    return axios.post(`${BASE_LOCAL_URL}/cloud/serve/getFullPath`, params)
}

// 创建文件夹
const createFolder = (params) => axios.post(`${BASE_LOCAL_URL}/cloud/serve/createFolder`, params)
// 创建批量任务
const createBatchTask = (params) => axios.post(`${BASE_LOCAL_URL}/cloud/serve/createBatchTask`, params)
// 重命名文件夹
const renameFolder = (params) => axios.post(`${BASE_LOCAL_URL}/cloud/serve/renameFolder`, params)
// 获取分享信息
function getShareInfoByCode(params) {
    return axios.post(`${BASE_LOCAL_URL}/cloud/serve/getShareInfoByCode`, params)
}
// 获取分享目录链接
function getListShareDir(params) {
    return axios.post(`${BASE_LOCAL_URL}/cloud/serve/getListShareDir`, params)
}

// 登录
const loginFn = (params) => axios.post(`${BASE_LOCAL_URL}/login`, params)
// 注册
const registerFn = (params) => axios.post(`${BASE_LOCAL_URL}/register`, params)
// 获取账号列表
const getAccountList = (params) => axios.post(`${BASE_LOCAL_URL}/task/account/list`, params)

// 获取Cookies
const getCookies = (params) => axios.post(`${BASE_LOCAL_URL}/task/account/getCookies`, params)
// 删除账号
const BatchDelete = (params) => axios.post(`${BASE_LOCAL_URL}/task/account/batch/delete`, params)
/**
 * 批量添加更新账号
 * @param {*} params ==> {list:[{ account, password }]}
 * @returns 
 */
const BatchUpdate = (params) => axios.post(`${BASE_LOCAL_URL}/task/account/batch/update`, params)
// 创建任务
const createTask = (params) => axios.post(`${BASE_LOCAL_URL}/task/create`, params)
// 获取任务列表
const getAllTaskList = (params) => axios.post(`${BASE_LOCAL_URL}/task/list`, params)
// 获取任务列表
const getTaskList = (params) => axios.post(`${BASE_LOCAL_URL}/task/list/page`, params)
const getTaskDetail = (params) => axios.post(`${BASE_LOCAL_URL}/task/detail`, params)

// 删除任务 批量删除
const deleteTask = (params) => axios.post(`${BASE_LOCAL_URL}/task/delete`, params)
// 编辑任务
const updateTask = (params) => axios.post(`${BASE_LOCAL_URL}/task/update`, params)
// 获取任务详情
const getConfig = () => axios.post(`${BASE_LOCAL_URL}/task/config/get`)
// 更新任务配置
const updateConfig = (params) => axios.post(`${BASE_LOCAL_URL}/task/config/update`, params)
// 执行任务
const runTask = (params) => axios.post(`${BASE_LOCAL_URL}/task/run`, params)
// 执行所有任务
const runAllTask = (params) => axios.post(`${BASE_LOCAL_URL}/task/run/all`, params)

const getRecycleList = (params) => axios.post(`${BASE_LOCAL_URL}/cloud/serve/getRecycleList`, params)


export default {
    getFullPath, getCookies, getObjectFolderNodes, getShareInfoByCode, getListShareDir, renameFolder, getListFiles, getUserSizeInfo, loginFn,
    getAccountList, BatchDelete, BatchUpdate, cloudLogin, createFolder, createBatchTask, createTask, getTaskList, deleteTask,
    updateTask, updateConfig, getConfig, registerFn, runTask, getTaskDetail, runAllTask, getAllTaskList, getRecycleList
}