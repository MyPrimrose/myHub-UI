<script setup lang="ts">
import { Search, UserRound } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ThemeSwitch from './ThemeSwitch.vue'

const route = useRoute()
const title = computed(() => String(route.meta.title || '工作台'))
</script>

<template>
  <header class="header">
    <div class="page-title">{{ title }}</div>
    <div class="actions">
      <button class="search-button" type="button" aria-label="全局搜索">
        <Search :size="16" /><span>搜索</span><kbd>⌘ K</kbd>
      </button>
      <ThemeSwitch /><button class="avatar" type="button" aria-label="用户菜单">
        <UserRound :size="17" />
      </button>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  height: var(--header-height);
  display: flex;
  flex: 0 0 var(--header-height);
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  background: var(--bg-sidebar);
  border-bottom: 1px solid var(--border-color);
}
.page-title {
  font-size: 14px;
  font-weight: 600;
}
.actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.search-button {
  height: 34px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 9px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  background: var(--bg-primary);
  cursor: pointer;
}
kbd {
  margin-left: 8px;
  padding: 1px 5px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 10px;
}
.avatar {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  color: var(--text-secondary);
  background: var(--bg-card);
}
@media (max-width: 520px) {
  .header {
    padding-inline: 14px;
  }
  .search-button span,
  .search-button kbd {
    display: none;
  }
}
</style>
