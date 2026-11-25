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
          path: 'plans',
          name: 'plans',
          component: () => import('@/views/plans/PlansView.vue'),
          meta: { title: '计划中心', requiresAuth: true },
        },
        {
          path: 'todos',
          name: 'todos',
          component: () => import('@/views/todos/TodosView.vue'),
          meta: { title: '任务中心', requiresAuth: true },
        },
        {
          path: 'library',
          name: 'library',
          component: () => import('@/views/library/LibraryView.vue'),
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
