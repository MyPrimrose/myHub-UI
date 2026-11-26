import dayjs, { type Dayjs } from 'dayjs'
import 'dayjs/locale/zh-cn'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { ScheduleItem, TimelineDay } from '../types/schedule'

dayjs.locale('zh-cn')

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

export function useTimeline(monthAnchor: MaybeRefOrGetter<Dayjs>) {
  const currentMonth = () => toValue(monthAnchor)

  const monthLabel = computed(() => currentMonth().format('YYYY年 M月'))

  const days = computed<TimelineDay[]>(() => {
    const start = currentMonth().startOf('month')
    const total = start.daysInMonth()
    const today = dayjs()
    return Array.from({ length: total }, (_, index) => {
      const date = start.add(index, 'day')
      return {
        date: date.format('YYYY-MM-DD'),
        day: date.date(),
        weekday: WEEKDAYS[date.day()],
        isToday: date.isSame(today, 'day'),
        isWeekend: date.day() === 0 || date.day() === 6,
      }
    })
  })

  const range = computed(() => ({
    startDate: currentMonth().startOf('month').format('YYYY-MM-DD'),
    endDate: currentMonth().endOf('month').format('YYYY-MM-DD'),
  }))

  function dayIndex(date: string | Dayjs) {
    const target = dayjs(date).startOf('day')
    const start = currentMonth().startOf('month')
    return target.diff(start, 'day')
  }

  function clampBar(item: ScheduleItem) {
    const monthStart = currentMonth().startOf('month')
    const monthEnd = currentMonth().endOf('month')
    const rawStart = dayjs(item.startAt || item.dueAt || item.endAt)
    const rawEnd = dayjs(item.endAt || item.startAt || item.dueAt)
    if (!rawStart.isValid() || !rawEnd.isValid()) return null

    const start = rawStart.startOf('day')
    let end = rawEnd.startOf('day')
    if (end.isBefore(start)) end = start

    if (end.isBefore(monthStart) || start.isAfter(monthEnd)) return null

    const clippedStart = start.isBefore(monthStart) ? monthStart : start
    const clippedEnd = end.isAfter(monthEnd) ? monthEnd : end
    const startCol = clippedStart.diff(monthStart, 'day')
    const span = clippedEnd.diff(clippedStart, 'day') + 1
    const dueOnly = Boolean(item.dueAt && !item.startAt && !item.endAt)
    return {
      startCol,
      span,
      continuesBefore: start.isBefore(monthStart),
      continuesAfter: end.isAfter(monthEnd),
      isSingleDay: dueOnly || rawStart.isSame(rawEnd, 'day'),
    }
  }

  return { monthLabel, days, range, dayIndex, clampBar }
}

export function formatDateTime(value?: string | null, allDay = false) {
  if (!value) return '—'
  const date = dayjs(value)
  if (!date.isValid()) return '—'
  return allDay ? date.format('YYYY-MM-DD') : date.format('YYYY-MM-DD HH:mm')
}

export function formatDateRange(item: ScheduleItem) {
  if (item.startAt && item.endAt) {
    const start = dayjs(item.startAt)
    const end = dayjs(item.endAt)
    if (start.isSame(end, 'day')) {
      return item.allDay ? start.format('M月D日') : `${start.format('M月D日 HH:mm')} – ${end.format('HH:mm')}`
    }
    return `${start.format('M月D日')} – ${end.format('M月D日')}`
  }
  if (item.dueAt) return `截止 ${dayjs(item.dueAt).format('M月D日')}`
  if (item.startAt) return dayjs(item.startAt).format('M月D日')
  return '未安排'
}

export function formatShortRange(item: ScheduleItem) {
  if (item.startAt && item.endAt) {
    const start = dayjs(item.startAt)
    const end = dayjs(item.endAt)
    if (start.isSame(end, 'day')) return start.format('M/D')
    return `${start.format('M/D')} - ${end.format('M/D')}`
  }
  if (item.dueAt) return `截止 ${dayjs(item.dueAt).format('M/D')}`
  if (item.startAt) return dayjs(item.startAt).format('M/D')
  return '未安排'
}
