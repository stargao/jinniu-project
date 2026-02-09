<script setup lang="ts">
import { ref } from 'vue'
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Modal,
  message,
  Popconfirm
} from 'ant-design-vue'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
  SwapOutlined
} from '@ant-design/icons-vue'
import QueryBuilder, { type QueryField, type QueryObject } from '@/components/common/QueryBuilder.vue'

// 表格列定义
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' },
  { title: '项目编号', dataIndex: 'projectCode', key: 'projectCode', width: 120 },
  { title: '项目名称', dataIndex: 'projectName', key: 'projectName', ellipsis: true },
  { title: '项目类别', dataIndex: 'category', key: 'category', width: 100 },
  { title: '储备状态', dataIndex: 'reserveStatus', key: 'reserveStatus', width: 100 },
  { title: '入库时间', dataIndex: 'storageTime', key: 'storageTime', width: 120 },
  { title: '预计投资(万元)', dataIndex: 'estimatedInvestment', key: 'estimatedInvestment', width: 130, align: 'right' },
  { title: '操作', key: 'action', width: 200, fixed: 'right' }
]

// 表格数据
const dataSource = ref([
  {
    key: '1',
    index: 1,
    projectCode: 'CB2024001',
    projectName: '金牛区未来社区建设项目',
    category: '社会民生',
    reserveStatus: '已入库',
    storageTime: '2024-01-10',
    estimatedInvestment: 3000
  },
  {
    key: '2',
    index: 2,
    projectCode: 'CB2024002',
    projectName: '金牛区绿色能源项目',
    category: '基础设施',
    reserveStatus: '待审核',
    storageTime: '2024-01-15',
    estimatedInvestment: 5000
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
    key: 'category',
    label: '项目类别',
    type: 'select',
    options: [
      { label: '基础设施', value: '基础设施' },
      { label: '市政工程', value: '市政工程' },
      { label: '产业发展', value: '产业发展' },
      { label: '社会民生', value: '社会民生' }
    ]
  },
  {
    key: 'reserveStatus',
    label: '储备状态',
    type: 'select',
    options: [
      { label: '待审核', value: 'pending' },
      { label: '已入库', value: 'stored' },
      { label: '已转化', value: 'converted' },
      { label: '已退回', value: 'returned' }
    ]
  },
  {
    key: 'estimatedInvestment',
    label: '预计投资(万元)',
    type: 'number'
  }
]

// 弹窗控制
const modalVisible = ref(false)
const modalTitle = ref('新增预备项目')
const editingRecord = ref<any>(null)

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

// 新增项目
const handleAdd = () => {
  modalTitle.value = '新增预备项目'
  editingRecord.value = null
  modalVisible.value = true
}

// 编辑项目
const handleEdit = (record: any) => {
  modalTitle.value = '编辑预备项目'
  editingRecord.value = record
  modalVisible.value = true
}

// 查看项目
const handleView = (record: any) => {
  message.info(`查看项目: ${record.projectName}`)
}

// 入库
const handleStorage = (record: any) => {
  message.success(`项目 ${record.projectName} 已入库`)
}

// 转化
const handleConvert = (record: any) => {
  message.success(`项目 ${record.projectName} 已转化`)
}

// 删除项目
const handleDelete = (record: any) => {
  const index = dataSource.value.findIndex(item => item.key === record.key)
  if (index > -1) {
    dataSource.value.splice(index, 1)
    message.success('删除成功')
  }
}

// 弹窗确认
const handleModalOk = () => {
  modalVisible.value = false
  message.success('保存成功')
}

// 弹窗取消
const handleModalCancel = () => {
  modalVisible.value = false
}
</script>

<template>
  <div class="preparation-page">
    <Card title="预备项目管理" class="page-card">
      <!-- 通用查询组件 -->
      <QueryBuilder
        :fields="queryFields"
        @search="handleQueryBuilderSearch"
        @reset="handleQueryBuilderReset"
      />

      <!-- 操作按钮 -->
      <div class="table-operations">
        <Space>
          <Button type="primary" @click="handleAdd">
            <PlusOutlined />新增预备项目
          </Button>
        </Space>
      </div>

      <!-- 数据表格 -->
      <Table
        :columns="columns"
        :data-source="dataSource"
        :scroll="{ x: 1000 }"
        bordered
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'reserveStatus'">
            <Tag :color="record.reserveStatus === '已入库' ? 'success' : record.reserveStatus === '待审核' ? 'warning' : 'default'">
              {{ record.reserveStatus }}
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
              <Button type="link" size="small" @click="handleStorage(record)">
                <DatabaseOutlined />入库
              </Button>
              <Button type="link" size="small" @click="handleConvert(record)">
                <SwapOutlined />转化
              </Button>
              <Popconfirm
                title="确定要删除这个项目吗？"
                @confirm="handleDelete(record)"
              >
                <Button type="link" danger size="small">
                  <DeleteOutlined />删除
                </Button>
              </Popconfirm>
            </Space>
          </template>
        </template>
      </Table>
    </Card>

    <!-- 项目表单弹窗 -->
    <Modal
      v-model:open="modalVisible"
      :title="modalTitle"
      width="700px"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <p>预备项目表单内容</p>
    </Modal>
  </div>
</template>

<style scoped>
.preparation-page {
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
