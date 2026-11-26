export type ScheduleItemType = 'PLAN' | 'TASK'
export type ScheduleStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
export type SchedulePriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface ScheduleItem {
  id: number
  title: string
  itemType: ScheduleItemType
  description?: string | null
  status: ScheduleStatus
  priority: SchedulePriority
  startAt?: string | null
  endAt?: string | null
  dueAt?: string | null
  allDay: boolean
  categoryId?: number | null
  categoryName?: string | null
  categoryColor?: string | null
  relatedPlanId?: number | null
  relatedPlanTitle?: string | null
  location?: string | null
  sortOrder?: number
  durationDays?: number | null
  createTime?: string
  updateTime?: string
}

export interface ScheduleCategory {
  id: number
  name: string
  color: string
  itemType: string
  sortOrder: number
  status: number
}

export interface ScheduleStatistics {
  totalCount: number
  highPriorityCount: number
  inProgressCount: number
  completedCount: number
  remainingDays: number
}

export interface ScheduleItemPayload {
  title: string
  itemType: ScheduleItemType
  description?: string | null
  status?: ScheduleStatus
  priority?: SchedulePriority
  startAt?: string | null
  endAt?: string | null
  dueAt?: string | null
  allDay?: boolean
  categoryId?: number | null
  relatedPlanId?: number | null
  location?: string | null
  sortOrder?: number
}

export interface ScheduleFilters {
  itemType: ScheduleItemType | ''
  status: ScheduleStatus | ''
  priority: SchedulePriority | ''
  categoryId: number | null
  keyword: string
}

export interface TimelineDay {
  date: string
  day: number
  weekday: string
  isToday: boolean
  isWeekend: boolean
}

export type ScheduleViewMode = 'timeline' | 'inbox'
