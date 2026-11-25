<script setup lang="ts">
import { Settings2 } from 'lucide-vue-next'
import AppCard from '@/components/common/AppCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ThemeSwitch from '@/components/layout/ThemeSwitch.vue'
import { useThemeStore } from '@/stores/theme'
const theme = useThemeStore()
</script>

<template>
  <div class="page">
    <div class="intro">
      <div class="icon"><Settings2 :size="20" /></div>
      <div>
        <h1>系统设置</h1>
        <p>调整工作台外观与个人偏好。</p>
      </div>
    </div>
    <AppCard class="settings-card"
      ><div><strong>外观主题</strong><small>选择适合当前环境的显示方式</small></div>
      <div class="theme-control">
        <span>{{ theme.mode === 'light' ? '浅色' : '深色' }}</span><ThemeSwitch /></div></AppCard
    ><AppCard class="empty-card"
      ><EmptyState title="更多设置将在这里提供" description="个人偏好与系统选项会逐步加入。"
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
.settings-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  margin-bottom: 16px;
}
.settings-card strong,
.settings-card small {
  display: block;
}
.settings-card strong {
  font-weight: 550;
}
.settings-card small {
  margin-top: 4px;
  color: var(--text-secondary);
}
.theme-control {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--text-secondary);
  font-size: 12px;
}
.empty-card {
  padding: 4px 20px;
}
</style>
