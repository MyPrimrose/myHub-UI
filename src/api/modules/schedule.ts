import { request } from '../request'
import type {
  ScheduleFilters,
  ScheduleItem,
  ScheduleItemPayload,
  ScheduleStatistics,
  ScheduleStatus,
} from '@/views/schedule/types/schedule'

interface ApiResult<T> {
  code: number
  message: string
  data: T
}

export interface ListItemsParams extends Partial<ScheduleFilters> {
  startDate: string
  endDate: string
}

export async function fetchScheduleItems(params: ListItemsParams) {
  return request.get('/schedule/items', { params }) as Promise<ApiResult<ScheduleItem[]>>
}

export async function fetchScheduleItem(id: number) {
  return request.get(`/schedule/items/${id}`) as Promise<ApiResult<ScheduleItem>>
}

export async function createScheduleItem(payload: ScheduleItemPayload) {
  return request.post('/schedule/items', payload) as Promise<ApiResult<ScheduleItem>>
}

export async function updateScheduleItem(id: number, payload: ScheduleItemPayload) {
  return request.put(`/schedule/items/${id}`, payload) as Promise<ApiResult<ScheduleItem>>
}

export async function deleteScheduleItem(id: number) {
  return request.delete(`/schedule/items/${id}`) as Promise<ApiResult<null>>
}

export async function updateScheduleStatus(id: number, status: ScheduleStatus) {
  return request.patch(`/schedule/items/${id}/status`, { status }) as Promise<ApiResult<ScheduleItem>>
}

export async function fetchScheduleStatistics(year: number, month: number) {
  return request.get('/schedule/statistics', { params: { year, month } }) as Promise<
    ApiResult<ScheduleStatistics>
  >
}

export async function fetchScheduleInbox(params?: Partial<ScheduleFilters>) {
  return request.get('/schedule/inbox', { params }) as Promise<ApiResult<ScheduleItem[]>>
}

export async function fetchActivePlans() {
  return request.get('/schedule/plans') as Promise<ApiResult<ScheduleItem[]>>
}
