<script setup lang="ts">
import { CheckSquare2 } from 'lucide-vue-next'
import AppCard from '@/components/common/AppCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
</script>

<template>
  <div class="page">
    <div class="intro">
      <div class="icon"><CheckSquare2 :size="20" /></div>
      <div>
        <h1>任务中心</h1>
        <p>收集想法、跟进待办，把注意力放在下一件要完成的事上。</p>
      </div>
    </div>
    <AppCard
      ><EmptyState title="任务列表还空着" description="待办任务、收集箱和截止日期会在这里管理。"
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
