<script setup lang="ts">
import { ref, watch } from 'vue'
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
  Upload,
  Steps,
  Step,
  Button,
  Row,
  Col,
  message
} from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import type { UploadProps } from 'ant-design-vue'

interface Props {
  visible: boolean
  record?: any
}

const props = defineProps<Props>()
const emit = defineEmits(['update:visible', 'ok'])

const formRef = ref<InstanceType<typeof Form>>()
const currentStep = ref(0)

const formState = ref({
  // 进度概况
  progressStatus: '正常',
  constructionPhase: '',
  
  // 许可证情况
  hasLandPermit: false,
  hasPlanningPermit: false,
  hasConstructionPermit: false,
  
  // 投资完成情况
  completedInvestmentThisMonth: undefined,
  totalCompletedInvestment: undefined,
  remainingInvestment: undefined,
  landAcquiredThisYear: undefined,
  
  // 进度详情
  monthlyProgress: '',
  issues: '',
  nextStepPlan: '',
  progressImages: []
})

// 监听编辑记录变化
watch(() => props.record, (newVal) => {
  if (newVal) {
    formState.value = { 
      ...formState.value,
      projectCode: newVal.projectCode,
      projectName: newVal.projectName
    }
  }
}, { immediate: true })

// 建设阶段选项
const phaseOptions = [
  { label: '前期规划', value: 'planning' },
  { label: '拆迁安置', value: 'demolition' },
  { label: '基础施工', value: 'foundation' },
  { label: '主体建设', value: 'main' },
  { label: '装修装饰', value: 'decoration' },
  { label: '竣工验收', value: 'completion' }
]

// 上传配置
const uploadProps: UploadProps = {
  name: 'file',
  action: '/api/upload',
  headers: { authorization: 'authorization-text' },
  onChange(info) {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`)
    }
  }
}

const steps = [
  { title: '进度概况', key: 'overview' },
  { title: '投资完成', key: 'investment' },
  { title: '进度详情', key: 'detail' }
]

const handleOk = async () => {
  try {
    await formRef.value?.validate()
    emit('ok', formState.value)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const handleCancel = () => {
  emit('update:visible', false)
}

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}
</script>

<template>
  <Modal
    :open="visible"
    title="填报项目进度"
    width="800px"
    :mask-closable="false"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <Steps :current="currentStep" class="form-steps" size="small">
      <Step v-for="step in steps" :key="step.key" :title="step.title" />
    </Steps>

    <Form
      ref="formRef"
      :model="formState"
      layout="vertical"
      class="progress-form"
    >
      <!-- 第一步：进度概况 -->
      <div v-show="currentStep === 0">
        <Row :gutter="16">
          <Col :span="12">
            <FormItem label="项目进度情况" name="progressStatus">
              <RadioGroup v-model:value="formState.progressStatus">
                <Radio value="正常">正常</Radio>
                <Radio value="滞后">滞后</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="建设阶段" name="constructionPhase">
              <Select
                v-model:value="formState.constructionPhase"
                placeholder="请选择建设阶段"
                :options="phaseOptions"
                allow-clear
              />
            </FormItem>
          </Col>
        </Row>
        
        <div class="permits-section">
          <div class="section-title">许可证办理情况</div>
          <Row :gutter="16">
            <Col :span="8">
              <FormItem label="是否取得国土证" name="hasLandPermit">
                <RadioGroup v-model:value="formState.hasLandPermit">
                  <Radio :value="true">是</Radio>
                  <Radio :value="false">否</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col :span="8">
              <FormItem label="是否取得建设规划许可证" name="hasPlanningPermit">
                <RadioGroup v-model:value="formState.hasPlanningPermit">
                  <Radio :value="true">是</Radio>
                  <Radio :value="false">否</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col :span="8">
              <FormItem label="是否取得施工许可证" name="hasConstructionPermit">
                <RadioGroup v-model:value="formState.hasConstructionPermit">
                  <Radio :value="true">是</Radio>
                  <Radio :value="false">否</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
        </div>
      </div>

      <!-- 第二步：投资完成 -->
      <div v-show="currentStep === 1">
        <Row :gutter="16">
          <Col :span="12">
            <FormItem label="本月完成投资(万元)" name="completedInvestmentThisMonth">
              <InputNumber
                v-model:value="formState.completedInvestmentThisMonth"
                style="width: 100%"
                :precision="2"
                :min="0"
                placeholder="请输入本月完成投资"
              />
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="项目累计完成投资(万元)" name="totalCompletedInvestment">
              <InputNumber
                v-model:value="formState.totalCompletedInvestment"
                style="width: 100%"
                :precision="2"
                :min="0"
                placeholder="请输入累计完成投资"
              />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col :span="12">
            <FormItem label="项目剩余投资(万元)" name="remainingInvestment">
              <InputNumber
                v-model:value="formState.remainingInvestment"
                style="width: 100%"
                :precision="2"
                :min="0"
                placeholder="请输入剩余投资"
              />
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="本年累计解决土地(亩)" name="landAcquiredThisYear">
              <InputNumber
                v-model:value="formState.landAcquiredThisYear"
                style="width: 100%"
                :precision="2"
                :min="0"
                placeholder="请输入解决土地面积"
              />
            </FormItem>
          </Col>
        </Row>
      </div>

      <!-- 第三步：进度详情 -->
      <div v-show="currentStep === 2">
        <FormItem label="本月进展" name="monthlyProgress">
          <Textarea
            v-model:value="formState.monthlyProgress"
            :rows="3"
            placeholder="请描述本月项目进展情况"
          />
        </FormItem>
        
        <FormItem label="上传进度图片" name="progressImages">
          <Upload v-bind="uploadProps" list-type="picture-card">
            <div>
              <UploadOutlined />
              <div style="margin-top: 8px">上传图片</div>
            </div>
          </Upload>
        </FormItem>
        
        <FormItem label="存在的问题" name="issues">
          <Textarea
            v-model:value="formState.issues"
            :rows="3"
            placeholder="请描述项目存在的问题及困难"
          />
        </FormItem>
        
        <FormItem label="下一步计划" name="nextStepPlan">
          <Textarea
            v-model:value="formState.nextStepPlan"
            :rows="3"
            placeholder="请描述下一步工作计划"
          />
        </FormItem>
      </div>
    </Form>

    <template #footer>
      <div class="modal-footer">
        <Button v-if="currentStep > 0" @click="prevStep">上一步</Button>
        <Button v-if="currentStep < steps.length - 1" type="primary" @click="nextStep">下一步</Button>
        <Button v-if="currentStep === steps.length - 1" type="primary" @click="handleOk">提交报送</Button>
        <Button @click="handleCancel">取消</Button>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
.form-steps {
  margin-bottom: 24px;
}

.progress-form {
  min-height: 350px;
}

.permits-section {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #52c41a;
  margin-bottom: 12px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

:deep(.ant-upload-select-picture-card) {
  width: 100px;
  height: 100px;
}
</style>
