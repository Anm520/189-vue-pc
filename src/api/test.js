import axios from '@/utils/axios'
import qs from 'qs'
const BASE_URL = '/proxy'
const BASE_LOCAL_URL = '/locality'
// 获取文件夹目录
function getCookies(params) {
  return axios.post(`${BASE_LOCAL_URL}/getCookies`, params)
}
export default {
  getCookies,
}
