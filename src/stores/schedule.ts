import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import dayjs, { type Dayjs } from 'dayjs'
import {
  createScheduleItem,
  deleteScheduleItem,
  fetchActivePlans,
  fetchScheduleInbox,
  fetchScheduleItems,
  fetchScheduleStatistics,
  updateScheduleItem,
  updateScheduleStatus,
} from '@/api/modules/schedule'
import { fetchScheduleCategories } from '@/api/modules/schedule-category'
import type {
  ScheduleCategory,
  ScheduleFilters,
  ScheduleItem,
  ScheduleItemPayload,
  ScheduleStatistics,
  ScheduleStatus,
  ScheduleViewMode,
} from '@/views/schedule/types/schedule'

const defaultFilters = (): ScheduleFilters => ({
  itemType: '',
  status: '',
  priority: '',
  categoryId: null,
  keyword: '',
})

export const useScheduleStore = defineStore('schedule', () => {
  const monthAnchor = ref<Dayjs>(dayjs().startOf('month'))
  const viewMode = ref<ScheduleViewMode>('timeline')
  const filters = ref<ScheduleFilters>(defaultFilters())
  const items = ref<ScheduleItem[]>([])
  const inbox = ref<ScheduleItem[]>([])
  const categories = ref<ScheduleCategory[]>([])
  const plans = ref<ScheduleItem[]>([])
  const statistics = ref<ScheduleStatistics | null>(null)
  const selectedId = ref<number | null>(null)
  const loading = ref(false)
  const inboxLoading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)

  const selectedItem = computed(
    () =>
      items.value.find((item) => item.id === selectedId.value) ||
      inbox.value.find((item) => item.id === selectedId.value) ||
      null,
  )

  async function loadCategories() {
    const result = await fetchScheduleCategories()
    categories.value = result.data || []
  }

  async function loadPlans() {
    const result = await fetchActivePlans()
    plans.value = result.data || []
  }

  async function loadTimeline() {
    loading.value = true
    error.value = null
    try {
      const startDate = monthAnchor.value.startOf('month').format('YYYY-MM-DD')
      const endDate = monthAnchor.value.endOf('month').format('YYYY-MM-DD')
      const [itemsResult, statsResult] = await Promise.all([
        fetchScheduleItems({
          startDate,
          endDate,
          itemType: filters.value.itemType || undefined,
          status: filters.value.status || undefined,
          priority: filters.value.priority || undefined,
          categoryId: filters.value.categoryId || undefined,
          keyword: filters.value.keyword || undefined,
        }),
        fetchScheduleStatistics(monthAnchor.value.year(), monthAnchor.value.month() + 1),
      ])
      items.value = itemsResult.data || []
      statistics.value = statsResult.data
      if (selectedId.value && !items.value.some((item) => item.id === selectedId.value)) {
        if (!inbox.value.some((item) => item.id === selectedId.value)) {
          selectedId.value = null
        }
      }
    } catch (err) {
      error.value = '排期数据加载失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadInbox() {
    inboxLoading.value = true
    try {
      const result = await fetchScheduleInbox({
        status: filters.value.status || undefined,
        priority: filters.value.priority || undefined,
        categoryId: filters.value.categoryId || undefined,
        keyword: filters.value.keyword || undefined,
      })
      inbox.value = result.data || []
    } finally {
      inboxLoading.value = false
    }
  }

  async function refreshAll() {
    await Promise.all([loadTimeline(), loadInbox(), loadPlans()])
  }

  function setMonth(next: Dayjs) {
    monthAnchor.value = next.startOf('month')
  }

  function shiftMonth(delta: number) {
    monthAnchor.value = monthAnchor.value.add(delta, 'month').startOf('month')
  }

  function goThisMonth() {
    monthAnchor.value = dayjs().startOf('month')
  }

  function selectItem(id: number | null) {
    selectedId.value = id
  }

  async function saveItem(payload: ScheduleItemPayload, id?: number) {
    saving.value = true
    try {
      const result = id
        ? await updateScheduleItem(id, payload)
        : await createScheduleItem(payload)
      await refreshAll()
      selectedId.value = result.data.id
      return result.data
    } finally {
      saving.value = false
    }
  }

  async function changeStatus(id: number, status: ScheduleStatus) {
    saving.value = true
    try {
      const result = await updateScheduleStatus(id, status)
      await refreshAll()
      selectedId.value = result.data.id
      return result.data
    } finally {
      saving.value = false
    }
  }

  async function removeItem(id: number) {
    saving.value = true
    try {
      await deleteScheduleItem(id)
      if (selectedId.value === id) selectedId.value = null
      await refreshAll()
    } finally {
      saving.value = false
    }
  }

  return {
    monthAnchor,
    viewMode,
    filters,
    items,
    inbox,
    categories,
    plans,
    statistics,
    selectedId,
    selectedItem,
    loading,
    inboxLoading,
    saving,
    error,
    loadCategories,
    loadPlans,
    loadTimeline,
    loadInbox,
    refreshAll,
    setMonth,
    shiftMonth,
    goThisMonth,
    selectItem,
    saveItem,
    changeStatus,
    removeItem,
  }
})
