<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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
  Col
} from 'ant-design-vue'
import { PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined, FileTextOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const searchForm = ref({
  projectName: '',
  status: undefined,
  year: undefined
})

const columns = [
  {
    title: '项目编号',
    dataIndex: 'projectCode',
    key: 'projectCode',
    width: 120
  },
  {
    title: '项目名称',
    dataIndex: 'projectName',
    key: 'projectName',
    ellipsis: true
  },
  {
    title: '所属街道',
    dataIndex: 'street',
    key: 'street',
    width: 120
  },
  {
    title: '投资类型',
    dataIndex: 'investType',
    key: 'investType',
    width: 120
  },
  {
    title: '项目总投资(万元)',
    dataIndex: 'totalInvestment',
    key: 'totalInvestment',
    width: 150,
    align: 'right'
  },
  {
    title: '项目状态',
    dataIndex: 'status',
    key: 'status',
    width: 100
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right'
  }
]

const dataSource = ref([
  {
    key: '1',
    projectCode: 'JN2024001',
    projectName: '金牛区智慧城市建设项目',
    street: '茶店子街道',
    investType: '政府投资',
    totalInvestment: 5000,
    status: '进行中'
  },
  {
    key: '2',
    projectCode: 'JN2024002',
    projectName: '金牛大道改造工程',
    street: '抚琴街道',
    investType: '政府投资',
    totalInvestment: 8000,
    status: '进行中'
  }
])

const statusOptions = [
  { label: '草稿', value: 'draft' },
  { label: '审核中', value: 'reviewing' },
  { label: '已通过', value: 'approved' },
  { label: '进行中', value: 'ongoing' },
  { label: '已完成', value: 'completed' }
]

const yearOptions = [
  { label: '2024年', value: '2024' },
  { label: '2025年', value: '2025' },
  { label: '2026年', value: '2026' }
]

const handleCreate = () => {
  router.push('/projects/new/step1')
}

const handleView = (record: any) => {
  console.log('查看项目:', record)
}

const handleEdit = (record: any) => {
  router.push(`/projects/new/step1?id=${record.key}`)
}

const handleProgressReport = (record: any) => {
  router.push(`/projects/${record.key}/progress-report`)
}

const handleSearch = () => {
  console.log('搜索:', searchForm.value)
}

const handleReset = () => {
  searchForm.value = {
    projectName: '',
    status: undefined,
    year: undefined
  }
}
</script>

<template>
  <div class="projects-index">
    <Card title="项目管理" class="list-card">
      <!-- 搜索区域 -->
      <div class="search-area">
        <Form :model="searchForm" layout="inline">
          <Row :gutter="16" style="width: 100%">
            <Col :span="6">
              <FormItem label="项目名称" style="width: 100%">
                <Input
                  v-model:value="searchForm.projectName"
                  placeholder="请输入项目名称"
                  allow-clear
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
            <Col :span="5">
              <FormItem label="年度" style="width: 100%">
                <Select
                  v-model:value="searchForm.year"
                  placeholder="请选择年度"
                  :options="yearOptions"
                  allow-clear
                  style="width: 100%"
                />
              </FormItem>
            </Col>
            <Col :span="8">
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
        <Button type="primary" @click="handleCreate">
          <PlusOutlined />新建项目
        </Button>
      </div>

      <!-- 数据表格 -->
      <Table
        :columns="columns"
        :data-source="dataSource"
        :scroll="{ x: 1000 }"
        bordered
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
                <EyeOutlined />查看
              </Button>
              <Button type="link" size="small" @click="handleEdit(record)">
                <EditOutlined />编辑
              </Button>
              <Button type="link" size="small" @click="handleProgressReport(record)">
                <FileTextOutlined />进度报送
              </Button>
            </Space>
          </template>
        </template>
      </Table>
    </Card>
  </div>
</template>

<style scoped>
.projects-index {
  padding: 24px;
}

.list-card {
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
  font-size: 14px;
}
</style>
