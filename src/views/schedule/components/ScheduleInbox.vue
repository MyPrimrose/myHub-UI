<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import type { ScheduleItem } from '../types/schedule'
import { PRIORITY_LABELS, STATUS_LABELS } from '../composables/useSchedule'

defineProps<{
  items: ScheduleItem[]
  loading?: boolean
  selectedId?: number | null
}>()

const emit = defineEmits<{
  select: [id: number]
  create: []
  schedule: [item: ScheduleItem]
}>()
</script>

<template>
  <section class="inbox">
    <div class="inbox-head">
      <div>
        <h2>收集箱</h2>
        <p>尚未安排时间的任务会集中在这里，设置日期后会进入时间轴。</p>
      </div>
      <button type="button" @click="emit('create')">
        <Plus :size="14" />
        快速新增任务
      </button>
    </div>

    <div v-if="loading" class="state">正在加载收集箱…</div>
    <div v-else-if="!items.length" class="state">收集箱是空的。新建无日期任务后会出现在这里。</div>
    <ul v-else class="inbox-list">
      <li v-for="item in items" :key="item.id">
        <button
          type="button"
          class="inbox-item"
          :class="{ selected: selectedId === item.id }"
          @click="emit('select', item.id)"
        >
          <span class="avatar">{{ item.title.slice(0, 1) }}</span>
          <div class="copy">
            <strong>{{ item.title }}</strong>
            <small>
              {{ STATUS_LABELS[item.status] }} · {{ PRIORITY_LABELS[item.priority] }}
              <template v-if="item.relatedPlanTitle"> · {{ item.relatedPlanTitle }}</template>
            </small>
          </div>
          <span class="schedule-link" @click.stop="emit('schedule', item)">安排日期</span>
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.inbox {
  min-height: 360px;
}
.inbox-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}
.inbox-head h2 {
  margin: 0;
  font-size: 16px;
}
.inbox-head p {
  margin: 4px 0 0;
  color: #8b84a3;
  font-size: 12px;
}
.inbox-head button {
  height: 36px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  border: 0;
  border-radius: 12px;
  color: white;
  background: #8b6df0;
  cursor: pointer;
  font-size: 12px;
}
.inbox-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}
.inbox-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid transparent;
  border-radius: 16px;
  background: #f7f4fd;
  text-align: left;
  cursor: pointer;
}
.inbox-item.selected,
.inbox-item:hover {
  border-color: rgb(139 109 240 / 25%);
  background: #efe8ff;
}
.avatar {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: white;
  background: linear-gradient(145deg, #b39bff, #8b6df0);
  font-size: 13px;
  font-weight: 700;
}
.copy {
  min-width: 0;
  flex: 1;
}
.copy strong {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
}
.copy small {
  display: block;
  margin-top: 4px;
  color: #a49db9;
  font-size: 11px;
}
.schedule-link {
  flex: 0 0 auto;
  color: #8b6df0;
  font-size: 12px;
  font-weight: 600;
}
.state {
  display: grid;
  place-items: center;
  min-height: 260px;
  border: 1px dashed #ebe6f6;
  border-radius: 18px;
  color: #8b84a3;
  font-size: 13px;
  background: #faf8ff;
}
</style>
