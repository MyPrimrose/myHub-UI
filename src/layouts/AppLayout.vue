<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const route = useRoute()
const wideContent = computed(
  () => route.path.startsWith('/schedule') || route.path.startsWith('/library'),
)
</script>

<template>
  <div class="app-layout">
    <AppSidebar />
    <div class="main-column">
      <AppHeader />
      <main class="main-content" :class="{ wide: wideContent }"><RouterView /></main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-layout {
  height: 100vh;
  height: 100dvh;
  min-height: 100vh;
  min-height: 0;
  display: flex;
  overflow: hidden;
  background: var(--canvas-background);
}
.main-column {
  min-width: 0;
  min-height: 0;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.main-content {
  width: 100%;
  max-width: 1400px;
  min-height: 0;
  flex: 1;
  margin: 0 auto;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  scrollbar-gutter: stable;
  padding: 24px 34px 48px;
}
.main-content.wide {
  max-width: none;
}
@media (max-width: 700px) {
  .main-content {
    padding: 22px 18px 36px;
  }
}
</style>
