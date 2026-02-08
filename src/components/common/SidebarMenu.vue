<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, SubMenu, MenuItem } from 'ant-design-vue'
import {
  ProjectOutlined,
  DatabaseOutlined,
  GlobalOutlined,
  MessageOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SolutionOutlined,
  EyeOutlined,
  SettingOutlined
} from '@ant-design/icons-vue'

interface Props {
  collapsed?: boolean
}

const props = defineProps<Props>()
const route = useRoute()
const router = useRouter()

// 当前选中的菜单
const selectedKeys = computed(() => [route.path])
const openKeys = computed(() => {
  // 根据当前路由计算需要展开的子菜单
  const path = route.path
  if (path.startsWith('/all-projects')) return ['all-projects']
  if (path.startsWith('/planning-reserve')) return ['planning-reserve']
  if (path.startsWith('/geographic-info')) return ['geographic-info']
  if (path.startsWith('/sms-management')) return ['sms-management']
  return []
})

// 菜单点击处理
const handleMenuClick = ({ key }: { key: string }) => {
  router.push(key)
}

// 菜单配置
const menuConfig = [
  {
    key: 'all-projects',
    icon: ProjectOutlined,
    label: '全部项目',
    children: [
      {
        key: '/all-projects/project-declaration',
        icon: FileTextOutlined,
        label: '项目申报',
        children: [
          { key: '/all-projects/project-declaration', label: '项目申报' },
          { key: '/all-projects/project-declaration/approval', label: '项目审批' },
          { key: '/all-projects/project-declaration/transfer', label: '转报及导入项目' },
          { key: '/all-projects/project-declaration/returned', label: '退回项目' },
          { key: '/all-projects/project-declaration/abnormal', label: '异常项目查找' }
        ]
      },
      {
        key: '/all-projects/progress-report',
        icon: BarChartOutlined,
        label: '进度报送',
        children: [
          { key: '/all-projects/progress-report', label: '进度报送' },
          { key: '/all-projects/progress-report/audit', label: '进度审核' },
          { key: '/all-projects/progress-report/query', label: '进度查询' },
          { key: '/all-projects/progress-report/warning', label: '进度预警' },
          { key: '/all-projects/progress-report/statistics', label: '报送统计' }
        ]
      },
      {
        key: '/all-projects/project-browse',
        icon: EyeOutlined,
        label: '项目浏览',
        children: [
          { key: '/all-projects/project-browse', label: '项目浏览' },
          { key: '/all-projects/project-browse/level', label: '本级项目' },
          { key: '/all-projects/project-browse/district', label: '区本级项目' },
          { key: '/all-projects/project-browse/history', label: '项目更新记录' }
        ]
      },
      {
        key: '/all-projects/statistics',
        icon: BarChartOutlined,
        label: '项目统计'
      },
      {
        key: '/all-projects/coordination',
        icon: SolutionOutlined,
        label: '问题协调'
      }
    ]
  },
  {
    key: 'planning-reserve',
    icon: DatabaseOutlined,
    label: '策划储备项目',
    children: [
      {
        key: '/planning-reserve/preparation',
        icon: FileTextOutlined,
        label: '预备项目'
      }
    ]
  },
  {
    key: 'geographic-info',
    icon: GlobalOutlined,
    label: '地理信息',
    children: [
      {
        key: '/geographic-info/map',
        icon: GlobalOutlined,
        label: '项目地图'
      }
    ]
  },
  {
    key: 'sms-management',
    icon: MessageOutlined,
    label: '短信管理',
    children: [
      {
        key: '/sms-management/settings',
        icon: SettingOutlined,
        label: '短信设置'
      }
    ]
  }
]
</script>

<template>
  <Menu
    theme="dark"
    mode="inline"
    :selected-keys="selectedKeys"
    :open-keys="openKeys"
    :inline-collapsed="collapsed"
    @click="handleMenuClick"
    class="sidebar-menu"
  >
    <SubMenu v-for="item in menuConfig" :key="item.key">
      <template #icon>
        <component :is="item.icon" />
      </template>
      <template #title>{{ item.label }}</template>
      
      <template v-for="child in item.children">
        <SubMenu v-if="child.children" :key="child.key">
          <template #icon>
            <component :is="child.icon" v-if="child.icon" />
          </template>
          <template #title>{{ child.label }}</template>
          
          <MenuItem v-for="subChild in child.children" :key="subChild.key">
            {{ subChild.label }}
          </MenuItem>
        </SubMenu>
        
        <MenuItem v-else :key="child.key">
          <template #icon>
            <component :is="child.icon" v-if="child.icon" />
          </template>
          {{ child.label }}
        </MenuItem>
      </template>
    </SubMenu>
  </Menu>
</template>

<style scoped>
.sidebar-menu {
  height: calc(100% - 40px);
  overflow-y: auto;
  overflow-x: hidden;
  border-right: 0;
}

.sidebar-menu :deep(.ant-menu-submenu-title) {
  display: flex;
  align-items: center;
}

.sidebar-menu :deep(.ant-menu-item) {
  display: flex;
  align-items: center;
}

/* 滚动条样式 */
.sidebar-menu::-webkit-scrollbar {
  width: 4px;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.sidebar-menu::-webkit-scrollbar-track {
  background: transparent;
}
</style>
