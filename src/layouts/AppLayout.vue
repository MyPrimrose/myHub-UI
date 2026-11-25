<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>

<template>
  <div class="app-layout">
    <AppSidebar />
    <div class="main-column">
      <AppHeader />
      <main class="main-content"><RouterView /></main>
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
@media (max-width: 700px) {
  .main-content {
    padding: 22px 18px 36px;
  }
}
</style>
