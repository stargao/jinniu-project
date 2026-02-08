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
  Popconfirm,
  message
} from 'ant-design-vue'
import {
  PlusOutlined,
  SearchOutlined,
  ImportOutlined,
  DatabaseOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue'
import ProjectFormModal from './components/ProjectFormModal.vue'

// 搜索表单
const searchForm = reactive({
  year: undefined,
  source: undefined,
  keyword: ''
})

// 表格列定义
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center', fixed: 'left' },
  { title: '项目编号', dataIndex: 'projectCode', key: 'projectCode', width: 120, fixed: 'left' },
  { title: '项目名称', dataIndex: 'projectName', key: 'projectName', width: 200, ellipsis: true },
  { title: '项目类别', dataIndex: 'category', key: 'category', width: 100 },
  { title: '牵头单位', dataIndex: 'leadUnit', key: 'leadUnit', width: 120 },
  { title: '本年计划新开工投资(万元)', dataIndex: 'newStartInvestment', key: 'newStartInvestment', width: 160, align: 'right' },
  { title: '总投资(万元)', dataIndex: 'totalInvestment', key: 'totalInvestment', width: 120, align: 'right' },
  { title: '截止上年末累计完成投资(万元)', dataIndex: 'completedInvestment', key: 'completedInvestment', width: 180, align: 'right' },
  { title: '本年计划总投资(万元)', dataIndex: 'plannedInvestment', key: 'plannedInvestment', width: 150, align: 'right' },
  { title: '所属重点产业链', dataIndex: 'industryChain', key: 'industryChain', width: 120 },
  { title: '开工部门', dataIndex: 'startDepartment', key: 'startDepartment', width: 100 },
  { title: '项目来源', dataIndex: 'source', key: 'source', width: 100 },
  { title: '项目备注', dataIndex: 'remark', key: 'remark', width: 150, ellipsis: true },
  { title: '操作', key: 'action', width: 280, fixed: 'right' }
]

// 表格数据
const dataSource = ref([
  {
    key: '1',
    index: 1,
    projectCode: 'JN2024001',
    projectName: '金牛区智慧城市建设项目',
    category: '基础设施',
    leadUnit: '区发改局',
    newStartInvestment: 2000,
    totalInvestment: 5000,
    completedInvestment: 1000,
    plannedInvestment: 3000,
    industryChain: '电子信息',
    startDepartment: '住建局',
    source: '区级申报',
    remark: '重点项目，需加快推进'
  },
  {
    key: '2',
    index: 2,
    projectCode: 'JN2024002',
    projectName: '金牛大道改造工程',
    category: '市政工程',
    leadUnit: '区住建局',
    newStartInvestment: 3000,
    totalInvestment: 8000,
    completedInvestment: 2000,
    plannedInvestment: 5000,
    industryChain: '装备制造',
    startDepartment: '交通局',
    source: '市级转报',
    remark: '道路拓宽及绿化'
  }
])

// 年份选项
const yearOptions = [
  { label: '2024年', value: '2024' },
  { label: '2025年', value: '2025' },
  { label: '2026年', value: '2026' }
]

// 项目来源选项
const sourceOptions = [
  { label: '区级申报', value: 'district' },
  { label: '市级转报', value: 'city' },
  { label: '省级转报', value: 'province' },
  { label: '储备项目', value: 'reserve' }
]

// 弹窗控制
const modalVisible = ref(false)
const modalTitle = ref('新增项目')
const editingRecord = ref<any>(null)

// 搜索
const handleSearch = () => {
  message.success('执行搜索')
}

// 重置
const handleReset = () => {
  searchForm.year = undefined
  searchForm.source = undefined
  searchForm.keyword = ''
}

// 新增项目
const handleAdd = () => {
  modalTitle.value = '新增项目'
  editingRecord.value = null
  modalVisible.value = true
}

// 编辑项目
const handleEdit = (record: any) => {
  modalTitle.value = '编辑项目'
  editingRecord.value = record
  modalVisible.value = true
}

// 查看项目
const handleView = (record: any) => {
  message.info(`查看项目: ${record.projectName}`)
}

// 提交审核
const handleSubmit = (record: any) => {
  message.success(`项目 ${record.projectName} 已提交审核`)
}

// 删除项目
const handleDelete = (record: any) => {
  const index = dataSource.value.findIndex(item => item.key === record.key)
  if (index > -1) {
    dataSource.value.splice(index, 1)
    message.success('删除成功')
  }
}

// 导入项目
const handleImport = () => {
  message.info('打开导入对话框')
}

// 储备项目
const handleReserve = () => {
  message.info('打开储备项目对话框')
}

// 弹窗确认
const handleModalOk = (values: any) => {
  if (editingRecord.value) {
    // 编辑模式
    const index = dataSource.value.findIndex(item => item.key === editingRecord.value.key)
    if (index > -1) {
      dataSource.value[index] = { ...dataSource.value[index], ...values }
    }
    message.success('修改成功')
  } else {
    // 新增模式
    const newRecord = {
      key: String(Date.now()),
      index: dataSource.value.length + 1,
      ...values
    }
    dataSource.value.push(newRecord)
    message.success('新增成功')
  }
  modalVisible.value = false
}

// 弹窗取消
const handleModalCancel = () => {
  modalVisible.value = false
}
</script>

<template>
  <div class="project-declaration">
    <Card title="项目申报" class="page-card">
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
              <FormItem label="项目来源" style="width: 100%">
                <Select
                  v-model:value="searchForm.source"
                  placeholder="请选择来源"
                  :options="sourceOptions"
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
          <Button type="primary" @click="handleAdd">
            <PlusOutlined />新增项目
          </Button>
          <Button @click="handleImport">
            <ImportOutlined />导入项目
          </Button>
          <Button @click="handleReserve">
            <DatabaseOutlined />储备项目
          </Button>
        </Space>
      </div>

      <!-- 数据表格 -->
      <Table
        :columns="columns"
        :data-source="dataSource"
        :scroll="{ x: 1800 }"
        bordered
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <div class="action-buttons">
              <Button type="link" size="small" class="action-btn" @click="handleView(record)">
                <EyeOutlined />查看
              </Button>
              <Button type="link" size="small" class="action-btn" @click="handleEdit(record)">
                <EditOutlined />编辑
              </Button>
              <Button type="link" size="small" class="action-btn" @click="handleSubmit(record)">
                <CheckCircleOutlined />提交
              </Button>
              <Popconfirm
                title="确定要删除这个项目吗？"
                @confirm="handleDelete(record)"
              >
                <Button type="link" danger size="small" class="action-btn">
                  <DeleteOutlined />删除
                </Button>
              </Popconfirm>
            </div>
          </template>
        </template>
      </Table>
    </Card>

    <!-- 项目表单弹窗 -->
    <ProjectFormModal
      v-model:visible="modalVisible"
      :title="modalTitle"
      :record="editingRecord"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    />
  </div>
</template>

<style scoped>
.project-declaration {
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
