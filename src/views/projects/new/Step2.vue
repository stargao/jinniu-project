<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FundingSource } from '@/types/project'
import { updateProject } from '@/api/project'
import {
  Form,
  FormItem,
  InputNumber,
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

const formState = reactive<FundingSource>({
  totalInvestment: undefined,
  engineeringCost: undefined,
  demolitionCost: undefined,
  otherCost: undefined
})

// 自动计算总投资
const calculatedTotal = computed(() => {
  const eng = formState.engineeringCost || 0
  const demo = formState.demolitionCost || 0
  const other = formState.otherCost || 0
  return eng + demo + other
})

// 监听子项变化，自动更新总投资
watch(calculatedTotal, (newVal) => {
  formState.totalInvestment = newVal
})

const currentStep = 1

const handlePrev = () => {
  router.push(`/projects/new/step1?id=${projectId}`)
}

const handleNext = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true

    await updateProject(projectId, { fundingSource: formState })

    message.success('保存成功')
    router.push(`/projects/new/step3?id=${projectId}`)
  } catch (error) {
    console.error('保存失败:', error)
    message.error('保存失败，请检查表单')
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  try {
    loading.value = true
    await updateProject(projectId, { fundingSource: formState })
    message.success('草稿保存成功')
  } catch (error) {
    message.error('保存失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="project-step2">
    <Card title="创建新项目 - 资金来源" class="form-card">
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
        <div class="section-title">资金来源信息</div>

        <div class="funding-form">
          <FormItem label="项目总投资(万元)" class="total-investment">
            <InputNumber
              v-model:value="formState.totalInvestment"
              :disabled="true"
              :precision="2"
              style="width: 100%"
              placeholder="自动计算"
            />
            <div class="hint">自动计算子项之和</div>
          </FormItem>

          <div class="sub-items">
            <FormItem label="其中工程建设费(万元)">
              <InputNumber
                v-model:value="formState.engineeringCost"
                :precision="2"
                :min="0"
                style="width: 100%"
                placeholder="请输入工程建设费"
              />
            </FormItem>

            <FormItem label="其中拆迁及土地费(万元)">
              <InputNumber
                v-model:value="formState.demolitionCost"
                :precision="2"
                :min="0"
                style="width: 100%"
                placeholder="请输入拆迁及土地费"
              />
            </FormItem>

            <FormItem label="其他费用(万元)">
              <InputNumber
                v-model:value="formState.otherCost"
                :precision="2"
                :min="0"
                style="width: 100%"
                placeholder="请输入其他费用"
              />
            </FormItem>
          </div>
        </div>

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

        <div class="form-actions">
          <Button @click="handlePrev">上一步</Button>
          <Button @click="handleSave" :loading="loading">保存草稿</Button>
          <Button type="primary" @click="handleNext" :loading="loading">下一步</Button>
        </div>
      </Form>
    </Card>
  </div>
</template>

<style scoped>
.project-step2 {
  padding: 24px;
  max-width: 800px;
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
  margin: 0 0 24px;
  padding-left: 12px;
  border-left: 4px solid #1890ff;
}

.funding-form {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  padding: 24px;
}

.total-investment {
  margin-bottom: 24px;
}

.total-investment :deep(.ant-input-number) {
  background: #f5f5f5;
}

.hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.sub-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
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

.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

@media (max-width: 768px) {
  .sub-items {
    grid-template-columns: 1fr;
  }
}
</style>
