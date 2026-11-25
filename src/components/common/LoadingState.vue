<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next'
withDefaults(defineProps<{ label?: string }>(), { label: '正在加载' })
</script>

<template>
  <div class="loading-state" role="status"><LoaderCircle :size="18" class="spin" />{{ label }}</div>
</template>

<style scoped lang="scss">
.loading-state {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  color: var(--text-secondary);
}
.spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .spin {
    animation: none;
  }
}
</style>
