<script setup lang="ts">
import type { ScheduleItem, TimelineDay } from '../types/schedule'
import { formatShortRange } from '../composables/useTimeline'
import ScheduleItemBar from './ScheduleItemBar.vue'

defineProps<{
  item: ScheduleItem
  days: TimelineDay[]
  labelWidth: number
  dayWidth: number
  bar: {
    startCol: number
    span: number
    continuesBefore: boolean
    continuesAfter: boolean
    isSingleDay: boolean
  } | null
  selected?: boolean
}>()

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <div
    class="timeline-row"
    :class="{ selected }"
    :style="{
      '--label-width': `${labelWidth}px`,
      '--day-width': `${dayWidth}px`,
      '--day-count': days.length,
    }"
  >
    <button type="button" class="row-label" @click="emit('select')">
      <span class="copy">
        <b>{{ item.title }}</b>
        <small>
          {{ formatShortRange(item) }}
          <template v-if="item.durationDays"> · {{ item.durationDays }} 天</template>
        </small>
      </span>
    </button>
    <div class="row-track">
      <div class="track-bg">
        <div
          v-for="day in days"
          :key="day.date"
          class="track-cell"
          :class="{ weekend: day.isWeekend, today: day.isToday }"
        ></div>
      </div>
      <div class="track-bars">
        <ScheduleItemBar
          v-if="bar"
          :item="item"
          :start-col="bar.startCol"
          :span="bar.span"
          :continues-before="bar.continuesBefore"
          :continues-after="bar.continuesAfter"
          :is-single-day="bar.isSingleDay"
          :selected="selected"
          @select="emit('select')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.timeline-row {
  display: grid;
  grid-template-columns: var(--label-width) 1fr;
  min-width: calc(var(--label-width) + var(--day-count) * var(--day-width));
  min-height: 64px;
  border-bottom: 1px solid #f0ebf8;
}
.timeline-row.selected {
  background: rgb(139 109 240 / 4%);
}
.row-label {
  position: sticky;
  left: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border: 0;
  border-right: 1px solid #f0ebf8;
  background: rgb(255 255 255 / 96%);
  text-align: left;
  cursor: pointer;
}
.copy {
  min-width: 0;
  display: grid;
  gap: 4px;
}
.copy b,
.copy small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.copy b {
  color: #3c3554;
  font-size: 13px;
  font-weight: 650;
}
.copy small {
  color: #a49db9;
  font-size: 11px;
}
.row-track {
  position: relative;
  min-height: 64px;
}
.track-bg,
.track-bars {
  display: grid;
  grid-template-columns: repeat(var(--day-count), var(--day-width));
}
.track-bg {
  position: absolute;
  inset: 0;
}
.track-bars {
  position: relative;
  z-index: 1;
  align-items: center;
  min-height: 64px;
  padding: 12px 0;
}
.track-cell {
  height: 100%;
  border-right: 1px solid #f4f0fa;
}
.track-cell.weekend {
  background: rgb(139 109 240 / 2.5%);
}
.track-cell.today {
  background: rgb(91 141 239 / 6%);
}
:global(:root[data-theme='dark']) .row-label {
  background: rgb(45 41 59 / 96%);
  border-right-color: var(--border-color);
}
:global(:root[data-theme='dark']) .timeline-row {
  border-bottom-color: var(--border-color);
}
:global(:root[data-theme='dark']) .copy b {
  color: var(--text-primary);
}
</style>
