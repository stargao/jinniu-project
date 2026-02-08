<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Card,
  Select,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Tag,
  Radio,
  Space,
  Tooltip
} from 'ant-design-vue'
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  CloseOutlined
} from '@ant-design/icons-vue'

// 字段类型定义
export interface QueryField {
  key: string
  label: string
  type: 'string' | 'number' | 'date' | 'select' | 'dateRange'
  options?: { label: string; value: any }[]
}

// 查询条件定义
export interface QueryCondition {
  id: string
  field: string
  operator: string
  value: any
  fieldLabel?: string
  operatorLabel?: string
}

// 查询对象
export interface QueryObject {
  logic: 'AND' | 'OR'
  conditions: QueryCondition[]
}

// Props 定义
interface Props {
  fields: QueryField[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  search: [queryObject: QueryObject]
  reset: []
}>()

// 当前编辑的条件
const currentField = ref<string>()
const currentOperator = ref<string>()
const currentValue = ref<any>()

// 已添加的条件列表
const conditions = ref<QueryCondition[]>([])

// 逻辑关系
const logic = ref<'AND' | 'OR'>('AND')

// 根据字段类型获取可用的操作符
const getOperators = (fieldType: string) => {
  const operatorMap: Record<string, { value: string; label: string }[]> = {
    string: [
      { value: 'equals', label: '等于' },
      { value: 'notEquals', label: '不等于' },
      { value: 'contains', label: '包含' },
      { value: 'notContains', label: '不包含' },
      { value: 'startsWith', label: '开头是' },
      { value: 'endsWith', label: '结尾是' },
      { value: 'isEmpty', label: '为空' },
      { value: 'isNotEmpty', label: '不为空' }
    ],
    number: [
      { value: 'equals', label: '等于' },
      { value: 'notEquals', label: '不等于' },
      { value: 'greaterThan', label: '大于' },
      { value: 'greaterThanOrEqual', label: '大于等于' },
      { value: 'lessThan', label: '小于' },
      { value: 'lessThanOrEqual', label: '小于等于' },
      { value: 'between', label: '在...之间' }
    ],
    date: [
      { value: 'equals', label: '等于' },
      { value: 'notEquals', label: '不等于' },
      { value: 'greaterThan', label: '晚于' },
      { value: 'lessThan', label: '早于' },
      { value: 'between', label: '在...之间' }
    ],
    select: [
      { value: 'equals', label: '等于' },
      { value: 'notEquals', label: '不等于' },
      { value: 'in', label: '包含在' },
      { value: 'notIn', label: '不包含在' }
    ],
    dateRange: [
      { value: 'between', label: '在...之间' }
    ]
  }
  return operatorMap[fieldType] || operatorMap.string
}

// 获取当前选中字段的信息
const selectedField = computed(() => {
  return props.fields.find(f => f.key === currentField.value)
})

// 获取当前可用的操作符
const availableOperators = computed(() => {
  if (!selectedField.value) return []
  return getOperators(selectedField.value.type)
})

// 是否需要输入值
const needInputValue = computed(() => {
  if (!currentOperator.value) return false
  return !['isEmpty', 'isNotEmpty'].includes(currentOperator.value)
})

// 添加条件
const addCondition = () => {
  if (!currentField.value || !currentOperator.value) return
  
  const field = props.fields.find(f => f.key === currentField.value)
  const operator = availableOperators.value.find(o => o.value === currentOperator.value)
  
  if (!field || !operator) return
  
  // 验证值是否有效
  if (needInputValue.value && (currentValue.value === undefined || currentValue.value === '')) {
    return
  }
  
  const condition: QueryCondition = {
    id: Date.now().toString(),
    field: currentField.value,
    operator: currentOperator.value,
    value: currentValue.value,
    fieldLabel: field.label,
    operatorLabel: operator.label
  }
  
  conditions.value.push(condition)
  
  // 重置当前编辑状态
  currentField.value = undefined
  currentOperator.value = undefined
  currentValue.value = undefined
}

// 删除条件
const removeCondition = (id: string) => {
  const index = conditions.value.findIndex(c => c.id === id)
  if (index > -1) {
    conditions.value.splice(index, 1)
  }
}

// 格式化条件显示文本
const formatConditionText = (condition: QueryCondition) => {
  if (['isEmpty', 'isNotEmpty'].includes(condition.operator)) {
    return `${condition.fieldLabel} ${condition.operatorLabel}`
  }
  
  let valueText = condition.value
  if (Array.isArray(condition.value)) {
    valueText = condition.value.join(', ')
  }
  
  return `${condition.fieldLabel} ${condition.operatorLabel} "${valueText}"`
}

// 执行查询
const handleSearch = () => {
  const queryObject: QueryObject = {
    logic: logic.value,
    conditions: conditions.value
  }
  emit('search', queryObject)
}

// 重置
const handleReset = () => {
  conditions.value = []
  logic.value = 'AND'
  currentField.value = undefined
  currentOperator.value = undefined
  currentValue.value = undefined
  emit('reset')
}

// 监听字段变化，重置操作符和值
watch(currentField, () => {
  currentOperator.value = undefined
  currentValue.value = undefined
})

// 监听操作符变化，重置值
watch(currentOperator, () => {
  currentValue.value = undefined
})
</script>

<template>
  <Card class="query-builder" size="small">
    <!-- 条件添加区 -->
    <div class="builder-area">
      <div class="builder-row">
        <span class="builder-label">添加条件：</span>
        <Space>
          <Select
            v-model:value="currentField"
            placeholder="选择字段"
            style="width: 150px"
            :options="fields.map(f => ({ label: f.label, value: f.key }))"
            allow-clear
          />
          <Select
            v-model:value="currentOperator"
            placeholder="选择条件"
            style="width: 140px"
            :options="availableOperators.map(o => ({ label: o.label, value: o.value }))"
            :disabled="!currentField"
            allow-clear
          />
          
          <!-- 动态输入组件 -->
          <template v-if="needInputValue && selectedField">
            <Input
              v-if="selectedField.type === 'string'"
              v-model:value="currentValue"
              placeholder="输入查询内容"
              style="width: 200px"
            />
            <InputNumber
              v-else-if="selectedField.type === 'number' && currentOperator !== 'between'"
              v-model:value="currentValue"
              placeholder="输入数值"
              style="width: 200px"
            />
            <template v-else-if="selectedField.type === 'number' && currentOperator === 'between'">
              <InputNumber
                v-model:value="currentValue[0]"
                placeholder="最小值"
                style="width: 95px"
              />
              <span class="range-separator">-</span>
              <InputNumber
                v-model:value="currentValue[1]"
                placeholder="最大值"
                style="width: 95px"
              />
            </template>
            <DatePicker
              v-else-if="selectedField.type === 'date' && currentOperator !== 'between'"
              v-model:value="currentValue"
              placeholder="选择日期"
              style="width: 200px"
              value-format="YYYY-MM-DD"
            />
            <DatePicker.RangePicker
              v-else-if="selectedField.type === 'date' && currentOperator === 'between'"
              v-model:value="currentValue"
              placeholder="选择日期范围"
              style="width: 240px"
              value-format="YYYY-MM-DD"
            />
            <Select
              v-else-if="selectedField.type === 'select'"
              v-model:value="currentValue"
              placeholder="选择选项"
              style="width: 200px"
              :options="selectedField.options"
              allow-clear
            />
          </template>
          
          <Button 
            type="primary" 
            :disabled="!currentField || !currentOperator || (needInputValue && !currentValue)"
            @click="addCondition"
          >
            <PlusOutlined />添加
          </Button>
        </Space>
      </div>
    </div>

    <!-- 条件展示区 -->
    <div v-if="conditions.length > 0" class="tags-area">
      <div class="tags-header">
        <span class="tags-title">已添加条件：</span>
        <Radio.Group v-model:value="logic" size="small" button-style="solid">
          <Radio.Button value="AND">且</Radio.Button>
          <Radio.Button value="OR">或</Radio.Button>
        </Radio.Group>
      </div>
      
      <div class="tags-list">
        <template v-for="(condition, index) in conditions" :key="condition.id">
          <Tag
            closable
            class="condition-tag"
            @close="removeCondition(condition.id)"
          >
            <Tooltip :title="formatConditionText(condition)">
              <span class="tag-content">{{ formatConditionText(condition) }}</span>
            </Tooltip>
          </Tag>
          <span v-if="index < conditions.length - 1" class="logic-connector">
            {{ logic === 'AND' ? '且' : '或' }}
          </span>
        </template>
      </div>
    </div>

    <!-- 操作区 -->
    <div class="action-area">
      <Space>
        <Button type="primary" :disabled="conditions.length === 0" @click="handleSearch">
          <SearchOutlined />查询
        </Button>
        <Button @click="handleReset">
          <ReloadOutlined />重置
        </Button>
      </Space>
    </div>
  </Card>
</template>

<style scoped>
.query-builder {
  margin-bottom: 16px;
}

.builder-area {
  padding: 16px;
  background: #f6ffed;
  border-radius: 8px;
  margin-bottom: 16px;
}

.builder-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.builder-label {
  font-weight: 500;
  color: #52c41a;
  white-space: nowrap;
}

.range-separator {
  color: #999;
  padding: 0 4px;
}

.tags-area {
  padding: 16px;
  background: #e6f7ff;
  border-radius: 8px;
  margin-bottom: 16px;
}

.tags-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.tags-title {
  font-weight: 500;
  color: #1890ff;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.condition-tag {
  max-width: 300px;
  font-size: 13px;
  padding: 4px 8px;
  background: #fff;
  border: 1px solid #d9d9d9;
}

.tag-content {
  display: inline-block;
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logic-connector {
  color: #1890ff;
  font-weight: 500;
  padding: 0 4px;
}

.action-area {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}
</style>