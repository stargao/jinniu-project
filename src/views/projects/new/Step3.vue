<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { AnnualInfo } from '@/types/project'
import { updateProject, submitProject } from '@/api/project'
import {
  Form,
  FormItem,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Textarea,
  Radio,
  RadioGroup,
  Button,
  Steps,
  Step,
  Card,
  message
} from 'ant-design-vue'

const router = useRouter()
const route = useRoute()
const formRef = ref<InstanceType<typeof Form>>()
const loading = ref(false)
const projectId = route.query.id as string

const formState = reactive<AnnualInfo>({
  year: undefined,
  fourBatches: '',
  investToEndOfLastYear: undefined,
  balanceAtEndOfLastYear: undefined,
  plannedInvestmentThisYear: undefined,
  plannedStartDate: '',
  plannedCompletionDate: '',
  constructionPlan: '',
  fundingArrangement: '',
  plannedProgressThisYear: '',
  districtAffiliation: false,
  cityAffiliation: false,
  provinceAffiliation: false,
  quarterlyGoal: ''
})

// 下拉选项
const yearOptions = [
  { label: '2024年', value: '2024' },
  { label: '2025年', value: '2025' },
  { label: '2026年', value: '2026' }
]

const fourBatchesOptions = [
  { label: '策划储备', value: '1' },
  { label: '落地开工', value: '2' },
  { label: '加快建设', value: '3' },
  { label: '竣工投产', value: '4' }
]

const currentStep = 2

const handlePrev = () => {
  router.push(`/projects/new/step2?id=${projectId}`)
}

const handleSave = async () => {
  try {
    loading.value = true
    await updateProject(projectId, { annualInfo: formState })
    message.success('草稿保存成功')
  } catch (error) {
    message.error('保存失败')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true

    await updateProject(projectId, { annualInfo: formState })
    await submitProject(projectId)

    message.success('项目提交成功')
    router.push('/projects')
  } catch (error) {
    console.error('提交失败:', error)
    message.error('提交失败，请检查表单')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="project-step3">
    <Card title="创建新项目 - 年度信息" class="form-card">
      <Steps :current="currentStep" class="steps">
        <Step title="项目基本信息" />
        <Step title="资金来源信息" />
        <Step title="项目年度信息" />
      </Steps>

      <Form
        ref="formRef"
        :model="formState"
        layout="vertical"
        class="project-form"
      >
        <div class="section-title">年度基本信息</div>
        <div class="form-row">
          <FormItem label="年度" name="year" class="form-item-md">
            <Select
              v-model:value="formState.year"
              placeholder="请选择年度"
              :options="yearOptions"
              allow-clear
            />
          </FormItem>
          <FormItem label="四个一批" name="fourBatches" class="form-item-md">
            <Select
              v-model:value="formState.fourBatches"
              placeholder="系统自动生成"
              :options="fourBatchesOptions"
              disabled
              allow-clear
            />
            <div class="hint">根据项目状态自动生成</div>
          </FormItem>
        </div>

        <div class="section-title">投资计划</div>
        <div class="form-row">
          <FormItem label="截止上年末累计完成投资(万元)" name="investToEndOfLastYear" class="form-item-md">
            <InputNumber
              v-model:value="formState.investToEndOfLastYear"
              :precision="2"
              :min="0"
              style="width: 100%"
              placeholder="请输入"
            />
          </FormItem>
          <FormItem label="截止上年末剩余资金(万元)" name="balanceAtEndOfLastYear" class="form-item-md">
            <InputNumber
              v-model:value="formState.balanceAtEndOfLastYear"
              :precision="2"
              :min="0"
              style="width: 100%"
              placeholder="请输入"
            />
          </FormItem>
          <FormItem label="本年计划投资(万元)" name="plannedInvestmentThisYear" class="form-item-md">
            <InputNumber
              v-model:value="formState.plannedInvestmentThisYear"
              :precision="2"
              :min="0"
              style="width: 100%"
              placeholder="请输入"
            />
          </FormItem>
        </div>

        <div class="form-row">
          <FormItem label="计划开工时间" name="plannedStartDate" class="form-item-md">
            <DatePicker
              v-model:value="formState.plannedStartDate"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </FormItem>
          <FormItem label="计划竣工时间" name="plannedCompletionDate" class="form-item-md">
            <DatePicker
              v-model:value="formState.plannedCompletionDate"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </FormItem>
        </div>

        <div class="section-title">建设计划</div>
        <FormItem label="建设计划" name="constructionPlan">
          <Textarea
            v-model:value="formState.constructionPlan"
            :rows="4"
            placeholder="请输入建设计划"
          />
        </FormItem>

        <FormItem label="建设资金安排" name="fundingArrangement">
          <Textarea
            v-model:value="formState.fundingArrangement"
            :rows="4"
            placeholder="请输入建设资金安排"
          />
        </FormItem>

        <FormItem label="本年计划形象进度" name="plannedProgressThisYear">
          <Textarea
            v-model:value="formState.plannedProgressThisYear"
            :rows="4"
            placeholder="请输入本年计划形象进度"
          />
        </FormItem>

        <div class="section-title">项目归属</div>
        <div class="form-row affiliation-row">
          <FormItem label="区属" name="districtAffiliation" class="form-item-sm">
            <RadioGroup v-model:value="formState.districtAffiliation">
              <Radio :value="true">是</Radio>
              <Radio :value="false">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="市属" name="cityAffiliation" class="form-item-sm">
            <RadioGroup v-model:value="formState.cityAffiliation">
              <Radio :value="true">是</Radio>
              <Radio :value="false">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="省属" name="provinceAffiliation" class="form-item-sm">
            <RadioGroup v-model:value="formState.provinceAffiliation">
              <Radio :value="true">是</Radio>
              <Radio :value="false">否</Radio>
            </RadioGroup>
          </FormItem>
        </div>

        <div class="section-title">季度目标</div>
        <FormItem label="目标任务(万元)" name="quarterlyGoal">
          <Textarea
            v-model:value="formState.quarterlyGoal"
            :rows="3"
            placeholder="请输入季度目标任务"
          />
        </FormItem>

        <div class="form-actions">
          <Button @click="handlePrev">上一步</Button>
          <Button @click="handleSave" :loading="loading">保存草稿</Button>
          <Button type="primary" @click="handleSubmit" :loading="loading">提交审核</Button>
        </div>
      </Form>
    </Card>
  </div>
</template>

<style scoped>
.project-step3 {
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.form-card {
  background: #fff;
}

.steps {
  margin-bottom: 32px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
  margin: 24px 0 16px;
  padding-left: 12px;
  border-left: 4px solid #1890ff;
}

.section-title:first-of-type {
  margin-top: 0;
}

.form-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.form-item-md {
  flex: 1;
  min-width: 250px;
}

.form-item-sm {
  flex: 1;
  min-width: 150px;
}

.affiliation-row {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  padding: 16px;
}

.hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}
</style>
