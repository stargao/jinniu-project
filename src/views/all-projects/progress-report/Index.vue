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
  message
} from 'ant-design-vue'
import {
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  BarChartOutlined
} from '@ant-design/icons-vue'
import ProgressFormModal from './components/ProgressFormModal.vue'
import ProgressAuditModal from './components/ProgressAuditModal.vue'

// 搜索表单
const searchForm = reactive({
  year: undefined,
  month: undefined,
  keyword: ''
})

// 表格列定义
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' },
  { title: '项目编号', dataIndex: 'projectCode', key: 'projectCode', width: 120 },
  { title: '项目名称', dataIndex: 'projectName', key: 'projectName', ellipsis: true },
  { title: '报送月份', dataIndex: 'reportMonth', key: 'reportMonth', width: 100 },
  { title: '本月完成投资(万元)', dataIndex: 'monthInvestment', key: 'monthInvestment', width: 140, align: 'right' },
  { title: '累计完成投资(万元)', dataIndex: 'totalInvestment', key: 'totalInvestment', width: 140, align: 'right' },
  { title: '完成率', dataIndex: 'completionRate', key: 'completionRate', width: 100 },
  { title: '建设阶段', dataIndex: 'phase', key: 'phase', width: 100 },
  { title: '进度状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '操作', key: 'action', width: 200, fixed: 'right' }
]

// 表格数据
const dataSource = ref([
  {
    key: '1',
    index: 1,
    projectCode: 'JN2024001',
    projectName: '金牛区智慧城市建设项目',
    reportMonth: '2024-01',
    monthInvestment: 500,
    totalInvestment: 1500,
    completionRate: '30%',
    phase: '主体建设',
    status: '正常'
  },
  {
    key: '2',
    index: 2,
    projectCode: 'JN2024002',
    projectName: '金牛大道改造工程',
    reportMonth: '2024-01',
    monthInvestment: 800,
    totalInvestment: 2800,
    completionRate: '35%',
    phase: '基础施工',
    status: '滞后'
  }
])

// 选项数据
const yearOptions = [
  { label: '2024年', value: '2024' },
  { label: '2025年', value: '2025' }
]

const monthOptions = [
  { label: '1月', value: '01' },
  { label: '2月', value: '02' },
  { label: '3月', value: '03' },
  { label: '4月', value: '04' },
  { label: '5月', value: '05' },
  { label: '6月', value: '06' },
  { label: '7月', value: '07' },
  { label: '8月', value: '08' },
  { label: '9月', value: '09' },
  { label: '10月', value: '10' },
  { label: '11月', value: '11' },
  { label: '12月', value: '12' }
]

// 弹窗控制
const progressModalVisible = ref(false)
const auditModalVisible = ref(false)
const selectedRecord = ref<any>(null)

// 搜索
const handleSearch = () => {
  message.success('执行搜索')
}

// 重置
const handleReset = () => {
  searchForm.year = undefined
  searchForm.month = undefined
  searchForm.keyword = ''
}

// 填报进度
const handleReport = (record: any) => {
  selectedRecord.value = record
  progressModalVisible.value = true
}

// 查看详情
const handleView = (record: any) => {
  message.info(`查看项目: ${record.projectName}`)
}

// 审核进度
const handleAudit = (record: any) => {
  selectedRecord.value = record
  auditModalVisible.value = true
}

// 进度预警
const handleWarning = () => {
  message.warning('打开进度预警弹窗')
}

// 报送统计
const handleStatistics = () => {
  message.info('打开报送统计弹窗')
}

// 进度弹窗确认
const handleProgressOk = (values: any) => {
  message.success('进度报送成功')
  progressModalVisible.value = false
}

// 审核弹窗确认
const handleAuditOk = (values: any) => {
  message.success('审核完成')
  auditModalVisible.value = false
}
</script>

<template>
  <div class="progress-report">
    <Card title="进度报送" class="page-card">
      <!-- 搜索区域 -->
      <div class="search-area">
        <Form :model="searchForm" layout="inline">
          <Row :gutter="16" style="width: 100%">
            <Col :span="5">
              <FormItem label="年份" style="width: 100%">
                <Select
                  v-model:value="searchForm.year"
                  placeholder="请选择年份"
                  :options="yearOptions"
                  allow-clear
                  style="width: 100%"
                />
              </FormItem>
            </Col>
            <Col :span="5">
              <FormItem label="月份" style="width: 100%">
                <Select
                  v-model:value="searchForm.month"
                  placeholder="请选择月份"
                  :options="monthOptions"
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

      <!-- 操作按钮 -->
      <div class="table-operations">
        <Space>
          <Button type="primary" @click="handleWarning">
            <WarningOutlined />进度预警
          </Button>
          <Button @click="handleStatistics">
            <BarChartOutlined />报送统计
          </Button>
        </Space>
      </div>

      <!-- 数据表格 -->
      <Table
        :columns="columns"
        :data-source="dataSource"
        :scroll="{ x: 1200 }"
        bordered
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <Tag :color="record.status === '正常' ? 'success' : 'error'">
              {{ record.status }}
            </Tag>
          </template>
          <template v-if="column.key === 'action'">
            <Space>
              <Button type="link" size="small" @click="handleView(record)">
                <EyeOutlined />查看
              </Button>
              <Button type="link" size="small" @click="handleReport(record)">
                <EditOutlined />填报进度
              </Button>
              <Button type="link" size="small" @click="handleAudit(record)">
                <CheckCircleOutlined />审核
              </Button>
            </Space>
          </template>
        </template>
      </Table>
    </Card>

    <!-- 进度填报弹窗 -->
    <ProgressFormModal
      v-model:visible="progressModalVisible"
      :record="selectedRecord"
      @ok="handleProgressOk"
    />

    <!-- 进度审核弹窗 -->
    <ProgressAuditModal
      v-model:visible="auditModalVisible"
      :record="selectedRecord"
      @ok="handleAuditOk"
    />
  </div>
</template>

<style scoped>
.progress-report {
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

.table-operations {
  margin-bottom: 16px;
}

:deep(.ant-table) {
  font-size: 13px;
}
</style>
