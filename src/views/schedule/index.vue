<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useScheduleStore } from '@/stores/schedule'
import { useTimeline } from './composables/useTimeline'
import type { ScheduleItem, ScheduleItemPayload, ScheduleItemType } from './types/schedule'
import ScheduleToolbar from './components/ScheduleToolbar.vue'
import ScheduleFilters from './components/ScheduleFilters.vue'
import ScheduleStatistics from './components/ScheduleStatistics.vue'
import ScheduleTimeline from './components/ScheduleTimeline.vue'
import ScheduleDetailPanel from './components/ScheduleDetailPanel.vue'
import ScheduleFormDrawer from './components/ScheduleFormDrawer.vue'
import ScheduleInbox from './components/ScheduleInbox.vue'

const store = useScheduleStore()
const { monthLabel } = useTimeline(computed(() => store.monthAnchor))

const drawerVisible = ref(false)
const editingItem = ref<ScheduleItem | null>(null)
const defaultType = ref<ScheduleItemType>('TASK')

const isCurrentMonth = computed(() => store.monthAnchor.isSame(dayjs(), 'month'))

let keywordTimer: ReturnType<typeof setTimeout> | null = null

async function bootstrap() {
  await store.loadCategories()
  await store.refreshAll()
}

onMounted(() => {
  void bootstrap()
})

watch(
  () => store.monthAnchor.format('YYYY-MM'),
  () => {
    void store.loadTimeline()
  },
)

watch(
  () => [
    store.filters.itemType,
    store.filters.status,
    store.filters.priority,
    store.filters.categoryId,
  ],
  () => {
    void store.refreshAll()
  },
)

watch(
  () => store.filters.keyword,
  () => {
    if (keywordTimer) clearTimeout(keywordTimer)
    keywordTimer = setTimeout(() => {
      void store.refreshAll()
    }, 300)
  },
)

function openCreate(type: ScheduleItemType = 'TASK') {
  editingItem.value = null
  defaultType.value = type
  drawerVisible.value = true
}

function openEdit(item?: ScheduleItem | null) {
  const target = item || store.selectedItem
  if (!target) return
  editingItem.value = target
  defaultType.value = target.itemType
  drawerVisible.value = true
}

async function chooseCreateType() {
  try {
    await ElMessageBox.confirm('要创建哪类事项？', '新增', {
      distinguishCancelAndClose: true,
      confirmButtonText: '计划',
      cancelButtonText: '任务',
      type: 'info',
    })
    openCreate('PLAN')
  } catch (action) {
    if (action === 'cancel') openCreate('TASK')
  }
}

async function handleSubmit(payload: ScheduleItemPayload, id?: number) {
  try {
    await store.saveItem(payload, id)
    drawerVisible.value = false
    ElMessage.success(id ? '已更新事项' : '已创建事项')
    if (!payload.startAt && !payload.endAt && !payload.dueAt && payload.itemType === 'TASK') {
      store.viewMode = 'inbox'
    } else {
      store.viewMode = 'timeline'
    }
  } catch {
    // request interceptor already shows error toast
  }
}

async function handleStatus(status: ScheduleItem['status']) {
  if (!store.selectedId) return
  try {
    await store.changeStatus(store.selectedId, status)
    ElMessage.success('状态已更新')
  } catch {
    /* handled */
  }
}

async function handleRemove() {
  const item = store.selectedItem
  if (!item) return
  const message =
    item.itemType === 'PLAN'
      ? '删除计划后，关联任务会保留，但会解除与该计划的关系。确定删除吗？'
      : '删除后事项将不再出现在排期表中。确定删除吗？'
  try {
    await ElMessageBox.confirm(message, '确认删除', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await store.removeItem(item.id)
    ElMessage.success('已删除')
  } catch {
    /* cancelled or failed */
  }
}
</script>

<template>
  <div class="schedule-page">
    <section class="board">
      <ScheduleToolbar
        :month-label="monthLabel"
        :is-current-month="isCurrentMonth"
        @prev="store.shiftMonth(-1)"
        @next="store.shiftMonth(1)"
        @today="store.goThisMonth()"
        @create="chooseCreateType"
      />

      <ScheduleFilters
        v-model="store.filters"
        v-model:view-mode="store.viewMode"
        :categories="store.categories"
        :inbox-count="store.inbox.length"
      />

      <ScheduleInbox
        v-if="store.viewMode === 'inbox'"
        :items="store.inbox"
        :loading="store.inboxLoading"
        :selected-id="store.selectedId"
        @select="store.selectItem"
        @create="openCreate('TASK')"
        @schedule="openEdit"
      />
      <ScheduleTimeline
        v-else
        :month-anchor="store.monthAnchor"
        :items="store.items"
        :selected-id="store.selectedId"
        :loading="store.loading"
        :statistics="store.statistics"
        @select="store.selectItem"
      />
    </section>

    <aside class="side-stack">
      <ScheduleDetailPanel
        :item="store.selectedItem"
        :saving="store.saving"
        @close="store.selectItem(null)"
        @edit="openEdit()"
        @status="handleStatus"
        @remove="handleRemove"
      />
      <ScheduleStatistics :statistics="store.statistics" :loading="store.loading" />
    </aside>

    <ScheduleFormDrawer
      v-model:visible="drawerVisible"
      :saving="store.saving"
      :editing="editingItem"
      :default-type="defaultType"
      :categories="store.categories"
      :plans="store.plans"
      @submit="handleSubmit"
    />
  </div>
</template>

<style scoped lang="scss">
.schedule-page {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 18px;
  align-items: start;
}
.board {
  min-width: 0;
  padding: 22px 22px 18px;
  border: 1px solid #efeaf8;
  border-radius: 28px;
  background: rgb(255 255 255 / 88%);
  box-shadow:
    0 1px 0 rgb(255 255 255 / 80%) inset,
    0 24px 48px -36px rgb(124 92 214 / 35%);
}
.side-stack {
  display: grid;
  gap: 14px;
  position: sticky;
  top: 0;
}
@media (max-width: 1180px) {
  .schedule-page {
    grid-template-columns: 1fr;
  }
  .side-stack {
    position: static;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 760px) {
  .board {
    padding: 16px;
    border-radius: 22px;
  }
  .side-stack {
    grid-template-columns: 1fr;
  }
}
:global(:root[data-theme='dark']) .board {
  border-color: var(--border-color);
  background: rgb(45 41 59 / 78%);
}
</style>
