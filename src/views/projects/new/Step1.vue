<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { ProjectBasicInfo } from '@/types/project'
import { createProject, updateProject } from '@/api/project'
import {
  Form,
  FormItem,
  Input,
  Radio,
  RadioGroup,
  Select,
  DatePicker,
  Textarea,
  Button,
  Steps,
  Step,
  Card,
  message
} from 'ant-design-vue'

const router = useRouter()
const formRef = ref<InstanceType<typeof Form>>()
const loading = ref(false)

const formState = reactive<ProjectBasicInfo>({
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
  districtLeader: '',
  leadUnitInfo: undefined,
  leadUnit: undefined,
  ownerUnit: undefined,
  ownerMaintenanceUnit: undefined,
  maintenanceContact: '',
  maintenanceContactPhone: '',
  industryDepartment: '',
  isEngineering: false,
  isGovInvest: false,
  investType: undefined,
  signingDate: '',
  landSupplyDate: '',
  subInvestType: []
})

const rules = {
  projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }]
}

// 下拉选项
const industryParkOptions = [
  { label: '金牛高新技术产业园区', value: '1' },
  { label: '成都国际商贸城', value: '2' },
  { label: '其他园区', value: '3' }
]

const industryChainOptions = [
  { label: '电子信息', value: '1' },
  { label: '装备制造', value: '2' },
  { label: '生物医药', value: '3' },
  { label: '新材料', value: '4' }
]

const streetOptions = [
  { label: '抚琴街道', value: '1' },
  { label: '驷马桥街道', value: '2' },
  { label: '茶店子街道', value: '3' },
  { label: '九里堤街道', value: '4' }
]

const approvalCategoryOptions = [
  { label: '审批制', value: '1' },
  { label: '核准制', value: '2' },
  { label: '备案制', value: '3' }
]

const unitOptions = [
  { label: '区发改局', value: '1' },
  { label: '区住建局', value: '2' },
  { label: '区经信局', value: '3' },
  { label: '区商务局', value: '4' }
]

const investTypeOptions = [
  { label: '工业项目', value: '1' },
  { label: '其他项目', value: '2' }
]

const subInvestTypeOptions = [
  { label: '市政类项目', value: '1' },
  { label: '房建类项目', value: '2' }
]

const currentStep = 0

const handleNext = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true

    // 创建项目并保存基本信息
    const { id } = await createProject()
    await updateProject(id, { basicInfo: formState })

    message.success('保存成功')
    router.push(`/projects/new/step2?id=${id}`)
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
    const { id } = await createProject()
    await updateProject(id, { basicInfo: formState })
    message.success('草稿保存成功')
  } catch (error) {
    message.error('保存失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="project-step1">
    <Card title="创建新项目" class="form-card">
      <Steps :current="currentStep" class="steps">
        <Step title="项目基本信息" />
        <Step title="资金来源信息" />
        <Step title="项目年度信息" />
      </Steps>

      <Form
        ref="formRef"
        :model="formState"
        :rules="rules"
        layout="vertical"
        class="project-form"
      >
        <!-- 项目基本信息 -->
        <div class="section-title">项目基本信息</div>
        <div class="form-row">
          <FormItem label="项目名称" name="projectName" class="form-item-lg">
            <Input v-model:value="formState.projectName" placeholder="请输入项目名称" />
          </FormItem>
          <FormItem label="项目编号" name="projectCode" class="form-item-md">
            <Input v-model:value="formState.projectCode" placeholder="请输入项目编号" />
          </FormItem>
        </div>

        <div class="form-row">
          <FormItem label="自定义预警" name="isCustomWarning" class="form-item-sm">
            <RadioGroup v-model:value="formState.isCustomWarning">
              <Radio :value="true">是</Radio>
              <Radio :value="false">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="是否省领导牵头发送短信" name="isProvincialLead" class="form-item-md">
            <RadioGroup v-model:value="formState.isProvincialLead">
              <Radio :value="true">是</Radio>
              <Radio :value="false">否</Radio>
            </RadioGroup>
          </FormItem>
        </div>

        <div class="form-row">
          <FormItem label="详细地址" name="address" class="form-item-lg">
            <Input v-model:value="formState.address" placeholder="请输入详细地址" />
          </FormItem>
          <FormItem label="所属产业园区" name="industryPark" class="form-item-md">
            <Select
              v-model:value="formState.industryPark"
              placeholder="请选择"
              :options="industryParkOptions"
              allow-clear
            />
          </FormItem>
        </div>

        <div class="form-row">
          <FormItem label="所属重点产业链" name="industryChain" class="form-item-md">
            <Select
              v-model:value="formState.industryChain"
              placeholder="请选择"
              :options="industryChainOptions"
              allow-clear
            />
          </FormItem>
          <FormItem label="街道" name="street" class="form-item-md">
            <Select
              v-model:value="formState.street"
              placeholder="请选择"
              :options="streetOptions"
              allow-clear
            />
          </FormItem>
          <FormItem label="项目批文类别" name="approvalCategory" class="form-item-md">
            <Select
              v-model:value="formState.approvalCategory"
              placeholder="请选择"
              :options="approvalCategoryOptions"
              allow-clear
            />
          </FormItem>
        </div>

        <div class="form-row">
          <FormItem label="计划竣工时间" name="plannedCompletionDate" class="form-item-md">
            <DatePicker
              v-model:value="formState.plannedCompletionDate"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </FormItem>
          <FormItem label="计划复工时间" name="plannedResumeDate" class="form-item-md">
            <DatePicker
              v-model:value="formState.plannedResumeDate"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </FormItem>
          <FormItem label="实际开工时间" name="actualStartDate" class="form-item-md">
            <DatePicker
              v-model:value="formState.actualStartDate"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </FormItem>
        </div>

        <div class="form-row">
          <FormItem label="实际竣工时间" name="actualCompletionDate" class="form-item-md">
            <DatePicker
              v-model:value="formState.actualCompletionDate"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </FormItem>
        </div>

        <FormItem label="建设内容及规模" name="constructionContent">
          <Textarea
            v-model:value="formState.constructionContent"
            :rows="4"
            placeholder="请输入建设内容及规模"
          />
        </FormItem>

        <!-- 项目责任信息 -->
        <div class="section-title">项目责任信息</div>
        <div class="form-row">
          <FormItem label="分管区领导" name="districtLeader" class="form-item-md">
            <Input v-model:value="formState.districtLeader" placeholder="请输入分管区领导" />
          </FormItem>
          <FormItem label="牵头单位信息" name="leadUnitInfo" class="form-item-md">
            <Select
              v-model:value="formState.leadUnitInfo"
              placeholder="请选择"
              :options="unitOptions"
              allow-clear
            />
          </FormItem>
          <FormItem label="牵头单位" name="leadUnit" class="form-item-md">
            <Select
              v-model:value="formState.leadUnit"
              placeholder="请选择"
              :options="unitOptions"
              allow-clear
            />
          </FormItem>
        </div>

        <div class="form-row">
          <FormItem label="业主单位" name="ownerUnit" class="form-item-md">
            <Select
              v-model:value="formState.ownerUnit"
              placeholder="请选择"
              :options="unitOptions"
              allow-clear
            />
          </FormItem>
          <FormItem label="业主维护责任单位" name="ownerMaintenanceUnit" class="form-item-md">
            <Select
              v-model:value="formState.ownerMaintenanceUnit"
              placeholder="请选择"
              :options="unitOptions"
              allow-clear
            />
          </FormItem>
          <FormItem label="信息维护单位联系人" name="maintenanceContact" class="form-item-md">
            <Input v-model:value="formState.maintenanceContact" placeholder="请输入联系人" />
          </FormItem>
        </div>

        <div class="form-row">
          <FormItem label="联系电话" name="maintenanceContactPhone" class="form-item-md">
            <Input v-model:value="formState.maintenanceContactPhone" placeholder="请输入联系电话" />
          </FormItem>
          <FormItem label="行业主管部门" name="industryDepartment" class="form-item-md">
            <Input v-model:value="formState.industryDepartment" placeholder="请输入行业主管部门" />
          </FormItem>
        </div>

        <!-- 项目分类信息 -->
        <div class="section-title">项目分类信息</div>
        <div class="form-row">
          <FormItem label="是否工程类项目" name="isEngineering" class="form-item-sm">
            <RadioGroup v-model:value="formState.isEngineering">
              <Radio :value="true">是</Radio>
              <Radio :value="false">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="政府投资项目" name="isGovInvest" class="form-item-sm">
            <RadioGroup v-model:value="formState.isGovInvest">
              <Radio :value="true">是</Radio>
              <Radio :value="false">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="投资类型" name="investType" class="form-item-md">
            <Select
              v-model:value="formState.investType"
              placeholder="请选择"
              :options="investTypeOptions"
              allow-clear
            />
          </FormItem>
        </div>

        <div class="form-row">
          <FormItem label="签约时间" name="signingDate" class="form-item-md">
            <DatePicker
              v-model:value="formState.signingDate"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </FormItem>
          <FormItem label="供地时间" name="landSupplyDate" class="form-item-md">
            <DatePicker
              v-model:value="formState.landSupplyDate"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </FormItem>
          <FormItem label="投资类型" name="subInvestType" class="form-item-md">
            <Select
              v-model:value="formState.subInvestType"
              mode="multiple"
              placeholder="请选择"
              :options="subInvestTypeOptions"
              allow-clear
            />
          </FormItem>
        </div>

        <div class="form-actions">
          <Button @click="handleSave" :loading="loading">保存草稿</Button>
          <Button type="primary" @click="handleNext" :loading="loading">下一步</Button>
        </div>
      </Form>
    </Card>
  </div>
</template>

<style scoped>
.project-step1 {
  padding: 24px;
  max-width: 1200px;
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

.form-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.form-item-lg {
  flex: 2;
  min-width: 300px;
}

.form-item-md {
  flex: 1;
  min-width: 200px;
}

.form-item-sm {
  flex: 0.5;
  min-width: 150px;
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
