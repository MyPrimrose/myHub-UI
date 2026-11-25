<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  Activity,
  BookOpen,
  CalendarDays,
  CheckSquare2,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Settings2,
} from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const collapsed = ref(false)
const route = useRoute()
const items = [
  { label: '工作台', to: '/dashboard', icon: LayoutDashboard },
  { label: '计划中心', to: '/plans', icon: CalendarDays },
  { label: '任务中心', to: '/todos', icon: CheckSquare2 },
  { label: '个人资料库', to: '/library', icon: BookOpen },
]
</script>

<template>
  <aside class="sidebar" :class="{ collapsed }">
    <div class="brand">
      <span class="brand-mark"><Activity :size="18" /></span
      ><span v-if="!collapsed" class="brand-name">myhub</span>
    </div>
    <div v-if="!collapsed" class="section-label">工作空间</div>
    <nav class="nav-list" aria-label="主导航">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        :class="{ active: route.path === item.to }"
        :title="collapsed ? item.label : undefined"
      >
        <component :is="item.icon" :size="18" :stroke-width="1.8" /><span v-if="!collapsed">{{
          item.label
        }}</span>
      </RouterLink>
    </nav>
    <div class="sidebar-bottom">
      <RouterLink
        to="/settings"
        class="nav-item"
        :class="{ active: route.path === '/settings' }"
        :title="collapsed ? '系统设置' : undefined"
      >
        <Settings2 :size="18" :stroke-width="1.8" /><span v-if="!collapsed">系统设置</span>
      </RouterLink>
      <button
        class="collapse-button"
        type="button"
        :aria-label="collapsed ? '展开侧边栏' : '折叠侧边栏'"
        @click="collapsed = !collapsed"
      >
        <ChevronRight v-if="collapsed" :size="17" /><template v-else
          ><ChevronLeft :size="17" /><span>收起侧边栏</span></template
        >
      </button>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.sidebar {
  width: var(--sidebar-width);
  flex: 0 0 var(--sidebar-width);
  display: flex;
  flex-direction: column;
  padding: 20px 12px 12px;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  transition:
    width 180ms ease,
    flex-basis 180ms ease,
    background 160ms ease;
}
.sidebar.collapsed {
  --sidebar-width: 68px;
  padding-inline: 10px;
}
.brand {
  height: 36px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  margin-bottom: 36px;
}
.brand-mark {
  display: grid;
  place-items: center;
  width: 27px;
  height: 27px;
  border-radius: 8px;
  color: white;
  background: var(--primary-color);
}
.brand-name {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.7px;
}
.section-label {
  padding: 0 10px 10px;
  color: var(--text-tertiary);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.nav-list {
  display: grid;
  gap: 4px;
}
.nav-item {
  min-height: 40px;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 10px;
  border-radius: 8px;
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
}
.nav-item:hover {
  color: var(--text-primary);
  background: var(--bg-subtle);
}
.nav-item.active {
  color: var(--primary-color);
  background: var(--primary-soft);
}
.sidebar-bottom {
  display: grid;
  gap: 5px;
  margin-top: auto;
}
.collapse-button {
  min-height: 38px;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 10px;
  border: 0;
  border-radius: 8px;
  color: var(--text-tertiary);
  background: transparent;
  text-align: left;
  cursor: pointer;
}
.collapse-button:hover {
  color: var(--text-primary);
  background: var(--bg-subtle);
}
@media (max-width: 700px) {
  .sidebar {
    width: 58px;
    flex-basis: 58px;
    padding-inline: 7px;
  }
  .brand {
    justify-content: center;
    padding: 0;
  }
  .brand-name,
  .section-label,
  .nav-item span,
  .collapse-button span {
    display: none;
  }
  .nav-item,
  .collapse-button {
    justify-content: center;
    padding-inline: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .sidebar {
    transition: none;
  }
}
</style>
