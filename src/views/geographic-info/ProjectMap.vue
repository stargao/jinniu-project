<script setup lang="ts">
import { ref } from 'vue'
import {
  Card,
  Button,
  Space,
  Drawer,
  Descriptions,
  DescriptionsItem,
  Tag,
  message
} from 'ant-design-vue'
import {
  EnvironmentOutlined,
  PlusOutlined,
  EyeOutlined
} from '@ant-design/icons-vue'
import QueryBuilder, { type QueryField, type QueryObject } from '@/components/common/QueryBuilder.vue'

// 项目标记点数据
const projectMarkers = ref([
  { id: '1', name: '金牛区智慧城市建设项目', lng: 104.05, lat: 30.68, status: '进行中', investment: 5000 },
  { id: '2', name: '金牛大道改造工程', lng: 104.06, lat: 30.69, status: '进行中', investment: 8000 },
  { id: '3', name: '未来社区建设项目', lng: 104.04, lat: 30.67, status: '规划中', investment: 3000 }
])

// QueryBuilder 字段配置
const queryFields: QueryField[] = [
  {
    key: 'projectName',
    label: '项目名称',
    type: 'string'
  },
  {
    key: 'district',
    label: '所属街道',
    type: 'select',
    options: [
      { label: '茶店子街道', value: 'chadianzi' },
      { label: '抚琴街道', value: 'fuqin' },
      { label: '驷马桥街道', value: 'simaqiao' }
    ]
  },
  {
    key: 'status',
    label: '项目状态',
    type: 'select',
    options: [
      { label: '规划中', value: 'planning' },
      { label: '进行中', value: 'ongoing' },
      { label: '已完成', value: 'completed' }
    ]
  },
  {
    key: 'investment',
    label: '投资额(万元)',
    type: 'number'
  }
]

// 抽屉控制
const drawerVisible = ref(false)
const selectedProject = ref<any>(null)

// QueryBuilder 查询回调
const handleQueryBuilderSearch = (queryObject: QueryObject) => {
  console.log('查询条件:', queryObject)
  message.success(`执行查询：${queryObject.conditions.length}个条件`)
  // TODO: 调用 API 进行查询
}

// QueryBuilder 重置回调
const handleQueryBuilderReset = () => {
  console.log('重置查询条件')
  message.info('已重置查询条件')
}

// 添加项目标记
const handleAddMarker = () => {
  console.log('添加项目标记')
}

// 查看项目详情
const handleViewProject = (project: any) => {
  selectedProject.value = project
  drawerVisible.value = true
}
</script>

<template>
  <div class="project-map">
    <Card title="项目地图" class="page-card">
      <!-- 通用查询组件 -->
      <QueryBuilder
        :fields="queryFields"
        @search="handleQueryBuilderSearch"
        @reset="handleQueryBuilderReset"
      />

      <!-- 操作按钮 -->
      <div class="map-operations">
        <Button type="primary" @click="handleAddMarker">
          <PlusOutlined />添加标记
        </Button>
      </div>

      <!-- 地图区域 -->
      <div class="map-container">
        <div class="map-placeholder">
          <EnvironmentOutlined class="map-icon" />
          <p>地图加载区域</p>
          <p class="map-hint">这里将集成地图组件（如高德地图、百度地图）</p>
          
          <!-- 模拟项目标记列表 -->
          <div class="project-list">
            <h4>项目列表</h4>
            <div
              v-for="project in projectMarkers"
              :key="project.id"
              class="project-item"
              @click="handleViewProject(project)"
            >
              <EnvironmentOutlined class="project-icon" />
              <div class="project-info">
                <div class="project-name">{{ project.name }}</div>
                <div class="project-meta">
                  <Tag size="small">{{ project.status }}</Tag>
                  <span class="investment">{{ project.investment }}万元</span>
                </div>
              </div>
              <Button type="link" size="small">
                <EyeOutlined />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- 项目详情抽屉 -->
    <Drawer
      v-model:open="drawerVisible"
      title="项目位置信息"
      width="400"
    >
      <Descriptions bordered :column="1" v-if="selectedProject">
        <DescriptionsItem label="项目名称">{{ selectedProject.name }}</DescriptionsItem>
        <DescriptionsItem label="项目状态">
          <Tag>{{ selectedProject.status }}</Tag>
        </DescriptionsItem>
        <DescriptionsItem label="投资额">{{ selectedProject.investment }} 万元</DescriptionsItem>
        <DescriptionsItem label="经度">{{ selectedProject.lng }}</DescriptionsItem>
        <DescriptionsItem label="纬度">{{ selectedProject.lat }}</DescriptionsItem>
      </Descriptions>
    </Drawer>
  </div>
</template>

<style scoped>
.project-map {
  padding: 0;
}

.page-card {
  background: #fff;
}

.map-operations {
  margin-bottom: 16px;
}

.map-container {
  height: 600px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
}

.map-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e6f7ff 0%, #f6ffed 100%);
  position: relative;
}

.map-icon {
  font-size: 64px;
  color: #1890ff;
  margin-bottom: 16px;
}

.map-hint {
  color: #999;
  font-size: 12px;
}

.project-list {
  position: absolute;
  left: 16px;
  top: 16px;
  width: 300px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 16px;
  max-height: 500px;
  overflow-y: auto;
}

.project-list h4 {
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.project-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  margin-bottom: 8px;
}

.project-item:hover {
  background: #f5f5f5;
}

.project-icon {
  font-size: 20px;
  color: #1890ff;
  margin-right: 12px;
}

.project-info {
  flex: 1;
}

.project-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.investment {
  color: #1890ff;
}
</style>
