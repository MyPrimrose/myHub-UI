<script setup lang="ts">
import { ChevronLeft, ChevronRight, Plus } from 'lucide-vue-next'

defineProps<{
  monthLabel: string
  isCurrentMonth: boolean
}>()

const emit = defineEmits<{
  prev: []
  next: []
  today: []
  create: []
}>()
</script>

<template>
  <div class="toolbar">
    <div class="intro">
      <h1>本月排期表</h1>
      <p>按天横向铺开，跨天的计划也能一眼看清。</p>
    </div>
    <div class="actions">
      <div class="month-nav">
        <button type="button" class="icon-btn" aria-label="上个月" @click="emit('prev')">
          <ChevronLeft :size="16" />
        </button>
        <strong>{{ monthLabel }}</strong>
        <button type="button" class="icon-btn" aria-label="下个月" @click="emit('next')">
          <ChevronRight :size="16" />
        </button>
      </div>
      <button
        type="button"
        class="ghost-btn"
        :disabled="isCurrentMonth"
        @click="emit('today')"
      >
        回到本月
      </button>
      <button type="button" class="primary-btn" @click="emit('create')">
        <Plus :size="16" />
        新增计划
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}
.intro h1 {
  margin: 0;
  color: #2f2a45;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.04em;
}
.intro p {
  margin: 8px 0 0;
  color: #8b84a3;
  font-size: 13px;
}
.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.month-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 14px;
  background: #f4f1fb;
}
.month-nav strong {
  min-width: 118px;
  text-align: center;
  color: #3c3554;
  font-size: 13px;
  font-weight: 650;
}
.icon-btn,
.ghost-btn,
.primary-btn {
  border: 0;
  cursor: pointer;
}
.icon-btn {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 11px;
  color: #7d7696;
  background: transparent;
}
.icon-btn:hover {
  background: white;
  color: #5b4f8a;
}
.ghost-btn {
  height: 38px;
  padding: 0 14px;
  border: 1px solid #ebe6f6;
  border-radius: 12px;
  color: #6f678b;
  background: white;
  font-size: 13px;
}
.ghost-btn:disabled {
  opacity: 0.45;
  cursor: default;
}
.primary-btn {
  height: 38px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 16px;
  border-radius: 12px;
  color: white;
  background: #8b6df0;
  box-shadow: 0 12px 24px -16px #8b6df0;
  font-size: 13px;
  font-weight: 650;
}
:global(:root[data-theme='dark']) .intro h1 {
  color: var(--text-primary);
}
:global(:root[data-theme='dark']) .month-nav {
  background: var(--bg-subtle);
}
:global(:root[data-theme='dark']) .ghost-btn {
  border-color: var(--border-color);
  background: var(--bg-card);
  color: var(--text-secondary);
}
@media (max-width: 820px) {
  .toolbar {
    flex-direction: column;
  }
  .actions {
    width: 100%;
  }
}
</style>
