<script setup lang="ts">
import type { TimelineDay } from '../types/schedule'

defineProps<{
  days: TimelineDay[]
  labelWidth: number
  dayWidth: number
}>()
</script>

<template>
  <div
    class="timeline-header"
    :style="{
      '--label-width': `${labelWidth}px`,
      '--day-width': `${dayWidth}px`,
      '--day-count': days.length,
    }"
  >
    <div class="label-cell">事项 / 日期</div>
    <div class="days">
      <div
        v-for="day in days"
        :key="day.date"
        class="day-cell"
        :class="{ today: day.isToday, weekend: day.isWeekend }"
      >
        <span class="weekday">{{ day.weekday }}</span>
        <strong>{{ day.day }}</strong>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.timeline-header {
  position: sticky;
  top: 0;
  z-index: 3;
  display: grid;
  grid-template-columns: var(--label-width) 1fr;
  min-width: calc(var(--label-width) + var(--day-count) * var(--day-width));
  border-bottom: 1px solid #efeaf8;
  background: rgb(255 255 255 / 96%);
  backdrop-filter: blur(10px);
}
.label-cell {
  position: sticky;
  left: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-right: 1px solid #efeaf8;
  color: #a49db9;
  background: inherit;
  font-size: 12px;
}
.days {
  display: grid;
  grid-template-columns: repeat(var(--day-count), var(--day-width));
}
.day-cell {
  display: grid;
  justify-items: center;
  gap: 4px;
  padding: 12px 0;
  color: #8b84a3;
}
.day-cell.weekend {
  background: rgb(139 109 240 / 3%);
}
.day-cell.today {
  color: #5b8def;
}
.day-cell.today strong {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: white;
  background: #5b8def;
  box-shadow: 0 8px 16px -10px #5b8def;
}
.weekday {
  font-size: 10px;
}
.day-cell strong {
  font-size: 13px;
  font-weight: 650;
}
:global(:root[data-theme='dark']) .timeline-header {
  background: rgb(45 41 59 / 96%);
  border-bottom-color: var(--border-color);
}
:global(:root[data-theme='dark']) .label-cell {
  border-right-color: var(--border-color);
}
</style>
