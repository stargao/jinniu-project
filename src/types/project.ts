// 项目基本信息
export interface ProjectBasicInfo {
  // 项目基本信息
  projectName: string
  projectCode?: string
  isCustomWarning?: boolean
  isProvincialLead?: boolean
  address?: string
  industryPark?: string
  industryChain?: string
  street?: string
  approvalCategory?: string
  plannedCompletionDate?: string
  plannedResumeDate?: string
  actualStartDate?: string
  actualCompletionDate?: string
  constructionContent?: string

  // 项目责任信息
  districtLeader?: string
  leadUnitInfo?: string
  leadUnit?: string
  ownerUnit?: string
  ownerMaintenanceUnit?: string
  maintenanceContact?: string
  maintenanceContactPhone?: string
  industryDepartment?: string

  // 项目分类信息
  isEngineering?: boolean
  isGovInvest?: boolean
  investType?: string
  signingDate?: string
  landSupplyDate?: string
  subInvestType?: string[]
}

// 资金来源信息
export interface FundingSource {
  totalInvestment?: number
  engineeringCost?: number
  demolitionCost?: number
  otherCost?: number
}

// 项目年度信息
export interface AnnualInfo {
  year?: string
  fourBatches?: string
  investToEndOfLastYear?: number
  balanceAtEndOfLastYear?: number
  plannedInvestmentThisYear?: number
  plannedStartDate?: string
  plannedCompletionDate?: string
  constructionPlan?: string
  fundingArrangement?: string
  plannedProgressThisYear?: string
  districtAffiliation?: boolean
  cityAffiliation?: boolean
  provinceAffiliation?: boolean
  quarterlyGoal?: string
}

// 项目进度信息
export interface ProgressReport {
  progressStatus?: string
  constructionPhase?: string
  hasLandPermit?: boolean
  hasPlanningPermit?: boolean
  hasConstructionPermit?: boolean
  completedInvestmentThisMonth?: number
  totalCompletedInvestment?: number
  remainingInvestment?: number
  monthlyProgress?: string
  progressImages?: string[]
  issues?: string
  nextStepPlan?: string
  landAcquiredThisYear?: number
}

// 完整项目数据
export interface Project {
  id?: string
  basicInfo: ProjectBasicInfo
  fundingSource: FundingSource
  annualInfo: AnnualInfo
  progressReports?: ProgressReport[]
}
