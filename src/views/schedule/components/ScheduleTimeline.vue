<script setup lang="ts">
import { computed } from 'vue'
import type { Dayjs } from 'dayjs'
import type { ScheduleItem, ScheduleStatistics } from '../types/schedule'
import { useTimeline } from '../composables/useTimeline'
import ScheduleTimelineHeader from './ScheduleTimelineHeader.vue'
import ScheduleTimelineRow from './ScheduleTimelineRow.vue'

const props = defineProps<{
  monthAnchor: Dayjs
  items: ScheduleItem[]
  selectedId: number | null
  loading?: boolean
  statistics?: ScheduleStatistics | null
}>()

const emit = defineEmits<{
  select: [id: number]
}>()

const { days, clampBar } = useTimeline(() => props.monthAnchor)

const labelWidth = 210
const dayWidth = 48

const footerText = computed(() => {
  const total = props.statistics?.totalCount ?? props.items.length
  const inProgress = props.statistics?.inProgressCount ?? 0
  return `本月 ${total} 项事项 · ${inProgress} 项进行中`
})
</script>

<template>
  <div class="timeline-shell">
    <div v-if="loading" class="state">正在加载排期…</div>
    <div v-else-if="!items.length" class="state">这个月还没有可展示的计划或任务。</div>
    <template v-else>
      <div class="timeline-scroll">
        <ScheduleTimelineHeader :days="days" :label-width="labelWidth" :day-width="dayWidth" />
        <ScheduleTimelineRow
          v-for="item in items"
          :key="item.id"
          :item="item"
          :days="days"
          :label-width="labelWidth"
          :day-width="dayWidth"
          :bar="clampBar(item)"
          :selected="selectedId === item.id"
          @select="emit('select', item.id)"
        />
      </div>
      <div class="timeline-footer">
        <span>{{ footerText }}</span>
        <span>单击查看详情 · 在右侧面板取消或编辑</span>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.timeline-shell {
  min-height: 420px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.timeline-scroll {
  overflow: auto;
  flex: 1;
  max-height: min(58vh, 640px);
  border: 1px solid #efeaf8;
  border-radius: 18px;
  background: #fff;
}
.timeline-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 12px;
  color: #a49db9;
  font-size: 12px;
}
.state {
  display: grid;
  place-items: center;
  min-height: 320px;
  color: #8b84a3;
  font-size: 13px;
  border: 1px dashed #ebe6f6;
  border-radius: 18px;
  background: #faf8ff;
}
:global(:root[data-theme='dark']) .timeline-scroll {
  border-color: var(--border-color);
  background: rgb(45 41 59 / 72%);
}
:global(:root[data-theme='dark']) .state {
  border-color: var(--border-color);
  background: var(--bg-subtle);
  color: var(--text-secondary);
}
</style>
