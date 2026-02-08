# 金牛区固定投资项目管理平台-AI可读需求规格说明书 (V2)


## 1. 系统概述

本文档是基于用户提供的最新项目资料和UI截图，对原有需求规格说明书的修订版。旨在为AI开发工具提供一份关于**金牛区固定投资项目管理平台**的、更加精确和详尽的开发指南。文档核心是根据真实数据和界面，重新定义页面、字段和数据库设计，以确保AI生成的应用最大程度地贴近实际业务需求。

## 2. 系统架构逻辑

系统架构保持不变，仍采用标准的B/S架构。前端技术栈明确要求使用**Vue.js**配合标准化UI组件库，后端则采用Ant Design Vue框架，通过RESTful API与前端进行数据交互。

## 3. 用户角色与权限

用户角色与权限的核心划分保持不变，仍分为**普通用户**和**管理员**，体现了业务执行与监督管理的分离。

## 4. 页面与组件规格说明(已根据新资料修订)

本章节为AI开发工具提供每个核心页面的详细字段、功能和交互设计。所有字段均以来源截图和文档为基准，并剔除了冗余字段。

### 4.1 项目创建向导 - 步骤1: 项目基本信息 (`/projects/new/step1`)

- **页面用途**: 录入新项目的核心属性、责任单位和分类信息。

| UI 元素 | 类型 | 标签/占位符 | 对应数据库字段 (建议) | 备注 |
|---|---|---|---|---|
| **项目基本信息** | | | |
| `projectName` | `Input` | 项目名称 | `T2_JBXX.XMMC` | 必填项 |
| `projectCode` | `Input` | 项目编号 | `T2_JBXX.XMBH` | - |
| `isCustomWarning`| `Radio` | 自定义预警 (是/否) | `T2_JBXX.ZDY_YJ` | - |
| `isProvincialLead`|`Radio`| 是否省领导牵头发送短信(是/否)|`T2_JBXX.SFSLDQT`| - |
| `address` | `Input` | 详细地址 | `T2_JBXX.XXDZ` | 地图选点联动 |
| `industryPark` | `Select` | 所属产业园区 | `T2_JBXX.SSCY_YQ` | - |
| `industryChain` | `Select` | 所属重点产业链 | `T2_JBXX.SSZD_CYL` | - |
| `street` | `Select` | 街道 | `T2_JBXX.JD` | - |
| `approvalCategory`| `Select`| 项目批文类别 | `T2_JBXX.XMPW_LB`| - |
| `plannedCompletionDate` | `DatePicker` | 计划竣工时间 | `T2_JBXX.JHJG_SJ` | - |
| `plannedResumeDate`| `DatePicker`| 计划复工时间 | `T2_JBXX.JHfg_SJ` | - |
| `actualStartDate`| `DatePicker`| 实际开工时间 | `T2_JBXX.SJKG_SJ` | - |
| `actualCompletionDate`|`DatePicker`| 实际竣工时间 | `T2_JBXX.SJJG_SJ`| - |
| `constructionContent` | `TextArea` | 建设内容及规模 | `T2_JBXX.JSXM_GM` | - |
| **项目责任信息** | | | |
| `districtLeader` | `Input` | 分管区领导 | `T2_JBXX_ZRTX.FGQ_LD` | - |
| `leadUnitInfo` | `Select` | 牵头单位信息 | `T2_JBXX_ZRTX.QTDW_XX` | - |
| `leadUnit` | `Select` | 牵头单位 | `T2_JBXX_ZRTX.QTDW` | - |
| `ownerUnit` | `Select` | 业主单位 | `T2_JBXX_ZRTX.YZDW` | - |
| `ownerMaintenanceUnit`|`Select`| 业主维护责任单位 | `T2_JBXX_ZRTX.YZWH_ZRDW` | - |
| `maintenanceContact`|`Input`| 信息维护单位联系人|`T2_JBXX_ZRTX.XXWH_LXR` | - |
| `maintenanceContactPhone` | `Input` | 联系电话 | `T2_JBXX_ZRTX.XXWH_LXDH`| - |
| `industryDepartment`| `Input` | 行业主管部门 | `T2_JBXX_ZRTX.HYZGBM` | - |
| **项目分类信息** | | | |
| `isEngineering` | `Radio` | 是否工程类项目 | `T2_JBXX.SFGCL` | 是/否 |
| `isGovInvest` | `Radio` | 政府投资项目 | `T2_JBXX.SFZF_TZ` | 是/否 |
| `investType` | `Select` | 投资类型 | `T2_JBXX.TZ_LX` | 工业项目/其他项目 |
| `signingDate` | `DatePicker`| 签约时间 | `T2_JBXX.QY_SJ` | - |
| `landSupplyDate`| `DatePicker`| 供地时间 | `T2_JBXX.GD_SJ` | - |
| `subInvestType`| `Checkbox` | 投资类型 | `T2_JBXX.SUB_TZ_LX`| 市政类项目/房建类项目 |

### 4.2 项目创建向导 - 步骤2: 资金来源信息 (`/projects/new/step2`)

- **页面用途**: 录入项目的详细投资构成。

| UI 元素 | 类型 | 标签/占位符 | 对应数据库字段 (建议) | 备注 |
|---|---|---|---|---|
| `totalInvestment` | `InputNumber` | 项目总投资(万元)| `T2_ZJLY.ZTZ` | 自动计算子项之和 |
| `engineeringCost` | `InputNumber` | 其中工程建设费(万元) | `T2_ZJLY.GCJS_F` | - |
| `demolitionCost`|`InputNumber`| 其中拆迁及土地费(万元) |`T2_ZJLY.CQTD_F`| - |
| `otherCost` | `InputNumber` | 其他费用(万元) | `T2_ZJLY.QT_F` | - |

### 4.3 项目创建向导 - 步骤3: 项目年度信息 (`/projects/new/step3`)

- **页面用途**: 规划项目在特定年度内的目标与计划。

| UI 元素 | 类型 | 标签/占位符 | 对应数据库字段 (建议) | 备注 |
|---|---|---|---|---|
| `year` | `Select` | 年度 | `T2_NDXX.ND` | - |
| `fourBatches` | `Select` | 四个一批 | `T2_NDXX.SGYP` | 系统自动生成 |
| `investToEndOfLastYear`| `InputNumber`| 截止上年末累计完成投资(万元) | `T2_NDXX.SNM_LJWC_TZ`| - |
| `balanceAtEndOfLastYear`| `InputNumber`| 截止上年末剩余资金(万元) | `T2_NDXX.SNM_SY_ZJ`| - |
| `plannedInvestmentThisYear` | `InputNumber`| 本年计划投资(万元) | `T2_NDXX.BNJH_TZ` | - |
| `plannedStartDate`|`DatePicker`| 计划开工时间 | `T2_NDXX.JH_KGSJ`| - |
| `plannedCompletionDate` | `DatePicker` | 计划竣工时间 | `T2_NDXX.JH_JGSJ` | - |
| `constructionPlan`| `TextArea` | 建设计划 | `T2_NDXX.JS_JH` | - |
| `fundingArrangement`|`TextArea`| 建设资金安排 |`T2_NDXX.JSZJ_AP`| - |
| `plannedProgressThisYear`|`TextArea`| 本年计划形象进度 |`T2_NDXX.BNJH_XXJD` | - |
| `districtAffiliation`| `Radio`| 区属(是/否) |`T2_NDXX.QS`| - |
| `cityAffiliation`|`Radio`| 市属(是/否) | `T2_NDXX.SHIS` | - |
| `provinceAffiliation`|`Radio`| 省属(是/否) | `T2_NDXX.SHENGS`| - |
| `quarterlyGoal` |`TextArea`| 目标任务(万元)|`T2_NDXX.JDMB_RW` | - |

### 4.4 项目进度报送页 (`/projects/:id/progress-report`)

- **页面用途**: 定期上报项目的建设进展。

| UI 元素 | 类型 | 标签/占位符 | 对应数据库字段 (建议) | 备注 |
|---|---|---|---|---|
| `progressStatus`| `Radio` | 项目进度情况 | `T2_JDXX.XMP_JDQK` | 正常/滞后 |
| `constructionPhase` | `Stepper` | 建设阶段 | `T2_JDXX.JS_JD` | 例如: 前期规划, 拆迁安置, ... |
| `hasLandPermit` | `Radio` | 是否取得国土证 | `T2_JDXX.SFQDG_TDZ` | - |
| `hasPlanningPermit`|`Radio`| 是否取得建设规划许可证|`T2_JDXX.SFQDJ_SGHXK` | - |
| `hasConstructionPermit` | `Radio` | 是否取得施工许可证|`T2_JDXX.SFQDS_GZ`| - |
| `completedInvestmentThisMonth`|`InputNumber`| 本月完成投资(万元)| `T2_JDXX.BYWC_TZ`| - |
| `totalCompletedInvestment` |`InputNumber`| 项目累计完成投资(万元)|`T2_JDXX.XmL_JWC_TZ`| - |
| `remainingInvestment` | `InputNumber`| 项目剩余投资(万元) |`T2_JDXX.XMSY_TZ`| - |
| `monthlyProgress` |`TextArea`| 本月进展 | `T2_JDXX.BY_JZ` | - |
| `progressImages`| `Upload`| 上传进度图片 | `T2_JDXX_FJ.FJ_LJ` | - |
| `issues`| `TextArea`| 存在的问题 | `T2_JDXX.CZ_WT` | - |
| `nextStepPlan` |`TextArea`| 下一步计划 | `T2_JDXX.XYB_JH`| - |
| `landAcquiredThisYear` |`InputNumber`| 本年累计解决土地(亩)|`T2_JDXX.BNLJ_JJTD` | - |

## 5. 数据库核心表设计 (建议)

为匹配新的页面结构，数据库表结构建议作如下调整。

- **`T2_JBXX` (项目基本信息表)**: 包含4.1中项目基本信息和分类信息的字段。
- **`T2_JBXX_ZRTX` (项目责任体系表)**: `1-to-1`关联`T2_JBXX`, 存储4.1中项目责任信息字段。
- **`T2_ZJLY` (资金来源表)**: `1-to-1`关联`T2_JBXX`, 存储4.2中资金来源信息。
- **`T2_NDXX` (项目年度信息表)**: `1-to-N`关联`T2_JBXX`, 存储4.3中年度信息，可有多条记录。
- **`T2_JDXX` (项目进度信息表)**: `1-to-N`关联`T2_JBXX`, 存储4.4中进度提报信息，可有多条记录。
- **`T2_JDXX_FJ` (进度附件表)**: `1-to-N`关联`T2_JDXX`, 存储进度提报的附件路径。

## 6. API接口设计 (推荐)

- `POST /api/projects`: 创建一个空的项目草稿，返回项目ID。
- `PUT /api/projects/:id`: 统一的保存接口，请求体中包含来自三个步骤的所有字段，后端根据字段更新对应的数据表。
- `POST /api/projects/:id/submit`: 项目信息填写完毕，提交审核。
- `POST /api/projects/:id/progress-reports`: 提交新的进度报告，请求体包含4.4中的所有字段。