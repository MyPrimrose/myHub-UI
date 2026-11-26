<script setup lang="ts">
import { computed } from 'vue'
import { CalendarDays, MapPin, Pencil, UserRound, X } from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { ScheduleItem } from '../types/schedule'
import { PRIORITY_LABELS, STATUS_LABELS } from '../composables/useSchedule'
import { formatDateRange, formatDateTime } from '../composables/useTimeline'

const props = defineProps<{
  item: ScheduleItem | null
  saving?: boolean
}>()

const emit = defineEmits<{
  close: []
  edit: []
  status: [status: ScheduleItem['status']]
  remove: []
}>()

const initial = computed(() => props.item?.title?.slice(0, 1) || '事')

const remainLabel = computed(() => {
  if (!props.item?.endAt) return null
  const end = dayjs(props.item.endAt).startOf('day')
  const today = dayjs().startOf('day')
  const days = end.diff(today, 'day')
  if (days > 0) return `还剩 ${days} 天`
  if (days === 0) return '今天结束'
  return `已过期 ${Math.abs(days)} 天`
})

const toneClass = computed(() => {
  if (!props.item) return 'tone-default'
  if (props.item.priority === 'HIGH') return 'tone-high'
  if (props.item.priority === 'LOW') return 'tone-light'
  if (props.item.status === 'IN_PROGRESS') return 'tone-progress'
  return 'tone-default'
})
</script>

<template>
  <aside class="detail-panel" :class="[{ empty: !item }, toneClass]">
    <template v-if="item">
      <div class="detail-head">
        <div class="title-row">
          <span class="avatar">{{ initial }}</span>
          <div>
            <div class="kicker">{{ item.itemType === 'PLAN' ? '计划详情' : '任务详情' }}</div>
            <h2>{{ item.title }}</h2>
          </div>
        </div>
        <button type="button" class="icon-btn" aria-label="关闭详情" @click="emit('close')">
          <X :size="16" />
        </button>
      </div>

      <div class="tags">
        <span class="tag status">{{ STATUS_LABELS[item.status] }}</span>
        <span class="tag priority">{{ PRIORITY_LABELS[item.priority] }}</span>
        <span v-if="remainLabel" class="tag remain">{{ remainLabel }}</span>
      </div>

      <div class="info-list">
        <div class="info-row">
          <CalendarDays :size="15" />
          <div>
            <span>时间</span>
            <strong>{{ formatDateRange(item) }}</strong>
          </div>
        </div>
        <div class="info-row">
          <MapPin :size="15" />
          <div>
            <span>地点</span>
            <strong>{{ item.location || '未填写' }}</strong>
          </div>
        </div>
        <div class="info-row">
          <UserRound :size="15" />
          <div>
            <span>{{ item.itemType === 'TASK' ? '关联计划' : '分类' }}</span>
            <strong>
              {{
                item.itemType === 'TASK'
                  ? item.relatedPlanTitle || '独立任务'
                  : item.categoryName || '未分类'
              }}
            </strong>
          </div>
        </div>
      </div>

      <div class="meta-grid">
        <div>
          <span>开始</span>
          <strong>{{ formatDateTime(item.startAt, item.allDay) }}</strong>
        </div>
        <div>
          <span>结束</span>
          <strong>{{ formatDateTime(item.endAt, item.allDay) }}</strong>
        </div>
        <div>
          <span>截止</span>
          <strong>{{ formatDateTime(item.dueAt) }}</strong>
        </div>
        <div>
          <span>持续</span>
          <strong>{{ item.durationDays ? `${item.durationDays} 天` : '—' }}</strong>
        </div>
      </div>

      <p class="desc">{{ item.description || '暂无描述' }}</p>

      <div class="actions">
        <button
          v-if="item.status !== 'CANCELLED'"
          type="button"
          class="ghost"
          :disabled="saving"
          @click="emit('status', 'CANCELLED')"
        >
          取消事项
        </button>
        <button
          v-else
          type="button"
          class="ghost"
          :disabled="saving"
          @click="emit('status', 'TODO')"
        >
          恢复事项
        </button>
        <button type="button" class="primary" :disabled="saving" @click="emit('edit')">
          <Pencil :size="14" />
          编辑
        </button>
      </div>

      <div class="secondary-actions">
        <button
          v-if="item.status !== 'COMPLETED'"
          type="button"
          :disabled="saving"
          @click="emit('status', 'COMPLETED')"
        >
          标记完成
        </button>
        <button
          v-if="item.status !== 'IN_PROGRESS'"
          type="button"
          :disabled="saving"
          @click="emit('status', 'IN_PROGRESS')"
        >
          进行中
        </button>
        <button type="button" class="danger" :disabled="saving" @click="emit('remove')">删除</button>
      </div>
    </template>
    <div v-else class="empty-copy">
      <span class="avatar ghost">选</span>
      <h3>选择一个事项</h3>
      <p>单击时间轴上的计划或任务，在这里查看详情。</p>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.detail-panel {
  padding: 18px;
  border: 1px solid #efeaf8;
  border-radius: 22px;
  background: rgb(255 255 255 / 94%);
  box-shadow: 0 18px 36px -30px rgb(124 92 214 / 35%);
}
.detail-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}
.title-row {
  display: flex;
  gap: 12px;
  min-width: 0;
}
.avatar {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  color: white;
  background: linear-gradient(145deg, #b39bff, #8b6df0);
  font-size: 16px;
  font-weight: 700;
}
.tone-high .avatar {
  background: linear-gradient(145deg, #f7b4bf, #ef8fa0);
}
.tone-light .avatar {
  background: linear-gradient(145deg, #8fdcc8, #5fc4ab);
}
.tone-progress .avatar {
  background: linear-gradient(145deg, #b39bff, #8b6df0);
}
.kicker {
  color: #a49db9;
  font-size: 11px;
}
.detail-head h2 {
  margin: 4px 0 0;
  font-size: 18px;
  line-height: 1.35;
  letter-spacing: -0.02em;
}
.icon-btn {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 10px;
  background: #f3f0fa;
  color: #8b84a3;
  cursor: pointer;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
.tag {
  height: 26px;
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  background: #f3f0fa;
  color: #6f678b;
}
.tag.status {
  background: #efe8ff;
  color: #7b5fe3;
}
.tag.priority {
  background: #fff1f4;
  color: #d56f8e;
}
.tag.remain {
  background: #eef6ff;
  color: #4f79b5;
}
.info-list {
  display: grid;
  gap: 12px;
  margin-bottom: 14px;
}
.info-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  color: #9a93b2;
}
.info-row span {
  display: block;
  font-size: 11px;
}
.info-row strong {
  display: block;
  margin-top: 2px;
  color: #3c3554;
  font-size: 13px;
  font-weight: 600;
}
.meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 12px;
}
.meta-grid span {
  display: block;
  color: #a49db9;
  font-size: 11px;
}
.meta-grid strong {
  display: block;
  margin-top: 3px;
  font-size: 12px;
  color: #4a4463;
}
.desc {
  margin: 0 0 16px;
  padding: 12px 14px;
  border-radius: 14px;
  background: #f7f4fd;
  color: #6f678b;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
}
.actions,
.secondary-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.actions {
  margin-bottom: 8px;
}
.actions button,
.secondary-actions button {
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid #ebe6f6;
  background: white;
  color: #5b5475;
  font-size: 12px;
  cursor: pointer;
}
.actions .ghost {
  flex: 1;
}
.actions .primary {
  flex: 1;
  border-color: transparent;
  color: white;
  background: #8b6df0;
  box-shadow: 0 12px 22px -16px #8b6df0;
}
.secondary-actions .danger {
  color: #d56f8e;
}
.empty-copy {
  display: grid;
  place-items: center;
  min-height: 280px;
  text-align: center;
  color: #8b84a3;
}
.avatar.ghost {
  margin-bottom: 10px;
  background: #ece7f7;
  color: #8b6df0;
}
.empty-copy h3 {
  margin: 0 0 8px;
  color: #3c3554;
}
.empty-copy p {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
}
:global(:root[data-theme='dark']) .detail-panel {
  border-color: var(--border-color);
  background: rgb(45 41 59 / 88%);
}
:global(:root[data-theme='dark']) .info-row strong,
:global(:root[data-theme='dark']) .detail-head h2,
:global(:root[data-theme='dark']) .empty-copy h3 {
  color: var(--text-primary);
}
:global(:root[data-theme='dark']) .desc {
  background: var(--bg-subtle);
  color: var(--text-secondary);
}
</style>
