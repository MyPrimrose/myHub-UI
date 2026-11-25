<script setup lang="ts">
import { watch } from 'vue'
import { RouterView } from 'vue-router'
import { useThemeStore } from '@/stores/theme'

const theme = useThemeStore()
watch(
  () => theme.mode,
  (mode) => {
    document.documentElement.dataset.theme = mode
    document.documentElement.classList.toggle('dark', mode === 'dark')
  },
  { immediate: true },
)
</script>

<template>
  <RouterView />
</template>
