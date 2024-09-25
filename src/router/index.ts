import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'

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
      component: defineAsyncComponent(() => import('@/views/SendFileView.vue'))
    }
  ]
})

// 预加载 SendFileView 组件
import('../views/SendFileView.vue')

export default router
