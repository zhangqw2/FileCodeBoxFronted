import axios from 'axios'

// 从环境变量中获取 API 基础 URL
const baseURL =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_API_BASE_URL_PROD
    : import.meta.env.VITE_API_BASE_URL_DEV
console.log(baseURL)
console.log(import.meta.env.MODE)

// 创建 axios 实例
const api = axios.create({
  baseURL,
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 处理错误响应
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权,可能需要重新登录
          console.error('未授权,请重新登录')
          break
        case 403:
          // 禁止访问
          console.error('禁止访问')
          break
        case 404:
          // 未找到
          console.error('请求的资源不存在')
          break
        default:
          console.error('发生错误:', error.response.data)
      }
    } else {
      console.error('发生错误:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api
