import axios, { type AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import { router } from '@/router'
import { useUserStore } from '@/stores/user'

export const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

request.interceptors.request.use((config) => {
  config.withCredentials = true
  const cookie = document.cookie.split('; ').find((part) => part.startsWith('XSRF-TOKEN='))
  if (cookie && ['post', 'put', 'patch', 'delete'].includes((config.method || '').toLowerCase())) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(cookie.slice('XSRF-TOKEN='.length))
  }
  return config
})

request.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message || error.message || '请求失败，请稍后重试'
    if (error.response?.status === 401 && !String(error.config?.url).includes('/auth/login')) {
      useUserStore().clear()
      if (router.currentRoute.value.path !== '/login') void router.replace({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
    } else ElMessage.error(message)
    return Promise.reject(error)
  },
)
