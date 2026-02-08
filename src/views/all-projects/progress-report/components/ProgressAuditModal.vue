<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Modal,
  Form,
  FormItem,
  Radio,
  RadioGroup,
  Textarea,
  Descriptions,
  DescriptionsItem,
  Tag,
  message
} from 'ant-design-vue'

interface Props {
  visible: boolean
  record?: any
}

const props = defineProps<Props>()
const emit = defineEmits(['update:visible', 'ok'])

const formRef = ref<InstanceType<typeof Form>>()

const formState = ref({
  auditResult: 'pass',
  auditOpinion: '',
  rejectReason: ''
})

// 监听编辑记录变化
watch(() => props.record, (newVal) => {
  if (newVal) {
    formState.value = {
      auditResult: 'pass',
      auditOpinion: '',
      rejectReason: ''
    }
  }
}, { immediate: true })

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
</script>

<template>
  <Modal
    :open="visible"
    title="进度审核"
    width="700px"
    :mask-closable="false"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <!-- 项目信息展示 -->
    <Descriptions title="项目信息" bordered :column="2" size="small" class="info-section">
      <DescriptionsItem label="项目编号">{{ record?.projectCode }}</DescriptionsItem>
      <DescriptionsItem label="项目名称">{{ record?.projectName }}</DescriptionsItem>
      <DescriptionsItem label="报送月份">{{ record?.reportMonth }}</DescriptionsItem>
      <DescriptionsItem label="建设阶段">{{ record?.phase }}</DescriptionsItem>
      <DescriptionsItem label="本月完成投资">{{ record?.monthInvestment }} 万元</DescriptionsItem>
      <DescriptionsItem label="累计完成投资">{{ record?.totalInvestment }} 万元</DescriptionsItem>
      <DescriptionsItem label="进度状态">
        <Tag :color="record?.status === '正常' ? 'success' : 'error'">
          {{ record?.status }}
        </Tag>
      </DescriptionsItem>
    </Descriptions>

    <!-- 审核表单 -->
    <Form
      ref="formRef"
      :model="formState"
      layout="vertical"
      class="audit-form"
    >
      <FormItem
        label="审核结果"
        name="auditResult"
        :rules="[{ required: true, message: '请选择审核结果' }]"
      >
        <RadioGroup v-model:value="formState.auditResult">
          <Radio value="pass">通过</Radio>
          <Radio value="reject">退回</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem
        v-if="formState.auditResult === 'reject'"
        label="退回原因"
        name="rejectReason"
        :rules="[{ required: true, message: '请输入退回原因' }]"
      >
        <Textarea
          v-model:value="formState.rejectReason"
          :rows="3"
          placeholder="请输入退回原因"
        />
      </FormItem>

      <FormItem
        label="审核意见"
        name="auditOpinion"
      >
        <Textarea
          v-model:value="formState.auditOpinion"
          :rows="3"
          placeholder="请输入审核意见（可选）"
        />
      </FormItem>
    </Form>
  </Modal>
</template>

<style scoped>
.info-section {
  margin-bottom: 24px;
}

.audit-form {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
}
</style>
