<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  Card,
  Form,
  FormItem,
  Input,
  Switch,
  Button,
  Tabs,
  TabPane,
  Select,
  TimePicker,
  Checkbox,
  CheckboxGroup,
  message
} from 'ant-design-vue'
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons-vue'

// 短信提醒设置
const reminderSettings = reactive({
  enableAuditReminder: true,
  enableReturnReminder: true,
  enableProgressReminder: false,
  reminderTime: '09:00',
  reminderFrequency: 'daily'
})

// 短信模板设置
const templateSettings = reactive({
  auditTemplate: '您的项目【{projectName}】已审核通过，请登录系统查看详情。',
  returnTemplate: '您的项目【{projectName}】已被退回，原因：{reason}，请登录系统修改。',
  progressTemplate: '请按时报送项目【{projectName}】的进度信息。'
})

// 接收人设置
const receiverSettings = reactive({
  notifyProjectUnit: true,
  notifyLeadUnit: true,
  notifyDistrictLeader: false,
  customReceivers: []
})

// 选项数据
const frequencyOptions = [
  { label: '每天', value: 'daily' },
  { label: '每周', value: 'weekly' },
  { label: '每月', value: 'monthly' }
]

const receiverOptions = [
  { label: '项目单位负责人', value: 'project' },
  { label: '牵头单位负责人', value: 'lead' },
  { label: '分管领导', value: 'leader' }
]

// 保存设置
const handleSave = () => {
  message.success('设置保存成功')
}

// 重置设置
const handleReset = () => {
  reminderSettings.enableAuditReminder = true
  reminderSettings.enableReturnReminder = true
  reminderSettings.enableProgressReminder = false
  reminderSettings.reminderTime = '09:00'
  reminderSettings.reminderFrequency = 'daily'
  message.info('设置已重置')
}
</script>

<template>
  <div class="sms-settings">
    <Card title="短信设置" class="page-card">
      <Tabs type="card">
        <TabPane key="reminder" tab="提醒设置">
          <Form layout="vertical" class="settings-form">
            <div class="section-title">提醒开关</div>
            <FormItem label="审核提醒">
              <Switch v-model:checked="reminderSettings.enableAuditReminder" />
              <span class="switch-hint">项目审核通过后发送短信通知</span>
            </FormItem>
            <FormItem label="退回提醒">
              <Switch v-model:checked="reminderSettings.enableReturnReminder" />
              <span class="switch-hint">项目被退回时发送短信通知</span>
            </FormItem>
            <FormItem label="进度报送提醒">
              <Switch v-model:checked="reminderSettings.enableProgressReminder" />
              <span class="switch-hint">定期提醒报送项目进度</span>
            </FormItem>

            <div class="section-title">提醒时间设置</div>
            <FormItem label="提醒时间">
              <TimePicker
                v-model:value="reminderSettings.reminderTime"
                format="HH:mm"
                style="width: 200px"
              />
            </FormItem>
            <FormItem label="提醒频率">
              <Select
                v-model:value="reminderSettings.reminderFrequency"
                :options="frequencyOptions"
                style="width: 200px"
              />
            </FormItem>
          </Form>
        </TabPane>

        <TabPane key="template" tab="模板设置">
          <Form layout="vertical" class="settings-form">
            <div class="section-title">短信模板</div>
            <FormItem label="审核通过模板">
              <Input.TextArea
                v-model:value="templateSettings.auditTemplate"
                :rows="3"
                placeholder="请输入审核通过短信模板"
              />
              <div class="template-hint">可用变量：{projectName} - 项目名称</div>
            </FormItem>
            <FormItem label="退回模板">
              <Input.TextArea
                v-model:value="templateSettings.returnTemplate"
                :rows="3"
                placeholder="请输入退回短信模板"
              />
              <div class="template-hint">可用变量：{projectName} - 项目名称，{reason} - 退回原因</div>
            </FormItem>
            <FormItem label="进度提醒模板">
              <Input.TextArea
                v-model:value="templateSettings.progressTemplate"
                :rows="3"
                placeholder="请输入进度提醒短信模板"
              />
              <div class="template-hint">可用变量：{projectName} - 项目名称</div>
            </FormItem>
          </Form>
        </TabPane>

        <TabPane key="receiver" tab="接收人设置">
          <Form layout="vertical" class="settings-form">
            <div class="section-title">默认接收人</div>
            <FormItem>
              <Checkbox v-model:checked="receiverSettings.notifyProjectUnit">
                通知项目单位
              </Checkbox>
            </FormItem>
            <FormItem>
              <Checkbox v-model:checked="receiverSettings.notifyLeadUnit">
                通知牵头单位
              </Checkbox>
            </FormItem>
            <FormItem>
              <Checkbox v-model:checked="receiverSettings.notifyDistrictLeader">
                通知分管领导
              </Checkbox>
            </FormItem>

            <div class="section-title">自定义接收人</div>
            <FormItem label="额外接收人">
              <CheckboxGroup
                v-model:value="receiverSettings.customReceivers"
                :options="receiverOptions"
              />
            </FormItem>
          </Form>
        </TabPane>
      </Tabs>

      <div class="form-actions">
        <Button type="primary" @click="handleSave">
          <SaveOutlined />保存设置
        </Button>
        <Button @click="handleReset">
          <ReloadOutlined />重置
        </Button>
      </div>
    </Card>
  </div>
</template>

<style scoped>
.sms-settings {
  padding: 0;
}

.page-card {
  background: #fff;
}

.settings-form {
  max-width: 600px;
  padding: 16px;
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

.switch-hint {
  margin-left: 12px;
  color: #999;
  font-size: 13px;
}

.template-hint {
  margin-top: 8px;
  color: #999;
  font-size: 12px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}
</style>
