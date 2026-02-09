<script setup lang="ts">
import { ref } from 'vue'
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Drawer,
  Descriptions,
  DescriptionsItem,
  Timeline,
  TimelineItem,
  message
} from 'ant-design-vue'
import {
  EyeOutlined,
  HistoryOutlined
} from '@ant-design/icons-vue'
import QueryBuilder, { type QueryField, type QueryObject } from '@/components/common/QueryBuilder.vue'

// 表格列定义
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' },
  { title: '项目编号', dataIndex: 'projectCode', key: 'projectCode', width: 120 },
  { title: '项目名称', dataIndex: 'projectName', key: 'projectName', ellipsis: true },
  { title: '项目级别', dataIndex: 'level', key: 'level', width: 100 },
  { title: '牵头单位', dataIndex: 'leadUnit', key: 'leadUnit', width: 120 },
  { title: '总投资(万元)', dataIndex: 'totalInvestment', key: 'totalInvestment', width: 120, align: 'right' },
  { title: '项目状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 150 },
  { title: '操作', key: 'action', width: 150, fixed: 'right' }
]

// 表格数据
const dataSource = ref([
  {
    key: '1',
    index: 1,
    projectCode: 'JN2024001',
    projectName: '金牛区智慧城市建设项目',
    level: '区本级',
    leadUnit: '区发改局',
    totalInvestment: 5000,
    status: '进行中',
    updateTime: '2024-01-15 10:30:00'
  },
  {
    key: '2',
    index: 2,
    projectCode: 'JN2024002',
    projectName: '金牛大道改造工程',
    level: '区本级',
    leadUnit: '区住建局',
    totalInvestment: 8000,
    status: '进行中',
    updateTime: '2024-01-14 16:45:00'
  }
])

// QueryBuilder 字段配置
const queryFields: QueryField[] = [
  {
    key: 'projectCode',
    label: '项目编号',
    type: 'string'
  },
  {
    key: 'projectName',
    label: '项目名称',
    type: 'string'
  },
  {
    key: 'level',
    label: '项目级别',
    type: 'select',
    options: [
      { label: '区本级', value: 'district' },
      { label: '市本级', value: 'city' },
      { label: '省本级', value: 'province' }
    ]
  },
  {
    key: 'leadUnit',
    label: '牵头单位',
    type: 'select',
    options: [
      { label: '区发改局', value: '区发改局' },
      { label: '区住建局', value: '区住建局' },
      { label: '区经信局', value: '区经信局' },
      { label: '区商务局', value: '区商务局' }
    ]
  },
  {
    key: 'status',
    label: '项目状态',
    type: 'select',
    options: [
      { label: '草稿', value: 'draft' },
      { label: '审核中', value: 'reviewing' },
      { label: '已通过', value: 'approved' },
      { label: '进行中', value: 'ongoing' },
      { label: '已完成', value: 'completed' }
    ]
  },
  {
    key: 'totalInvestment',
    label: '总投资(万元)',
    type: 'number'
  }
]

// 抽屉控制
const detailDrawerVisible = ref(false)
const historyDrawerVisible = ref(false)
const selectedRecord = ref<any>(null)

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

// 查看详情
const handleView = (record: any) => {
  selectedRecord.value = record
  detailDrawerVisible.value = true
}

// 查看更新记录
const handleHistory = (record: any) => {
  selectedRecord.value = record
  historyDrawerVisible.value = true
}
</script>

<template>
  <div class="project-browse">
    <Card title="项目浏览" class="page-card">
      <!-- 通用查询组件 -->
      <QueryBuilder
        :fields="queryFields"
        @search="handleQueryBuilderSearch"
        @reset="handleQueryBuilderReset"
      />

      <!-- 数据表格 -->
      <Table
        :columns="columns"
        :data-source="dataSource"
        :scroll="{ x: 1100 }"
        bordered
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <Tag :color="record.status === '进行中' ? 'processing' : 'default'">
              {{ record.status }}
            </Tag>
          </template>
          <template v-if="column.key === 'action'">
            <Space>
              <Button type="link" size="small" @click="handleView(record)">
                <EyeOutlined />查看详情
              </Button>
              <Button type="link" size="small" @click="handleHistory(record)">
                <HistoryOutlined />更新记录
              </Button>
            </Space>
          </template>
        </template>
      </Table>
    </Card>

    <!-- 项目详情抽屉 -->
    <Drawer
      v-model:open="detailDrawerVisible"
      title="项目详情"
      width="600"
    >
      <Descriptions bordered :column="1" v-if="selectedRecord">
        <DescriptionsItem label="项目编号">{{ selectedRecord.projectCode }}</DescriptionsItem>
        <DescriptionsItem label="项目名称">{{ selectedRecord.projectName }}</DescriptionsItem>
        <DescriptionsItem label="项目级别">{{ selectedRecord.level }}</DescriptionsItem>
        <DescriptionsItem label="牵头单位">{{ selectedRecord.leadUnit }}</DescriptionsItem>
        <DescriptionsItem label="总投资">{{ selectedRecord.totalInvestment }} 万元</DescriptionsItem>
        <DescriptionsItem label="项目状态">
          <Tag :color="selectedRecord.status === '进行中' ? 'processing' : 'default'">
            {{ selectedRecord.status }}
          </Tag>
        </DescriptionsItem>
        <DescriptionsItem label="更新时间">{{ selectedRecord.updateTime }}</DescriptionsItem>
      </Descriptions>
    </Drawer>

    <!-- 更新记录抽屉 -->
    <Drawer
      v-model:open="historyDrawerVisible"
      title="项目更新记录"
      width="500"
    >
      <Timeline mode="left">
        <TimelineItem label="2024-01-15 10:30:00">
          <p>修改了项目进度信息</p>
          <p style="color: #999; font-size: 12px">操作人：张三</p>
        </TimelineItem>
        <TimelineItem label="2024-01-10 14:20:00">
          <p>提交了项目申报</p>
          <p style="color: #999; font-size: 12px">操作人：张三</p>
        </TimelineItem>
        <TimelineItem label="2024-01-05 09:15:00">
          <p>创建了项目</p>
          <p style="color: #999; font-size: 12px">操作人：张三</p>
        </TimelineItem>
      </Timeline>
    </Drawer>
  </div>
</template>

<style scoped>
.project-browse {
  padding: 0;
}

.page-card {
  background: #fff;
}

:deep(.ant-table) {
  font-size: 13px;
}
</style>
