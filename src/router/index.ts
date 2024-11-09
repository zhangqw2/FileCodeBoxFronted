import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Retrieve',
      component: () => import('@/views/RetrievewFileView.vue')
    },
    {
      path: '/send',
      name: 'Send',
      component: () => import('@/views/SendFileView.vue')
    },
    {
      path: '/manage',
      name: 'Manage',
      component: () => import('@/views/ManageView.vue')
    }
  ]
})

// 预加载 SendFileView 组件
import('../views/SendFileView.vue')

export default router
