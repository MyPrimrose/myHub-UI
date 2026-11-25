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
  gap: 8px;
  color: var(--text-secondary);
  text-align: center;
}
.icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--bg-subtle);
  color: var(--primary-color);
}
strong {
  color: var(--text-primary);
  font-weight: 600;
}
p {
  margin: 0;
  font-size: 13px;
}
</style>
