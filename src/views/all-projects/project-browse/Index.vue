<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Form,
  Row,
  Col,
  Drawer,
  Descriptions,
  DescriptionsItem,
  Timeline,
  TimelineItem
} from 'ant-design-vue'
import {
  SearchOutlined,
  EyeOutlined,
  HistoryOutlined
} from '@ant-design/icons-vue'

// 搜索表单
const searchForm = reactive({
  level: undefined,
  status: undefined,
  keyword: ''
})

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

// 选项数据
const levelOptions = [
  { label: '区本级', value: 'district' },
  { label: '市本级', value: 'city' },
  { label: '省本级', value: 'province' }
]

const statusOptions = [
  { label: '草稿', value: 'draft' },
  { label: '审核中', value: 'reviewing' },
  { label: '已通过', value: 'approved' },
  { label: '进行中', value: 'ongoing' },
  { label: '已完成', value: 'completed' }
]

// 抽屉控制
const detailDrawerVisible = ref(false)
const historyDrawerVisible = ref(false)
const selectedRecord = ref<any>(null)

// 搜索
const handleSearch = () => {
  console.log('搜索:', searchForm)
}

// 重置
const handleReset = () => {
  searchForm.level = undefined
  searchForm.status = undefined
  searchForm.keyword = ''
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
      <!-- 搜索区域 -->
      <div class="search-area">
        <Form :model="searchForm" layout="inline">
          <Row :gutter="16" style="width: 100%">
            <Col :span="5">
              <FormItem label="项目级别" style="width: 100%">
                <Select
                  v-model:value="searchForm.level"
                  placeholder="请选择级别"
                  :options="levelOptions"
                  allow-clear
                  style="width: 100%"
                />
              </FormItem>
            </Col>
            <Col :span="5">
              <FormItem label="项目状态" style="width: 100%">
                <Select
                  v-model:value="searchForm.status"
                  placeholder="请选择状态"
                  :options="statusOptions"
                  allow-clear
                  style="width: 100%"
                />
              </FormItem>
            </Col>
            <Col :span="8">
              <FormItem label="关键词" style="width: 100%">
                <Input
                  v-model:value="searchForm.keyword"
                  placeholder="请输入项目编号或名称"
                  allow-clear
                />
              </FormItem>
            </Col>
            <Col :span="6">
              <FormItem>
                <Space>
                  <Button type="primary" @click="handleSearch">
                    <SearchOutlined />查询
                  </Button>
                  <Button @click="handleReset">重置</Button>
                </Space>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>

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

.search-area {
  margin-bottom: 16px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

:deep(.ant-table) {
  font-size: 13px;
}
</style>
