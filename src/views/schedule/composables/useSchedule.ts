import { storeToRefs } from 'pinia'
import { useScheduleStore } from '@/stores/schedule'
import type { SchedulePriority, ScheduleStatus } from '../types/schedule'

export const STATUS_LABELS: Record<ScheduleStatus, string> = {
  TODO: '待办',
  IN_PROGRESS: '进行中',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
}

export const PRIORITY_LABELS: Record<SchedulePriority, string> = {
  LOW: '低',
  MEDIUM: '普通',
  HIGH: '高',
}

export function useSchedule() {
  const store = useScheduleStore()
  return {
    store,
    ...storeToRefs(store),
  }
}
