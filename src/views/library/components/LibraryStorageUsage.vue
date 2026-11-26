<script setup lang="ts">
import type { LibraryStatistics } from '../types/library'
import { formatBytes } from '../composables/useLibrary'

defineProps<{
  statistics: LibraryStatistics | null
}>()
</script>

<template>
  <div class="storage">
    <div class="copy">
      <strong>已使用 {{ formatBytes(statistics?.usedBytes) }}</strong>
      <span>/ {{ Math.round(statistics?.usedPercent || 0) }}% 存储</span>
    </div>
    <div class="track">
      <i :style="{ width: `${Math.min(100, statistics?.usedPercent || 0)}%` }"></i>
    </div>
  </div>
</template>

<style scoped lang="scss">
.storage {
  min-width: 180px;
}
.copy {
  display: flex;
  gap: 6px;
  align-items: baseline;
  justify-content: flex-end;
  margin-bottom: 6px;
  color: #8b84a3;
  font-size: 12px;
}
.copy strong {
  color: #3c3554;
  font-size: 13px;
}
.track {
  height: 6px;
  border-radius: 999px;
  background: #efeaf8;
  overflow: hidden;
}
.track i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #b39bff, #8b6df0);
}
:global(:root[data-theme='dark']) .copy strong {
  color: var(--text-primary);
}
:global(:root[data-theme='dark']) .track {
  background: var(--bg-subtle);
}
</style>
