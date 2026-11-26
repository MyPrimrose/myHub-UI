import { request } from '../request'
import type { ScheduleCategory } from '@/views/schedule/types/schedule'

interface ApiResult<T> {
  code: number
  message: string
  data: T
}

export async function fetchScheduleCategories(itemType?: string, includeDisabled = false) {
  return request.get('/schedule/categories', {
    params: { itemType, includeDisabled },
  }) as Promise<ApiResult<ScheduleCategory[]>>
}

export async function createScheduleCategory(payload: {
  name: string
  color?: string
  itemType?: string
  sortOrder?: number
}) {
  return request.post('/schedule/categories', payload) as Promise<ApiResult<ScheduleCategory>>
}

export async function updateScheduleCategory(
  id: number,
  payload: { name: string; color?: string; itemType?: string; sortOrder?: number; status?: number },
) {
  return request.put(`/schedule/categories/${id}`, payload) as Promise<ApiResult<ScheduleCategory>>
}

export async function disableScheduleCategory(id: number) {
  return request.patch(`/schedule/categories/${id}/disable`) as Promise<ApiResult<null>>
}
