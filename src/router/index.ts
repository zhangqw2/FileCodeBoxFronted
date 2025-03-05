/*
 * @author: zhangquanwei
 * @Date: 2025-02-17 09:43:26
 */
import { createRouter, createWebHashHistory } from 'vue-router'

// 预加载 SendFileView 组件
const SendFileView = () => import('../views/SendFileView.vue')
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Retrieve',
      component: () => import('@/views/RetrievewFileView.vue')
    },
    {
      path: '/send',
      name: 'Send',
      component: SendFileView
    },
    {
      path: '/approve',
      name: 'Approve',
      component: () => import('@/views/approval/ApprovalFlowView.vue')
    },
    {
      path: '/flowchart',
      name: 'FlowChart',
      component: () => import('@/views/approval/Flowchart.vue')
    },
    {
      path: '/admin',
      name: 'Manage',
      component: () => import('@/layout/AdminLayout/AdminLayout.vue'),
      redirect: '/admin/dashboard',
      children: [
        {
          path: '/admin/dashboard',
          name: 'Dashboard',
          component: () => import('@/views/manage/DashboardView.vue')
        },
        {
          path: '/admin/files',
          name: 'FileManage',
          component: () => import('@/views/manage/FileManageView.vue')
        },
        {
          path: '/admin/settings',
          name: 'Settings',
          component: () => import('@/views/manage/SystemSettingsView.vue')
        },
        {
          path: '/admin/local',
          name: 'Locals',
          component: () => import('@/views/manage/LocalView.vue'),
        },
        {
          path: '/admin/users',
          name: 'Users',
          component: () => import('@/views/manage/UserView.vue')
        },
        {
          path: '/admin/logs',
          name: 'Logs',
          component: () => import('@/views/manage/UserLogView.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/manage/LoginView.vue')
    }
  ]
})


export default router
