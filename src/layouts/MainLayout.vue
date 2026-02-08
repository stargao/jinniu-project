<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Layout, LayoutHeader, LayoutContent, LayoutSider, Menu, Dropdown, Avatar, Badge, Tabs, Button } from 'ant-design-vue'
import { MenuFoldOutlined, MenuUnfoldOutlined, DownOutlined, BellOutlined, UserOutlined, CloseOutlined } from '@ant-design/icons-vue'
import SidebarMenu from '@/components/common/SidebarMenu.vue'
import type { TabItem } from '@/types/layout'

const route = useRoute()
const router = useRouter()

// 侧边栏折叠状态
const collapsed = ref(false)

// 标签页列表
const tabs = ref<TabItem[]>([
  { key: '/all-projects/project-declaration', title: '项目申报', closable: false }
])

// 当前激活的标签
const activeTabKey = ref('/all-projects/project-declaration')

// 监听路由变化，自动添加标签
watch(() => route.path, (newPath) => {
  if (newPath === '/') return
  
  const existingTab = tabs.value.find(tab => tab.key === newPath)
  if (!existingTab) {
    const title = getRouteTitle(newPath)
    tabs.value.push({ key: newPath, title, closable: true })
  }
  activeTabKey.value = newPath
}, { immediate: true })

// 获取路由标题
const getRouteTitle = (path: string): string => {
  const titleMap: Record<string, string> = {
    '/all-projects/project-declaration': '项目申报',
    '/all-projects/project-declaration/approval': '项目审批',
    '/all-projects/project-declaration/transfer': '转报及导入项目',
    '/all-projects/project-declaration/returned': '退回项目',
    '/all-projects/project-declaration/abnormal': '异常项目查找',
    '/all-projects/progress-report': '进度报送',
    '/all-projects/progress-report/audit': '进度审核',
    '/all-projects/progress-report/query': '进度查询',
    '/all-projects/progress-report/warning': '进度预警',
    '/all-projects/progress-report/statistics': '报送统计',
    '/all-projects/project-browse': '项目浏览',
    '/all-projects/project-browse/level': '本级项目',
    '/all-projects/project-browse/district': '区本级项目',
    '/all-projects/project-browse/history': '项目更新记录',
    '/all-projects/statistics': '项目统计',
    '/all-projects/coordination': '问题协调',
    '/planning-reserve/preparation': '预备项目',
    '/geographic-info/map': '项目地图',
    '/sms-management/settings': '短信设置'
  }
  return titleMap[path] || '未命名页面'
}

// 切换标签
const handleTabChange = (key: string) => {
  router.push(key)
}

// 关闭标签
const handleTabClose = (targetKey: string) => {
  const targetIndex = tabs.value.findIndex(tab => tab.key === targetKey)
  if (targetIndex === -1) return
  
  const newTabs = tabs.value.filter(tab => tab.key !== targetKey)
  tabs.value = newTabs
  
  // 如果关闭的是当前标签，切换到前一个标签
  if (activeTabKey.value === targetKey && newTabs.length > 0) {
    const newActiveKey = newTabs[Math.max(0, targetIndex - 1)].key
    router.push(newActiveKey)
  }
}

// 关闭所有标签
const handleCloseAllTabs = () => {
  const homeTab = tabs.value.find(tab => !tab.closable)
  if (homeTab) {
    tabs.value = [homeTab]
    router.push(homeTab.key)
  }
}

// 切换侧边栏
const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}

// 用户菜单项
const userMenuItems = [
  { key: 'profile', label: '个人中心' },
  { key: 'settings', label: '系统设置' },
  { key: 'logout', label: '退出登录' }
]

const handleUserMenuClick = ({ key }: { key: string }) => {
  if (key === 'logout') {
    router.push('/login')
  }
}
</script>

<template>
  <Layout class="main-layout">
    <!-- 顶部 Header -->
    <LayoutHeader class="header">
      <div class="header-left">
        <div class="logo">
          <span class="logo-text">金牛区项目管理信息系统</span>
        </div>
      </div>
      <div class="header-right">
        <Badge :count="5" class="notification-badge">
          <BellOutlined class="notification-icon" />
        </Badge>
        <Dropdown :menu="{ items: userMenuItems, onClick: handleUserMenuClick }">
          <div class="user-info">
            <Avatar :icon="UserOutlined" />
            <span class="username">欢迎您, 项目推进办</span>
            <DownOutlined class="dropdown-icon" />
          </div>
        </Dropdown>
      </div>
    </LayoutHeader>

    <Layout class="main-container">
      <!-- 左侧 Sidebar -->
      <LayoutSider
        v-model:collapsed="collapsed"
        :trigger="null"
        collapsible
        class="sidebar"
        :width="220"
      >
        <div class="sidebar-trigger" @click="toggleCollapsed">
          <MenuFoldOutlined v-if="!collapsed" />
          <MenuUnfoldOutlined v-else />
        </div>
        <SidebarMenu :collapsed="collapsed" />
      </LayoutSider>

      <!-- 主内容区 -->
      <LayoutContent class="content">
        <!-- 标签页导航 -->
        <div class="tabs-container">
          <Tabs
            v-model:activeKey="activeTabKey"
            type="editable-card"
            hide-add
            @change="handleTabChange"
            @edit="handleTabClose"
            class="main-tabs"
          >
            <TabPane
              v-for="tab in tabs"
              :key="tab.key"
              :tab="tab.title"
              :closable="tab.closable"
            />
          </Tabs>
          <Button
            v-if="tabs.length > 1"
            type="link"
            size="small"
            class="close-all-btn"
            @click="handleCloseAllTabs"
          >
            <CloseOutlined />关闭全部
          </Button>
        </div>

        <!-- 页面内容 -->
        <div class="page-content">
          <RouterView v-slot="{ Component }">
            <KeepAlive>
              <component :is="Component" />
            </KeepAlive>
          </RouterView>
        </div>
      </LayoutContent>
    </Layout>
  </Layout>
</template>

<style scoped>
.main-layout {
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background: #001529;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 64px;
  line-height: 64px;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo-text {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.notification-icon {
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  cursor: pointer;
  padding: 0 8px;
}

.username {
  font-size: 14px;
}

.dropdown-icon {
  font-size: 12px;
}

.main-container {
  margin-top: 64px;
  min-height: calc(100vh - 64px);
}

.sidebar {
  background: #001529;
  position: fixed;
  left: 0;
  top: 64px;
  bottom: 0;
  z-index: 999;
}

.sidebar-trigger {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #002140;
  cursor: pointer;
  transition: all 0.3s;
}

.sidebar-trigger:hover {
  background: #1890ff;
}

.content {
  margin-left: 220px;
  background: #f0f2f5;
  min-height: calc(100vh - 64px);
  transition: margin-left 0.2s;
}

:deep(.ant-layout-sider-collapsed) + .content {
  margin-left: 80px;
}

.tabs-container {
  background: #fff;
  padding: 8px 16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
}

.main-tabs {
  flex: 1;
}

.main-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 0;
}

.close-all-btn {
  margin-left: 16px;
  color: #999;
}

.close-all-btn:hover {
  color: #ff4d4f;
}

.page-content {
  padding: 16px;
  min-height: calc(100vh - 64px - 56px);
}
</style>
