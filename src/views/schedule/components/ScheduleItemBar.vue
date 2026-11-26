<script setup lang="ts">
import { computed } from 'vue'
import type { ScheduleItem } from '../types/schedule'

const props = defineProps<{
  item: ScheduleItem
  startCol: number
  span: number
  continuesBefore?: boolean
  continuesAfter?: boolean
  isSingleDay?: boolean
  selected?: boolean
}>()

const emit = defineEmits<{
  select: []
}>()

const tone = computed(() => {
  if (props.item.priority === 'HIGH') return 'high'
  if (props.item.priority === 'LOW') return 'light'
  if (props.item.status === 'IN_PROGRESS') return 'progress'
  if (props.item.itemType === 'TASK') return 'task'
  return 'plan'
})

const initial = computed(() => props.item.title.slice(0, 1))
</script>

<template>
  <button
    type="button"
    class="item-bar"
    :class="[
      `tone-${tone}`,
      `status-${item.status.toLowerCase()}`,
      {
        selected,
        'single-day': isSingleDay,
        'continues-before': continuesBefore,
        'continues-after': continuesAfter,
      },
    ]"
    :style="{
      '--start-col': startCol + 1,
      '--span': span,
    }"
    @click="emit('select')"
  >
    <span class="title">{{ item.title }}</span>
    <span class="badge">{{ initial }}</span>
  </button>
</template>

<style scoped lang="scss">
.item-bar {
  grid-column: var(--start-col) / span var(--span);
  min-width: 0;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 0 4px;
  padding: 0 8px 0 14px;
  border: 0;
  border-radius: 999px;
  text-align: left;
  cursor: pointer;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    filter 160ms ease;
}
.item-bar:hover,
.item-bar.selected {
  transform: translateY(-1px);
  filter: brightness(0.98);
  box-shadow: 0 12px 24px -18px rgb(80 60 140 / 55%);
}
.title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 650;
}
.badge {
  width: 26px;
  height: 26px;
  flex: 0 0 26px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgb(255 255 255 / 72%);
  font-size: 11px;
  font-weight: 700;
}
.tone-high {
  color: #9a4458;
  background: linear-gradient(90deg, #f8c4cd, #f7d6dc);
}
.tone-progress {
  color: #5b4b8a;
  background: linear-gradient(90deg, #d8ccff, #e8e0ff);
}
.tone-light {
  color: #2f7a6a;
  background: linear-gradient(90deg, #9ee0cf, #c8f0e6);
}
.tone-plan {
  color: #5b4b8a;
  background: linear-gradient(90deg, #ddd2ff, #ece6ff);
}
.tone-task {
  color: #3f5f7a;
  background: linear-gradient(90deg, #cfe4ff, #e4f0ff);
}
.single-day {
  justify-content: center;
  padding-inline: 8px;
}
.single-day .title {
  display: none;
}
.status-completed {
  opacity: 0.62;
}
.status-completed .title {
  text-decoration: line-through;
}
.status-cancelled {
  opacity: 0.48;
  filter: grayscale(0.35);
}
.continues-before {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  margin-left: 0;
}
.continues-after {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  margin-right: 0;
}
:global(:root[data-theme='dark']) .badge {
  background: rgb(0 0 0 / 22%);
  color: inherit;
}
</style>
