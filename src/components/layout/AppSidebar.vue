<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import {
  Activity,
  BookOpen,
  CalendarDays,
  CheckSquare2,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Settings2,
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const collapsed = ref(false)
const route = useRoute()
const router = useRouter()
const user = useUserStore()
const items = [
  { label: '工作台', hint: '今日概览', to: '/dashboard', icon: LayoutDashboard },
  { label: '计划中心', hint: '时间安排', to: '/plans', icon: CalendarDays },
  { label: '任务中心', hint: '下一步行动', to: '/todos', icon: CheckSquare2 },
  { label: '个人资料库', hint: '收藏与资料', to: '/library', icon: BookOpen },
]

async function signOut() {
  try {
    await user.signOut()
    await router.replace({ name: 'login' })
  } catch {
    ElMessage.error('服务器未确认退出，请检查网络后重试。')
    await router.replace({ name: 'login' })
  }
}
</script>

<template>
  <aside class="sidebar" :class="{ collapsed }">
    <div class="brand">
      <span class="brand-mark"><Activity :size="19" /></span>
      <span v-if="!collapsed" class="brand-copy"><b>MyHub</b><small>让日常慢慢归位</small></span>
    </div>
    <div v-if="!collapsed" class="section-label">我的空间</div>
    <nav class="nav-list" aria-label="主导航">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        :class="{ active: route.path === item.to }"
        :title="collapsed ? item.label : undefined"
      >
        <span class="nav-icon"><component :is="item.icon" :size="17" :stroke-width="1.8" /></span>
        <span v-if="!collapsed" class="nav-copy"
          ><b>{{ item.label }}</b
          ><small>{{ item.hint }}</small></span
        >
        <i v-if="!collapsed && route.path === item.to" class="active-mark"></i>
      </RouterLink>
    </nav>
    <section v-if="!collapsed" class="space-card">
      <span class="space-kicker">MY HUB</span>
      <strong>把重要的事放在眼前</strong>
      <p>计划、任务与资料，在这里慢慢整理。</p>
    </section>
    <div class="sidebar-bottom">
      <RouterLink
        to="/settings"
        class="nav-item"
        :class="{ active: route.path === '/settings' }"
        :title="collapsed ? '系统设置' : undefined"
      >
        <span class="nav-icon"><Settings2 :size="17" :stroke-width="1.8" /></span>
        <span v-if="!collapsed" class="nav-copy"><b>系统设置</b><small>偏好与外观</small></span>
      </RouterLink>
      <div v-if="!collapsed" class="account-card">
        <span class="account-avatar">{{
          (user.user?.nickname || user.user?.username || 'M').slice(0, 1)
        }}</span>
        <span class="account-copy"
          ><b>{{ user.user?.nickname || user.user?.username || 'MyHub 用户' }}</b
          ><small>{{ user.user?.username || '个人空间' }}</small></span
        >
        <button
          class="logout-button"
          type="button"
          aria-label="退出登录"
          title="退出登录"
          @click="signOut"
        >
          <LogOut :size="16" />
        </button>
      </div>
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
  position: relative;
  z-index: 1;
  width: var(--sidebar-width);
  flex: 0 0 var(--sidebar-width);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 24px 16px 14px;
  border-right: 1px solid rgb(236 231 247 / 60%);
  background: var(--bg-sidebar);
  backdrop-filter: blur(22px);
  transition:
    width 180ms ease,
    flex-basis 180ms ease;
}
.sidebar.collapsed {
  --sidebar-width: 72px;
  padding-inline: 10px;
}
.brand {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 8px;
  margin-bottom: 34px;
}
.brand-mark {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  border-radius: 16px;
  color: white;
  background: linear-gradient(135deg, #a88af5, #9b9ff3 58%, #8bd4db);
  box-shadow: 0 14px 26px -16px rgb(124 92 214 / 90%);
}
.brand-copy {
  display: grid;
  line-height: 1.2;
}
.brand-copy b {
  color: var(--text-primary);
  font-size: 17px;
  letter-spacing: -0.4px;
}
.brand-copy small {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 10px;
  letter-spacing: 0.04em;
}
.section-label {
  padding: 0 12px 10px;
  color: #b1aac6;
  font-size: 11px;
  letter-spacing: 0.16em;
}
.nav-list {
  display: grid;
  gap: 6px;
}
.nav-item {
  position: relative;
  min-height: 58px;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 7px 10px;
  border-radius: 16px;
  color: #726b8b;
  white-space: nowrap;
  transition:
    background 180ms ease,
    color 180ms ease,
    box-shadow 180ms ease;
}
.nav-item:hover {
  color: #403a58;
  background: rgb(255 255 255 / 58%);
}
.nav-item.active {
  color: var(--text-primary);
  background: rgb(255 255 255 / 90%);
  box-shadow:
    var(--shadow-float),
    0 0 0 1px #efe9fa;
}
.nav-icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  border-radius: 14px;
  color: #9a92b5;
  background: #f3effc;
  transition:
    background 180ms ease,
    color 180ms ease;
}
.nav-item:hover .nav-icon {
  color: #8b6df0;
  background: #eee8ff;
}
.nav-item.active .nav-icon {
  color: #8063dc;
  background: linear-gradient(135deg, #f0eaff, #eaf3ff);
}
.nav-copy {
  min-width: 0;
  display: grid;
  gap: 2px;
}
.nav-copy b {
  font-size: 13px;
  font-weight: 550;
}
.nav-copy small {
  color: #a49db9;
  font-size: 10px;
}
.active-mark {
  width: 6px;
  height: 6px;
  margin-left: auto;
  border-radius: 50%;
  background: #a78bfa;
}
.space-card {
  margin: 22px 2px 0;
  padding: 16px;
  border-radius: 22px;
  background: linear-gradient(140deg, #f6f0ff, #fff 55%, #eef6ff);
  box-shadow: 0 0 0 1px #f0eafb;
}
.space-kicker {
  color: #8b6df0;
  font-size: 8px;
  letter-spacing: 0.1em;
}
.space-card strong {
  display: block;
  margin-top: 9px;
  color: var(--text-primary);
  font-size: 13px;
}
.space-card p {
  margin: 5px 0 0;
  color: var(--text-secondary);
  font-size: 10px;
  line-height: 1.6;
}
.sidebar-bottom {
  display: grid;
  gap: 5px;
  margin-top: auto;
  padding-top: 20px;
}
.account-card {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 10px 2px 0;
  padding: 10px 9px;
  border: 1px solid #f0ebfa;
  border-radius: 17px;
  background: rgb(255 255 255 / 78%);
}
.account-avatar {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  color: #a66f59;
  background: linear-gradient(145deg, #fff0dc, #f8dce5);
  font-size: 13px;
  font-weight: 650;
}
.account-copy {
  min-width: 0;
  flex: 1;
  display: grid;
  gap: 2px;
}
.account-copy b,
.account-copy small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.account-copy b {
  color: var(--text-primary);
  font-size: 11px;
  font-weight: 600;
}
.account-copy small {
  color: var(--text-tertiary);
  font-size: 9px;
}
.logout-button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  border: 0;
  border-radius: 9px;
  color: #a49db9;
  background: transparent;
  cursor: pointer;
}
.logout-button:hover {
  color: #d56f8e;
  background: #fff0f4;
}
.collapse-button {
  min-height: 40px;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 10px;
  border: 0;
  border-radius: 13px;
  color: #a49db9;
  background: transparent;
  text-align: left;
  cursor: pointer;
}
.collapse-button:hover {
  color: var(--text-primary);
  background: rgb(255 255 255 / 58%);
}
:global(:root[data-theme='dark']) .nav-item.active {
  background: rgb(255 255 255 / 8%);
  box-shadow: 0 0 0 1px var(--app-border);
}
:global(:root[data-theme='dark']) .space-card {
  background: linear-gradient(140deg, #39334b, #302c40 55%, #2e3546);
  box-shadow: 0 0 0 1px var(--app-border);
}
@media (max-width: 700px) {
  .sidebar {
    width: 72px;
    flex-basis: 72px;
    padding-inline: 9px;
  }
  .brand {
    justify-content: center;
    padding: 0;
  }
  .brand-copy,
  .section-label,
  .nav-copy,
  .space-card,
  .account-card,
  .active-mark,
  .collapse-button span {
    display: none;
  }
  .nav-item,
  .collapse-button {
    justify-content: center;
    padding-inline: 0;
  }
  .nav-item {
    min-height: 48px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .sidebar,
  .nav-item,
  .nav-icon {
    transition: none;
  }
}
</style>
