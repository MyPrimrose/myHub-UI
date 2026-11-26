<script setup lang="ts">
import { Inbox } from 'lucide-vue-next'
import type { ScheduleCategory, ScheduleFilters, ScheduleViewMode } from '../types/schedule'

const props = defineProps<{
  modelValue: ScheduleFilters
  categories: ScheduleCategory[]
  viewMode: ScheduleViewMode
  inboxCount: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ScheduleFilters]
  'update:viewMode': [value: ScheduleViewMode]
}>()

function update<K extends keyof ScheduleFilters>(key: K, value: ScheduleFilters[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

function resetQuickFilters() {
  emit('update:viewMode', 'timeline')
  emit('update:modelValue', {
    ...props.modelValue,
    status: '',
    priority: '',
  })
}

function setHigh() {
  emit('update:viewMode', 'timeline')
  emit('update:modelValue', {
    ...props.modelValue,
    priority: props.modelValue.priority === 'HIGH' ? '' : 'HIGH',
    status: '',
  })
}

function setInProgress() {
  emit('update:viewMode', 'timeline')
  emit('update:modelValue', {
    ...props.modelValue,
    status: props.modelValue.status === 'IN_PROGRESS' ? '' : 'IN_PROGRESS',
    priority: '',
  })
}

function setLight() {
  emit('update:viewMode', 'timeline')
  emit('update:modelValue', {
    ...props.modelValue,
    priority: props.modelValue.priority === 'LOW' ? '' : 'LOW',
    status: '',
  })
}
</script>

<template>
  <div class="filters">
    <div class="top-row">
      <div class="chip-row">
        <button
          type="button"
          class="chip"
          :class="{ active: viewMode === 'timeline' && !modelValue.status && !modelValue.priority }"
          @click="resetQuickFilters"
        >
          全部
        </button>
        <button
          type="button"
          class="chip"
          :class="{ active: modelValue.priority === 'HIGH' }"
          @click="setHigh"
        >
          高优先
        </button>
        <button
          type="button"
          class="chip"
          :class="{ active: modelValue.status === 'IN_PROGRESS' }"
          @click="setInProgress"
        >
          进行中
        </button>
        <button
          type="button"
          class="chip"
          :class="{ active: modelValue.priority === 'LOW' }"
          @click="setLight"
        >
          轻量
        </button>
        <button
          type="button"
          class="chip inbox"
          :class="{ active: viewMode === 'inbox' }"
          @click="emit('update:viewMode', viewMode === 'inbox' ? 'timeline' : 'inbox')"
        >
          <Inbox :size="14" />
          收集箱
          <span v-if="inboxCount">{{ inboxCount }}</span>
        </button>
      </div>

      <div class="legend" aria-label="图例">
        <span><i class="dot high"></i>高优先</span>
        <span><i class="dot progress"></i>进行中</span>
        <span><i class="dot light"></i>轻量</span>
        <span><i class="dot today"></i>今天</span>
      </div>
    </div>

    <div class="control-row">
      <select
        :value="modelValue.itemType"
        @change="
          update('itemType', ($event.target as HTMLSelectElement).value as ScheduleFilters['itemType'])
        "
      >
        <option value="">全部类型</option>
        <option value="PLAN">计划</option>
        <option value="TASK">任务</option>
      </select>
      <select
        :value="modelValue.categoryId ?? ''"
        @change="
          update(
            'categoryId',
            ($event.target as HTMLSelectElement).value
              ? Number(($event.target as HTMLSelectElement).value)
              : null,
          )
        "
      >
        <option value="">全部分类</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
      <select
        :value="modelValue.status"
        @change="
          update('status', ($event.target as HTMLSelectElement).value as ScheduleFilters['status'])
        "
      >
        <option value="">全部状态</option>
        <option value="TODO">待办</option>
        <option value="IN_PROGRESS">进行中</option>
        <option value="COMPLETED">已完成</option>
        <option value="CANCELLED">已取消</option>
      </select>
      <input
        :value="modelValue.keyword"
        type="search"
        placeholder="搜索标题、描述、地点"
        @input="update('keyword', ($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.filters {
  display: grid;
  gap: 12px;
  margin-bottom: 14px;
}
.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.chip-row,
.control-row,
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip {
  height: 34px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  border: 1px solid transparent;
  border-radius: 999px;
  color: #7a7394;
  background: #f3f0fa;
  font-size: 12px;
  cursor: pointer;
}
.chip.active {
  color: #7b5fe3;
  border-color: rgb(139 109 240 / 22%);
  background: #efe8ff;
  box-shadow: 0 8px 18px -16px #8b6df0;
}
.chip.inbox span {
  min-width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: white;
  background: #8b6df0;
  font-size: 10px;
}
.legend {
  align-items: center;
  color: #9a93b2;
  font-size: 12px;
}
.legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
.dot.high {
  background: #f3a0ad;
}
.dot.progress {
  background: #a78bfa;
}
.dot.light {
  background: #6dceb8;
}
.dot.today {
  background: #5b8def;
  box-shadow: 0 0 0 3px rgb(91 141 239 / 18%);
}
.control-row select,
.control-row input {
  height: 36px;
  border: 1px solid #ebe6f6;
  border-radius: 12px;
  padding: 0 12px;
  color: var(--text-primary);
  background: #faf8ff;
  font-size: 13px;
}
.control-row input {
  min-width: 200px;
  flex: 1;
}
:global(:root[data-theme='dark']) .chip {
  background: var(--bg-subtle);
  color: var(--text-secondary);
}
:global(:root[data-theme='dark']) .control-row select,
:global(:root[data-theme='dark']) .control-row input {
  border-color: var(--border-color);
  background: var(--bg-subtle);
}
</style>
