import axios from 'axios'
import type { Project, ProjectBasicInfo, FundingSource, AnnualInfo, ProgressReport } from '@/types/project'

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// 创建项目草稿
export const createProject = async (): Promise<{ id: string }> => {
  const response = await apiClient.post('/projects')
  return response.data
}

// 更新项目信息
export const updateProject = async (
  id: string,
  data: {
    basicInfo?: ProjectBasicInfo
    fundingSource?: FundingSource
    annualInfo?: AnnualInfo
  }
): Promise<void> => {
  await apiClient.put(`/projects/${id}`, data)
}

// 提交项目审核
export const submitProject = async (id: string): Promise<void> => {
  await apiClient.post(`/projects/${id}/submit`)
}

// 提交进度报告
export const submitProgressReport = async (
  id: string,
  report: ProgressReport
): Promise<void> => {
  await apiClient.post(`/projects/${id}/progress-reports`, report)
}

// 获取项目详情
export const getProject = async (id: string): Promise<Project> => {
  const response = await apiClient.get(`/projects/${id}`)
  return response.data
}
