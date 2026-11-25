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
  min-height: 100vh;
  display: flex;
  background: var(--bg-primary);
}
.main-column {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.main-content {
  width: 100%;
  max-width: 1500px;
  flex: 1;
  margin: 0 auto;
  padding: 30px 34px 48px;
}
@media (max-width: 700px) {
  .main-content {
    padding: 22px 18px 36px;
  }
}
</style>
