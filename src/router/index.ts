import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      redirect: '/all-projects/project-declaration',
      children: [
        // 全部项目 - 项目申报
        {
          path: '/all-projects/project-declaration',
          name: 'project-declaration',
          component: () => import('@/views/all-projects/project-declaration/Index.vue')
        },
        {
          path: '/all-projects/project-declaration/approval',
          name: 'project-approval',
          component: () => import('@/views/all-projects/project-declaration/Index.vue')
        },
        {
          path: '/all-projects/project-declaration/transfer',
          name: 'project-transfer',
          component: () => import('@/views/all-projects/project-declaration/Index.vue')
        },
        {
          path: '/all-projects/project-declaration/returned',
          name: 'project-returned',
          component: () => import('@/views/all-projects/project-declaration/Index.vue')
        },
        {
          path: '/all-projects/project-declaration/abnormal',
          name: 'project-abnormal',
          component: () => import('@/views/all-projects/project-declaration/Index.vue')
        },
        // 全部项目 - 进度报送
        {
          path: '/all-projects/progress-report',
          name: 'progress-report',
          component: () => import('@/views/all-projects/progress-report/Index.vue')
        },
        {
          path: '/all-projects/progress-report/audit',
          name: 'progress-audit',
          component: () => import('@/views/all-projects/progress-report/Index.vue')
        },
        {
          path: '/all-projects/progress-report/query',
          name: 'progress-query',
          component: () => import('@/views/all-projects/progress-report/Index.vue')
        },
        {
          path: '/all-projects/progress-report/warning',
          name: 'progress-warning',
          component: () => import('@/views/all-projects/progress-report/Index.vue')
        },
        {
          path: '/all-projects/progress-report/statistics',
          name: 'progress-statistics',
          component: () => import('@/views/all-projects/progress-report/Index.vue')
        },
        // 全部项目 - 项目浏览
        {
          path: '/all-projects/project-browse',
          name: 'project-browse',
          component: () => import('@/views/all-projects/project-browse/Index.vue')
        },
        {
          path: '/all-projects/project-browse/level',
          name: 'project-browse-level',
          component: () => import('@/views/all-projects/project-browse/Index.vue')
        },
        {
          path: '/all-projects/project-browse/district',
          name: 'project-browse-district',
          component: () => import('@/views/all-projects/project-browse/Index.vue')
        },
        {
          path: '/all-projects/project-browse/history',
          name: 'project-browse-history',
          component: () => import('@/views/all-projects/project-browse/Index.vue')
        },
        // 全部项目 - 项目统计
        {
          path: '/all-projects/statistics',
          name: 'project-statistics',
          component: () => import('@/views/all-projects/project-browse/Index.vue')
        },
        // 全部项目 - 问题协调
        {
          path: '/all-projects/coordination',
          name: 'project-coordination',
          component: () => import('@/views/all-projects/project-browse/Index.vue')
        },
        // 策划储备项目
        {
          path: '/planning-reserve/preparation',
          name: 'planning-preparation',
          component: () => import('@/views/planning-reserve/Preparation.vue')
        },
        // 地理信息
        {
          path: '/geographic-info/map',
          name: 'geographic-map',
          component: () => import('@/views/geographic-info/ProjectMap.vue')
        },
        // 短信管理
        {
          path: '/sms-management/settings',
          name: 'sms-settings',
          component: () => import('@/views/sms-management/Settings.vue')
        }
      ]
    }
  ]
})

export default router
