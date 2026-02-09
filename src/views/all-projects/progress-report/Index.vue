<script setup lang="ts">
import { ref } from 'vue'
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  message
} from 'ant-design-vue'
import {
  EditOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  BarChartOutlined
} from '@ant-design/icons-vue'
import ProgressFormModal from './components/ProgressFormModal.vue'
import ProgressAuditModal from './components/ProgressAuditModal.vue'
import QueryBuilder, { type QueryField, type QueryObject } from '@/components/common/QueryBuilder.vue'

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

// QueryBuilder 字段配置
const queryFields: QueryField[] = [
  {
    key: 'year',
    label: '年份',
    type: 'select',
    options: [
      { label: '2024年', value: '2024' },
      { label: '2025年', value: '2025' }
    ]
  },
  {
    key: 'month',
    label: '月份',
    type: 'select',
    options: [
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
  },
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
    key: 'phase',
    label: '建设阶段',
    type: 'select',
    options: [
      { label: '前期准备', value: 'preparation' },
      { label: '基础施工', value: 'foundation' },
      { label: '主体建设', value: 'main' },
      { label: '设备安装', value: 'equipment' },
      { label: '竣工验收', value: 'completion' }
    ]
  },
  {
    key: 'status',
    label: '进度状态',
    type: 'select',
    options: [
      { label: '正常', value: 'normal' },
      { label: '滞后', value: 'delayed' },
      { label: '严重滞后', value: 'seriously_delayed' }
    ]
  }
]

// 弹窗控制
const progressModalVisible = ref(false)
const auditModalVisible = ref(false)
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
      <!-- 通用查询组件 -->
      <QueryBuilder
        :fields="queryFields"
        @search="handleQueryBuilderSearch"
        @reset="handleQueryBuilderReset"
      />

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

.table-operations {
  margin-bottom: 16px;
}

:deep(.ant-table) {
  font-size: 13px;
}
</style>
