<script setup lang="ts">
import { BookOpen } from 'lucide-vue-next'
import AppCard from '@/components/common/AppCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
</script>

<template>
  <div class="page">
    <div class="intro">
      <div class="icon"><BookOpen :size="20" /></div>
      <div>
        <h1>个人资料库</h1>
        <p>收藏常用资料与页面，让需要的内容更容易找回来。</p>
      </div>
    </div>
    <AppCard
      ><EmptyState title="资料库还没有内容" description="你收藏的页面和整理的资料会显示在这里。"
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
