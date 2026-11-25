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
  padding: 14px 34px 0;
  background: transparent;
  border-bottom: 0;
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
  border: 1px solid rgb(255 255 255 / 90%);
  border-radius: 12px;
  color: var(--text-secondary);
  background: rgb(255 255 255 / 64%);
  box-shadow: 0 4px 18px -14px rgb(107 78 200 / 45%);
  backdrop-filter: blur(12px);
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
  border: 1px solid #f0ebfa;
  border-radius: 14px;
  color: #a27854;
  background: linear-gradient(145deg, #fff1dc, #f9dce3);
  box-shadow: 0 5px 16px -12px rgb(107 78 200 / 55%);
}
@media (max-width: 520px) {
  .header {
    padding-inline: 16px;
  }
  .search-button span,
  .search-button kbd {
    display: none;
  }
}
</style>
