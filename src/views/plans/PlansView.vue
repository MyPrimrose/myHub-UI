<script setup lang="ts">
import { CalendarDays } from 'lucide-vue-next'
import AppCard from '@/components/common/AppCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
</script>

<template>
  <div class="page">
    <div class="intro">
      <div class="icon"><CalendarDays :size="20" /></div>
      <div>
        <h1>计划中心</h1>
        <p>把重要的安排放进日历，为每件事留出合适的时间。</p>
      </div>
    </div>
    <AppCard
      ><EmptyState title="计划功能即将开放" description="你的日历和时间安排会集中展示在这里。"
    /></AppCard>
  </div>
</template>

<style scoped lang="scss">
.page {
  max-width: 1040px;
  margin: auto;
}
.intro {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}
.icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 11px;
  color: var(--primary-color);
  background: var(--primary-soft);
}
h1 {
  margin: 0;
  font-size: 23px;
}
p {
  margin: 5px 0 0;
  color: var(--text-secondary);
}
</style>
