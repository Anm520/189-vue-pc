import _axios from 'axios';
import router from '../router/index.js'
import { errorCode } from './constant.js'
import { message } from 'ant-design-vue';
// 创建 axios 实例
const axios = _axios.create({
  // baseURL: 'https://api.example.com', // 设置基础 URL
  timeout: 60 * 1000, // 设置超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    Accept: 'application/json;charset=UTF-8',
  },
  withCredentials: true, // 允许携带 cookie
});
// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 假设你的 token 存储在 localStorage 中
    const token = localStorage.getItem('token');
    if (token) {
      // 如果存在 token，则将其添加到请求头中
      config.headers.token = token;
    }
    const cloud = sessionStorage.getItem('cloud');
    if (cloud) {
      // 如果存在 cloud
      config.headers.cloud = cloud;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
axios.interceptors.response.use((response) => {
  // 对响应数据做点什么
  if (response.status == 200 && response.data.res_code == 0) {
    return response.data.data || response.data;
  } else if (response.status == 200 && response.data.res_code == -1) {
    // alert(response.data.res_message)
    let msg = ''
    if (response.data.errorCode) {
      msg = errorCode[response.data.errorCode]
    } else {
      msg = response.data.res_message || response.data.msg || '未知错误'
    }

    message.error(msg)
    return Promise.reject(response.data.data || response.data);
  }
  if (response.status == 401 || response.status == 403) {
    alert('请重新登录')
  }
  if (errorCode[response.data.res_code] || errorCode[response.data.errorCode]) {

    message.error(errorCode[response.data.res_code] || errorCode[response.data.errorCode])
    return Promise.reject(response.data.data || response.data);
  }
  return Promise.reject(response.data);

}, (error) => {
  if (error.status == 401 || error.status == 403) {

    message.error('登陆失效，请重新登陆！')
    router.push('/login')
  }
  // 对响应错误做点什么
  // 例如：处理认证过期
  // if (error.response.data.errorCode === 'InvalidSessionKey') {
  //     console.log('router>>>', router)
  //     // router.push('/login')
  // }
  console.log('error>>>', error)
  return Promise.reject(error);
});
export default axios;