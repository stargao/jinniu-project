<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  Modal,
  Form,
  FormItem,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Textarea,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Steps,
  Step,
  Button,
  Row,
  Col,
  Divider,
  message
} from 'ant-design-vue'

interface Props {
  visible: boolean
  title: string
  record?: any
}

const props = defineProps<Props>()
const emit = defineEmits(['update:visible', 'ok', 'cancel'])

const formRef = ref<InstanceType<typeof Form>>()
const currentStep = ref(0)

// 表单数据 - 步骤1：项目基本信息
const formState = ref({
  // ===== 项目基本信息 =====
  projectName: '',
  projectCode: '',
  isCustomWarning: false,
  isProvincialLead: false,
  address: '',
  industryPark: undefined,
  industryChain: undefined,
  street: undefined,
  approvalCategory: undefined,
  plannedCompletionDate: '',
  plannedResumeDate: '',
  actualStartDate: '',
  actualCompletionDate: '',
  constructionContent: '',
  
  // ===== 项目责任信息 =====
  districtLeader: '',
  leadUnitInfo: undefined,
  leadUnit: undefined,
  ownerUnit: undefined,
  ownerMaintenanceUnit: undefined,
  maintenanceContact: '',
  maintenanceContactPhone: '',
  industryDepartment: '',
  
  // ===== 项目分类信息 =====
  isEngineering: false,
  isGovInvest: false,
  investType: undefined,
  signingDate: '',
  landSupplyDate: '',
  subInvestType: [],
  
  // ===== 资金来源信息 (步骤2) =====
  totalInvestment: undefined,
  engineeringCost: undefined,
  demolitionCost: undefined,
  otherCost: undefined,
  
  // ===== 项目年度信息 (步骤3) =====
  year: undefined,
  fourBatches: undefined,
  investToEndOfLastYear: undefined,
  balanceAtEndOfLastYear: undefined,
  plannedInvestmentThisYear: undefined,
  plannedStartDate: '',
  plannedCompletionDateYear: '',
  constructionPlan: '',
  fundingArrangement: '',
  plannedProgressThisYear: '',
  districtAffiliation: false,
  cityAffiliation: false,
  provinceAffiliation: false,
  quarterlyGoal: ''
})

// 自动计算总投资
const calculatedTotal = computed(() => {
  const eng = formState.value.engineeringCost || 0
  const demo = formState.value.demolitionCost || 0
  const other = formState.value.otherCost || 0
  return eng + demo + other
})

// 监听子项变化，自动更新总投资
watch(calculatedTotal, (newVal) => {
  formState.value.totalInvestment = newVal
})

// 监听编辑记录变化
watch(() => props.record, (newVal) => {
  if (newVal) {
    formState.value = { ...formState.value, ...newVal }
  }
}, { immediate: true })

// ===== 选项数据 =====

// 产业园区选项
const industryParkOptions = [
  { label: '金牛高新技术产业园区', value: '1' },
  { label: '成都国际商贸城', value: '2' },
  { label: '其他园区', value: '3' }
]

// 产业链选项
const industryChainOptions = [
  { label: '电子信息', value: '1' },
  { label: '装备制造', value: '2' },
  { label: '生物医药', value: '3' },
  { label: '新材料', value: '4' }
]

// 街道选项
const streetOptions = [
  { label: '抚琴街道', value: '1' },
  { label: '驷马桥街道', value: '2' },
  { label: '茶店子街道', value: '3' },
  { label: '九里堤街道', value: '4' }
]

// 批文类别选项
const approvalCategoryOptions = [
  { label: '审批制', value: '1' },
  { label: '核准制', value: '2' },
  { label: '备案制', value: '3' }
]

// 单位选项
const unitOptions = [
  { label: '区发改局', value: '1' },
  { label: '区住建局', value: '2' },
  { label: '区经信局', value: '3' },
  { label: '区商务局', value: '4' }
]

// 投资类型选项
const investTypeOptions = [
  { label: '工业项目', value: '1' },
  { label: '其他项目', value: '2' }
]

// 子投资类型选项
const subInvestTypeOptions = [
  { label: '市政类项目', value: '1' },
  { label: '房建类项目', value: '2' }
]

// 年度选项
const yearOptions = [
  { label: '2024年', value: '2024' },
  { label: '2025年', value: '2025' },
  { label: '2026年', value: '2026' }
]

// 四个一批选项
const fourBatchesOptions = [
  { label: '策划储备', value: '1' },
  { label: '落地开工', value: '2' },
  { label: '加快建设', value: '3' },
  { label: '竣工投产', value: '4' }
]

// 表单验证规则
const rules = {
  projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }]
}

// 步骤配置
const steps = [
  { title: '项目基本信息', key: 'basic' },
  { title: '资金来源信息', key: 'funding' },
  { title: '项目年度信息', key: 'annual' }
]

// 下一步
const nextStep = async () => {
  try {
    await formRef.value?.validate()
    if (currentStep.value < steps.length - 1) {
      currentStep.value++
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 上一步
const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// 提交
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    emit('ok', formState.value)
    message.success('保存成功')
    // 重置表单
    currentStep.value = 0
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 取消
const handleCancel = () => {
  emit('update:visible', false)
  emit('cancel')
  currentStep.value = 0
}
</script>

<template>
  <Modal
    :open="visible"
    :title="title"
    width="1000px"
    :mask-closable="false"
    :footer="null"
    @cancel="handleCancel"
  >
    <Steps :current="currentStep" class="form-steps" size="small">
      <Step v-for="step in steps" :key="step.key" :title="step.title" />
    </Steps>

    <Form
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
      class="project-form"
    >
      <!-- ==================== 步骤1：项目基本信息 ==================== -->
      <div v-show="currentStep === 0">
        <!-- 项目基本信息 -->
        <Divider orientation="left">项目基本信息</Divider>
        <Row :gutter="16">
          <Col :span="12">
            <FormItem label="项目名称" name="projectName" required>
              <Input v-model:value="formState.projectName" placeholder="请输入项目名称" />
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="项目编号" name="projectCode">
              <Input v-model:value="formState.projectCode" placeholder="请输入项目编号" />
            </FormItem>
          </Col>
        </Row>
        
        <Row :gutter="16">
          <Col :span="8">
            <FormItem label="自定义预警" name="isCustomWarning">
              <RadioGroup v-model:value="formState.isCustomWarning">
                <Radio :value="true">是</Radio>
                <Radio :value="false">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col :span="16">
            <FormItem label="是否省领导牵头发送短信" name="isProvincialLead">
              <RadioGroup v-model:value="formState.isProvincialLead">
                <Radio :value="true">是</Radio>
                <Radio :value="false">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="16">
          <Col :span="12">
            <FormItem label="详细地址" name="address">
              <Input v-model:value="formState.address" placeholder="请输入详细地址" />
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="所属产业园区" name="industryPark">
              <Select
                v-model:value="formState.industryPark"
                placeholder="请选择产业园区"
                :options="industryParkOptions"
                allow-clear
              />
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="16">
          <Col :span="8">
            <FormItem label="所属重点产业链" name="industryChain">
              <Select
                v-model:value="formState.industryChain"
                placeholder="请选择产业链"
                :options="industryChainOptions"
                allow-clear
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="街道" name="street">
              <Select
                v-model:value="formState.street"
                placeholder="请选择街道"
                :options="streetOptions"
                allow-clear
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="项目批文类别" name="approvalCategory">
              <Select
                v-model:value="formState.approvalCategory"
                placeholder="请选择批文类别"
                :options="approvalCategoryOptions"
                allow-clear
              />
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="16">
          <Col :span="6">
            <FormItem label="计划竣工时间" name="plannedCompletionDate">
              <DatePicker
                v-model:value="formState.plannedCompletionDate"
                style="width: 100%"
                value-format="YYYY-MM-DD"
                placeholder="请选择"
              />
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="计划复工时间" name="plannedResumeDate">
              <DatePicker
                v-model:value="formState.plannedResumeDate"
                style="width: 100%"
                value-format="YYYY-MM-DD"
                placeholder="请选择"
              />
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="实际开工时间" name="actualStartDate">
              <DatePicker
                v-model:value="formState.actualStartDate"
                style="width: 100%"
                value-format="YYYY-MM-DD"
                placeholder="请选择"
              />
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="实际竣工时间" name="actualCompletionDate">
              <DatePicker
                v-model:value="formState.actualCompletionDate"
                style="width: 100%"
                value-format="YYYY-MM-DD"
                placeholder="请选择"
              />
            </FormItem>
          </Col>
        </Row>

        <FormItem label="建设内容及规模" name="constructionContent">
          <Textarea
            v-model:value="formState.constructionContent"
            :rows="3"
            placeholder="请输入建设内容及规模"
          />
        </FormItem>

        <!-- 项目责任信息 -->
        <Divider orientation="left">项目责任信息</Divider>
        <Row :gutter="16">
          <Col :span="8">
            <FormItem label="分管区领导" name="districtLeader">
              <Input v-model:value="formState.districtLeader" placeholder="请输入分管区领导" />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="牵头单位信息" name="leadUnitInfo">
              <Select
                v-model:value="formState.leadUnitInfo"
                placeholder="请选择"
                :options="unitOptions"
                allow-clear
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="牵头单位" name="leadUnit">
              <Select
                v-model:value="formState.leadUnit"
                placeholder="请选择"
                :options="unitOptions"
                allow-clear
              />
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="16">
          <Col :span="8">
            <FormItem label="业主单位" name="ownerUnit">
              <Select
                v-model:value="formState.ownerUnit"
                placeholder="请选择"
                :options="unitOptions"
                allow-clear
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="业主维护责任单位" name="ownerMaintenanceUnit">
              <Select
                v-model:value="formState.ownerMaintenanceUnit"
                placeholder="请选择"
                :options="unitOptions"
                allow-clear
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="信息维护单位联系人" name="maintenanceContact">
              <Input v-model:value="formState.maintenanceContact" placeholder="请输入联系人" />
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="16">
          <Col :span="8">
            <FormItem label="联系电话" name="maintenanceContactPhone">
              <Input v-model:value="formState.maintenanceContactPhone" placeholder="请输入联系电话" />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="行业主管部门" name="industryDepartment">
              <Input v-model:value="formState.industryDepartment" placeholder="请输入行业主管部门" />
            </FormItem>
          </Col>
        </Row>

        <!-- 项目分类信息 -->
        <Divider orientation="left">项目分类信息</Divider>
        <Row :gutter="16">
          <Col :span="6">
            <FormItem label="是否工程类项目" name="isEngineering">
              <RadioGroup v-model:value="formState.isEngineering">
                <Radio :value="true">是</Radio>
                <Radio :value="false">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="政府投资项目" name="isGovInvest">
              <RadioGroup v-model:value="formState.isGovInvest">
                <Radio :value="true">是</Radio>
                <Radio :value="false">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="投资类型" name="investType">
              <Select
                v-model:value="formState.investType"
                placeholder="请选择"
                :options="investTypeOptions"
                allow-clear
              />
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="投资类型" name="subInvestType">
              <CheckboxGroup
                v-model:value="formState.subInvestType"
                :options="subInvestTypeOptions"
              />
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="16">
          <Col :span="8">
            <FormItem label="签约时间" name="signingDate">
              <DatePicker
                v-model:value="formState.signingDate"
                style="width: 100%"
                value-format="YYYY-MM-DD"
                placeholder="请选择"
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="供地时间" name="landSupplyDate">
              <DatePicker
                v-model:value="formState.landSupplyDate"
                style="width: 100%"
                value-format="YYYY-MM-DD"
                placeholder="请选择"
              />
            </FormItem>
          </Col>
        </Row>
      </div>

      <!-- ==================== 步骤2：资金来源信息 ==================== -->
      <div v-show="currentStep === 1">
        <Divider orientation="left">资金来源信息</Divider>
        
        <div class="funding-summary">
          <FormItem label="项目总投资(万元)" class="total-investment-item">
            <InputNumber
              v-model:value="formState.totalInvestment"
              :disabled="true"
              :precision="2"
              style="width: 100%"
              :value="calculatedTotal"
            />
            <div class="hint">自动计算子项之和</div>
          </FormItem>
        </div>

        <Row :gutter="16">
          <Col :span="8">
            <FormItem label="其中工程建设费(万元)" name="engineeringCost">
              <InputNumber
                v-model:value="formState.engineeringCost"
                style="width: 100%"
                :precision="2"
                :min="0"
                placeholder="请输入"
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="其中拆迁及土地费(万元)" name="demolitionCost">
              <InputNumber
                v-model:value="formState.demolitionCost"
                style="width: 100%"
                :precision="2"
                :min="0"
                placeholder="请输入"
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="其他费用(万元)" name="otherCost">
              <InputNumber
                v-model:value="formState.otherCost"
                style="width: 100%"
                :precision="2"
                :min="0"
                placeholder="请输入"
              />
            </FormItem>
          </Col>
        </Row>

        <div class="calculation-preview">
          <div class="preview-title">投资构成预览</div>
          <div class="preview-content">
            <div class="preview-item">
              <span class="label">工程建设费:</span>
              <span class="value">{{ formState.engineeringCost || 0 }} 万元</span>
            </div>
            <div class="preview-item">
              <span class="label">拆迁及土地费:</span>
              <span class="value">{{ formState.demolitionCost || 0 }} 万元</span>
            </div>
            <div class="preview-item">
              <span class="label">其他费用:</span>
              <span class="value">{{ formState.otherCost || 0 }} 万元</span>
            </div>
            <div class="preview-item total">
              <span class="label">项目总投资:</span>
              <span class="value">{{ calculatedTotal }} 万元</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== 步骤3：项目年度信息 ==================== -->
      <div v-show="currentStep === 2">
        <Divider orientation="left">年度基本信息</Divider>
        <Row :gutter="16">
          <Col :span="8">
            <FormItem label="年度" name="year">
              <Select
                v-model:value="formState.year"
                placeholder="请选择年度"
                :options="yearOptions"
                allow-clear
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="四个一批" name="fourBatches">
              <Select
                v-model:value="formState.fourBatches"
                placeholder="系统自动生成"
                :options="fourBatchesOptions"
                disabled
                allow-clear
              />
              <div class="hint">根据项目状态自动生成</div>
            </FormItem>
          </Col>
        </Row>

        <Divider orientation="left">投资计划</Divider>
        <Row :gutter="16">
          <Col :span="8">
            <FormItem label="截止上年末累计完成投资(万元)" name="investToEndOfLastYear">
              <InputNumber
                v-model:value="formState.investToEndOfLastYear"
                style="width: 100%"
                :precision="2"
                :min="0"
                placeholder="请输入"
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="截止上年末剩余资金(万元)" name="balanceAtEndOfLastYear">
              <InputNumber
                v-model:value="formState.balanceAtEndOfLastYear"
                style="width: 100%"
                :precision="2"
                :min="0"
                placeholder="请输入"
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="本年计划投资(万元)" name="plannedInvestmentThisYear">
              <InputNumber
                v-model:value="formState.plannedInvestmentThisYear"
                style="width: 100%"
                :precision="2"
                :min="0"
                placeholder="请输入"
              />
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="16">
          <Col :span="8">
            <FormItem label="计划开工时间" name="plannedStartDate">
              <DatePicker
                v-model:value="formState.plannedStartDate"
                style="width: 100%"
                value-format="YYYY-MM-DD"
                placeholder="请选择"
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="计划竣工时间" name="plannedCompletionDateYear">
              <DatePicker
                v-model:value="formState.plannedCompletionDateYear"
                style="width: 100%"
                value-format="YYYY-MM-DD"
                placeholder="请选择"
              />
            </FormItem>
          </Col>
        </Row>

        <Divider orientation="left">建设计划</Divider>
        <FormItem label="建设计划" name="constructionPlan">
          <Textarea
            v-model:value="formState.constructionPlan"
            :rows="3"
            placeholder="请输入建设计划"
          />
        </FormItem>

        <FormItem label="建设资金安排" name="fundingArrangement">
          <Textarea
            v-model:value="formState.fundingArrangement"
            :rows="3"
            placeholder="请输入建设资金安排"
          />
        </FormItem>

        <FormItem label="本年计划形象进度" name="plannedProgressThisYear">
          <Textarea
            v-model:value="formState.plannedProgressThisYear"
            :rows="3"
            placeholder="请输入本年计划形象进度"
          />
        </FormItem>

        <Divider orientation="left">项目归属</Divider>
        <Row :gutter="16" class="affiliation-row">
          <Col :span="8">
            <FormItem label="区属" name="districtAffiliation">
              <RadioGroup v-model:value="formState.districtAffiliation">
                <Radio :value="true">是</Radio>
                <Radio :value="false">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="市属" name="cityAffiliation">
              <RadioGroup v-model:value="formState.cityAffiliation">
                <Radio :value="true">是</Radio>
                <Radio :value="false">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="省属" name="provinceAffiliation">
              <RadioGroup v-model:value="formState.provinceAffiliation">
                <Radio :value="true">是</Radio>
                <Radio :value="false">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>

        <FormItem label="目标任务(万元)" name="quarterlyGoal">
          <Textarea
            v-model:value="formState.quarterlyGoal"
            :rows="2"
            placeholder="请输入季度目标任务"
          />
        </FormItem>
      </div>
    </Form>

    <!-- 底部按钮 -->
    <div class="modal-footer">
      <Button v-if="currentStep > 0" @click="prevStep">上一步</Button>
      <Button v-if="currentStep < steps.length - 1" type="primary" @click="nextStep">下一步</Button>
      <Button v-if="currentStep === steps.length - 1" type="primary" @click="handleSubmit">提交</Button>
      <Button @click="handleCancel">取消</Button>
    </div>
  </Modal>
</template>

<style scoped>
.form-steps {
  margin-bottom: 24px;
}

.project-form {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;
}

.funding-summary {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.total-investment-item :deep(.ant-input-number) {
  background: #f5f5f5;
}

.hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.calculation-preview {
  margin-top: 24px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 8px;
  padding: 20px;
}

.preview-title {
  font-size: 14px;
  font-weight: 600;
  color: #096dd9;
  margin-bottom: 12px;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #d9d9d9;
}

.preview-item:last-child {
  border-bottom: none;
}

.preview-item.total {
  font-weight: 600;
  font-size: 16px;
  color: #1890ff;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 2px solid #1890ff;
}

.label {
  color: #666;
}

.value {
  color: #333;
  font-weight: 500;
}

.affiliation-row {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  padding: 16px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

:deep(.ant-divider) {
  margin: 16px 0;
}

:deep(.ant-divider-inner-text) {
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
}
</style>
