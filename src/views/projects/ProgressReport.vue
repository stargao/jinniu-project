<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ProgressReport as ProgressReportType } from '@/types/project'
import { submitProgressReport } from '@/api/project'
import {
  Form,
  FormItem,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  Textarea,
  Button,
  Card,
  Steps,
  Upload,
  message,
  type UploadProps
} from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const projectId = route.params.id as string
const formRef = ref<InstanceType<typeof Form>>()
const loading = ref(false)

const formState = reactive<ProgressReportType>({
  progressStatus: '正常',
  constructionPhase: '',
  hasLandPermit: false,
  hasPlanningPermit: false,
  hasConstructionPermit: false,
  completedInvestmentThisMonth: undefined,
  totalCompletedInvestment: undefined,
  remainingInvestment: undefined,
  monthlyProgress: '',
  progressImages: [],
  issues: '',
  nextStepPlan: '',
  landAcquiredThisYear: undefined
})

// 建设阶段选项
const constructionPhases = [
  { title: '前期规划', description: '项目立项、规划审批' },
  { title: '拆迁安置', description: '土地征收、居民安置' },
  { title: '基础施工', description: '地基处理、基础建设' },
  { title: '主体建设', description: '主体结构施工' },
  { title: '装修装饰', description: '内外装修、设备安装' },
  { title: '竣工验收', description: '项目验收、交付使用' }
]

const currentPhase = ref(0)

const handlePhaseChange = (index: number) => {
  currentPhase.value = index
  formState.constructionPhase = constructionPhases[index].title
}

const uploadProps: UploadProps = {
  name: 'file',
  action: '/api/upload',
  headers: {
    authorization: 'authorization-text'
  },
  onChange(info) {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`)
      if (info.file.response?.url) {
        formState.progressImages?.push(info.file.response.url)
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`)
    }
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true

    await submitProgressReport(projectId, formState)

    message.success('进度报送成功')
    router.push('/projects')
  } catch (error) {
    console.error('报送失败:', error)
    message.error('报送失败，请检查表单')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.back()
}
</script>

<template>
  <div class="progress-report">
    <Card title="项目进度报送" class="form-card">
      <Form
        ref="formRef"
        :model="formState"
        layout="vertical"
        class="report-form"
      >
        <!-- 进度概况 -->
        <div class="section-title">进度概况</div>
        <div class="form-row">
          <FormItem label="项目进度情况" name="progressStatus" class="form-item-md">
            <RadioGroup v-model:value="formState.progressStatus">
              <Radio value="正常">正常</Radio>
              <Radio value="滞后">滞后</Radio>
            </RadioGroup>
          </FormItem>
        </div>

        <!-- 建设阶段 -->
        <FormItem label="建设阶段" name="constructionPhase">
          <div class="phase-steps">
            <Steps
              :current="currentPhase"
              direction="horizontal"
              size="small"
              @change="handlePhaseChange"
            >
              <Step
                v-for="(phase, index) in constructionPhases"
                :key="index"
                :title="phase.title"
                :description="phase.description"
                @click="handlePhaseChange(index)"
              />
            </Steps>
          </div>
        </FormItem>

        <!-- 许可证情况 -->
        <div class="section-title">许可证办理情况</div>
        <div class="form-row permits-row">
          <FormItem label="是否取得国土证" name="hasLandPermit" class="form-item-sm">
            <RadioGroup v-model:value="formState.hasLandPermit">
              <Radio :value="true">是</Radio>
              <Radio :value="false">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="是否取得建设规划许可证" name="hasPlanningPermit" class="form-item-sm">
            <RadioGroup v-model:value="formState.hasPlanningPermit">
              <Radio :value="true">是</Radio>
              <Radio :value="false">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="是否取得施工许可证" name="hasConstructionPermit" class="form-item-sm">
            <RadioGroup v-model:value="formState.hasConstructionPermit">
              <Radio :value="true">是</Radio>
              <Radio :value="false">否</Radio>
            </RadioGroup>
          </FormItem>
        </div>

        <!-- 投资完成情况 -->
        <div class="section-title">投资完成情况</div>
        <div class="form-row">
          <FormItem label="本月完成投资(万元)" name="completedInvestmentThisMonth" class="form-item-md">
            <InputNumber
              v-model:value="formState.completedInvestmentThisMonth"
              :precision="2"
              :min="0"
              style="width: 100%"
              placeholder="请输入"
            />
          </FormItem>
          <FormItem label="项目累计完成投资(万元)" name="totalCompletedInvestment" class="form-item-md">
            <InputNumber
              v-model:value="formState.totalCompletedInvestment"
              :precision="2"
              :min="0"
              style="width: 100%"
              placeholder="请输入"
            />
          </FormItem>
          <FormItem label="项目剩余投资(万元)" name="remainingInvestment" class="form-item-md">
            <InputNumber
              v-model:value="formState.remainingInvestment"
              :precision="2"
              :min="0"
              style="width: 100%"
              placeholder="请输入"
            />
          </FormItem>
        </div>

        <div class="form-row">
          <FormItem label="本年累计解决土地(亩)" name="landAcquiredThisYear" class="form-item-md">
            <InputNumber
              v-model:value="formState.landAcquiredThisYear"
              :precision="2"
              :min="0"
              style="width: 100%"
              placeholder="请输入"
            />
          </FormItem>
        </div>

        <!-- 进度详情 -->
        <div class="section-title">进度详情</div>
        <FormItem label="本月进展" name="monthlyProgress">
          <Textarea
            v-model:value="formState.monthlyProgress"
            :rows="4"
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
            :rows="4"
            placeholder="请描述项目存在的问题及困难"
          />
        </FormItem>

        <FormItem label="下一步计划" name="nextStepPlan">
          <Textarea
            v-model:value="formState.nextStepPlan"
            :rows="4"
            placeholder="请描述下一步工作计划"
          />
        </FormItem>

        <div class="form-actions">
          <Button @click="handleCancel">取消</Button>
          <Button type="primary" @click="handleSubmit" :loading="loading">提交报送</Button>
        </div>
      </Form>
    </Card>
  </div>
</template>

<style scoped>
.progress-report {
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.form-card {
  background: #fff;
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
  min-width: 200px;
}

.permits-row {
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 8px;
  padding: 16px;
}

.phase-steps {
  padding: 16px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
}

.phase-steps :deep(.ant-steps-item) {
  cursor: pointer;
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

:deep(.ant-upload-select-picture-card) {
  width: 120px;
  height: 120px;
}
</style>
