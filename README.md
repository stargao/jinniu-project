# 金牛项目管理平台

一个基于 Vue 3 + TypeScript + Vite 构建的项目管理前端应用，用于管理各类项目的申报、进度报送、统计分析等功能。

## 项目简介

金牛项目管理平台是一个综合性的项目管理系统，主要功能包括：

- **项目申报管理**：项目申报、审批、转办、退回、异常处理
- **进度报送**：进度审核、查询、预警、统计分析
- **项目浏览**：按级别、区域浏览项目，查看历史记录
- **项目统计**：项目数据统计分析
- **问题协调**：项目问题协调管理
- **策划储备项目**：项目策划储备管理
- **地理信息**：项目地图展示
- **短信管理**：短信设置与管理

## 技术栈

- **前端框架**：Vue 3.5.27
- **构建工具**：Vite 7.3.1
- **开发语言**：TypeScript 5.9.3
- **UI 组件库**：Ant Design Vue 4.2.6
- **状态管理**：Pinia 3.0.4
- **路由管理**：Vue Router 5.0.1
- **HTTP 客户端**：Axios 1.13.4

## 环境要求

- Node.js：^20.19.0 或 >=22.12.0
- npm 或 yarn

## 安装与运行

### 1. 克隆项目

```bash
git clone https://github.com/stargao/jinniu-project.git
cd jinniu-project
```

### 2. 安装依赖

```bash
npm install
```

### 3. 开发模式运行

```bash
npm run dev
```

启动后访问 http://localhost:5173

### 4. 生产环境构建

```bash
npm run build
```

构建后的文件位于 `dist` 目录。

### 5. 预览生产构建

```bash
npm run preview
```

## 项目结构

```
jinniu-project/
├── public/              # 静态资源
├── src/
│   ├── api/             # API 接口
│   ├── assets/          # 静态资源（图片、样式等）
│   ├── components/      # 公共组件
│   ├── layouts/         # 布局组件
│   ├── router/          # 路由配置
│   ├── stores/          # Pinia 状态管理
│   ├── types/           # TypeScript 类型定义
│   ├── views/           # 页面视图
│   │   ├── all-projects/      # 全部项目模块
│   │   ├── geographic-info/   # 地理信息模块
│   │   ├── planning-reserve/  # 策划储备项目模块
│   │   ├── sms-management/    # 短信管理模块
│   │   ├── AboutView.vue
│   │   └── HomeView.vue
│   ├── App.vue          # 根组件
│   └── main.ts          # 入口文件
├── documents/           # 项目文档
├── package.json         # 项目配置
├── tsconfig.json        # TypeScript 配置
├── vite.config.ts       # Vite 配置
└── eslint.config.ts     # ESLint 配置
```

## 可用脚本

| 命令                    | 说明              |
| --------------------- | --------------- |
| `npm run dev`         | 启动开发服务器         |
| `npm run build`       | 构建生产环境（含类型检查）   |
| `npm run build-only`  | 仅构建，不进行类型检查     |
| `npm run preview`     | 预览生产构建          |
| `npm run type-check`  | TypeScript 类型检查 |
| `npm run lint`        | 运行所有代码检查        |
| `npm run lint:eslint` | ESLint 代码检查     |
| `npm run lint:oxlint` | Oxlint 代码检查     |

## 开发配置

### 路径别名

项目配置了 `@` 别名指向 `src` 目录：

```typescript
import Component from '@/components/Component.vue'
```

### ESLint 配置

项目使用 ESLint 9.x 进行代码规范检查，配置位于 `eslint.config.ts`。

### TypeScript 配置

- `tsconfig.json` - 基础配置
- `tsconfig.app.json` - 应用配置
- `tsconfig.node.json` - Node 环境配置

## 浏览器支持

- Chrome / Edge 最新版
- Firefox 最新版
- Safari 最新版

## 开发团队

请在此处添加开发团队信息

## 许可证

请在此处添加许可证信息
