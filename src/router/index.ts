import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import { useUserStore } from '@/stores/user'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue'),
          meta: { title: '工作台', requiresAuth: true },
        },
        {
          path: 'schedule',
          name: 'schedule',
          component: () => import('@/views/schedule/index.vue'),
          meta: { title: '排期表', requiresAuth: true },
        },
        {
          path: 'plans',
          name: 'plans',
          redirect: '/schedule',
        },
        {
          path: 'todos',
          name: 'todos',
          redirect: '/schedule',
        },
        {
          path: 'library',
          name: 'library',
          component: () => import('@/views/library/index.vue'),
          meta: { title: '个人资料库', requiresAuth: true },
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/settings/SettingsView.vue'),
          meta: { title: '系统设置', requiresAuth: true },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/LoginView.vue'),
      meta: { title: '登录' },
    },
    { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
  ],
})

router.beforeEach(async (to) => {
  const store = useUserStore()
  await store.initialize()
  if (to.meta.requiresAuth && !store.user) return { name: 'login', query: { redirect: to.fullPath } }
  if (to.name === 'login' && store.user) return { name: 'dashboard' }
})
