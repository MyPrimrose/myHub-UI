<script setup lang="ts">
import { Inbox } from 'lucide-vue-next'
withDefaults(defineProps<{ title: string; description?: string }>(), {
  description: '准备好后，你的内容会显示在这里。',
})
</script>

<template>
  <div class="empty-state">
    <span class="icon"><Inbox :size="20" /></span><strong>{{ title }}</strong>
    <p>{{ description }}</p>
  </div>
</template>

<style scoped lang="scss">
.empty-state {
  min-height: 190px;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 10px;
  padding: 30px 18px;
  color: var(--text-secondary);
  text-align: center;
}
.icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 18px;
  background: linear-gradient(140deg, #f0eaff, #eaf3ff);
  color: #8b6df0;
  box-shadow: 0 8px 20px -14px rgb(124 92 214 / 55%);
}
strong {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
}
p {
  margin: 0;
  max-width: 360px;
  font-size: 12px;
  line-height: 1.7;
}
</style>
