<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'
const theme = useThemeStore()
</script>

<template>
  <button
    class="icon-button"
    type="button"
    :aria-label="theme.mode === 'light' ? '切换深色主题' : '切换浅色主题'"
    @click="theme.toggleTheme()"
  >
    <Moon v-if="theme.mode === 'light'" :size="18" /><Sun v-else :size="18" />
  </button>
</template>

<style scoped lang="scss">
.icon-button {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
}
.icon-button:hover {
  background: var(--bg-subtle);
  color: var(--text-primary);
}
</style>
