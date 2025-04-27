// src/utils/request.js

import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'



const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1'
const API_PORT     = import.meta.env.VITE_API_PORT     || '8080'

const instance = axios.create({
  baseURL: `${API_BASE_URL}:${API_PORT}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    const res = response.data


    // 按 SaResult 规范处理业务状态码
    if (res.code === 200) {
      // 返回 res 而非 response，以便直接拿到 { code, msg, data }
      return res
    } else if (res.code === 401) {
      console.warn('======未登录====', res.msg)
      ElMessage.warning('未登录或登录已过期，请重新登录')
      localStorage.removeItem('token')
      router.push({ name: 'login' })
      return Promise.reject(new Error(res.msg || '未登录'))
    } else if (res.code === 403) {
      ElMessage.error('无权限访问')
      return Promise.reject(new Error(res.msg || '无权限'))
    } else {
      ElMessage.error(res.msg || '请求失败')
      return Promise.reject(new Error(res.msg || '请求失败'))
    }
  },
  error => {
    // HTTP 层级错误
    if (error.response) {
      const { status } = error.response
      if (status === 500) {
        ElMessage.error('服务器错误，请稍后重试')
      } else if (status === 404) {
        ElMessage.error('接口不存在')
      }else if (status === 401) {
        ElMessage.error(`请登录`)
        router.push({ name: 'login' })

      } else {
        ElMessage.error(`HTTP 错误：${status}`)
      }
    } else {
      // 网络或其他错误
      ElMessage.error('网络连接失败')
    }
    return Promise.reject(error)
  }
)

export default instance
