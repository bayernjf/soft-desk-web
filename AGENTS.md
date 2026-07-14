# AGENTS.md — SoftDesk 落地页项目指令

本文档供 AI coding agents（Trae / Claude Code / Cursor / Codex / Copilot 等）在本项目工作时自动读取。
请严格遵循以下约定。

---

## 项目概览

SoftDesk 落地页是 AI 驱动的桌面软件管理效率工具的官方网站，包含营销落地页 + 在线演示 App。

- **包管理器**：npm（**不要用 pnpm/yarn**）
- **构建工具**：Vite 6
- **框架**：React 18 + TypeScript + React Router 7
- **样式**：Tailwind CSS 3
- **状态管理**：Zustand 5
- **图表**：Recharts
- **图标**：Lucide React
- **Node 版本**：22 LTS

### 项目结构

```
soft-desk-landing/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD：lint + type check + build + 双平台部署
├── .trae/
│   ├── rules/
│   │   ├── git-commit-message.md   # Commit message 原子拆分规则
│   │   └── project_rules.md        # 项目级规则
│   └── documents/
│       ├── PRD.md
│       └── Technical-Architecture.md
├── docs/
│   └── analytics-tracking-plan.md  # 埋点方案文档
├── public/
│   ├── _redirects              # Cloudflare Pages SPA 路由回退
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── features/           # 功能区块组件（AI分类/工作流/软件库等）
│   │   ├── layout/             # 布局组件（Layout/Sidebar）
│   │   ├── RadialMenu.tsx      # 径向菜单组件（核心功能）
│   │   ├── SearchBar.tsx       # 搜索组件
│   │   ├── Charts.tsx          # 图表组件
│   │   └── ...
│   ├── hooks/
│   │   ├── useAnalytics.ts     # 埋点相关 hooks
│   │   ├── useTheme.ts         # 主题切换
│   │   └── useDownloadUrls.ts  # 下载链接
│   ├── lib/
│   │   ├── analytics.ts        # 埋点 SDK（GA4 + Clarity）
│   │   └── utils.ts            # 工具函数（cn 等）
│   ├── pages/
│   │   ├── Landing.tsx         # 落地页（营销页）
│   │   ├── Dashboard.tsx       # 演示 App 仪表盘
│   │   ├── Library.tsx         # 软件库
│   │   ├── Workflows.tsx       # 工作流
│   │   ├── Favorites.tsx       # 收藏夹
│   │   ├── Statistics.tsx      # 统计
│   │   ├── Settings.tsx        # 设置
│   │   └── ...
│   ├── stores/                 # Zustand stores
│   ├── services/               # 服务层
│   ├── data/                   # 静态数据/mock
│   ├── types/                  # TypeScript 类型
│   ├── router.tsx              # React Router 配置
│   ├── main.tsx                # 入口（初始化埋点）
│   ├── App.tsx
│   └── index.css               # Tailwind 入口
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── vercel.json                 # Vercel 部署配置（rewrites）
├── package.json
├── tsconfig.json
├── eslint.config.js
├── .env.example
├── DEPLOYMENT.md
└── AGENTS.md                   # 本文件
```

### 路由结构

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Landing | 落地页（营销页） |
| `/app` | Dashboard | 演示 App 仪表盘 |
| `/app/library` | Library | 软件库 |
| `/app/favorites` | Favorites | 收藏夹 |
| `/app/workflows` | Workflows | 工作流 |
| `/app/my-shares` | MyShares | 我的分享 |
| `/app/statistics` | Statistics | 统计 |
| `/app/uninstall` | Uninstall | 卸载清理 |
| `/app/settings` | Settings | 设置 |
| `*` | 重定向到 `/` | 404 回退 |

---

## 常用命令

所有命令在仓库根目录执行。

### 本地开发

```bash
cp .env.example .env.local       # 复制环境变量（首次）
npm install                      # 安装依赖
npm run dev                      # 启动开发服务器（默认端口 5173）
```

### 构建

```bash
npm run build                    # 类型检查 + 生产构建（产物在 dist/）
npm run preview                  # 本地预览构建产物
```

### 代码检查

```bash
npm run lint                     # ESLint 检查
npm run check                    # TypeScript 类型检查（无 emit）
```

### 提交前验证

```bash
npm run lint && npm run check && npm run build
```

---

## 环境变量

- **所有 `.env*` 文件被 .gitignore**，仅 `.env.example` 入库
- 变量必须以 `VITE_` 前缀才能在前端代码中通过 `import.meta.env` 访问
- 部署时环境变量在 **GitHub Secrets** 中配置，构建时注入（因为是预构建模式 `--prebuilt`）

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 衡量 ID（`G-XXXXXXXXXX`） | 生产环境 |
| `VITE_CLARITY_PROJECT_ID` | Microsoft Clarity 项目 ID | 生产环境 |

### GitHub Secrets 配置（部署必需）

部署用的环境变量存在 GitHub Secrets 中（Settings → Secrets and variables → Actions）：

| Secret 名称 | 说明 |
|-------------|------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token（Pages 编辑权限） |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID |
| `VERCEL_TOKEN` | Vercel Token |
| `VERCEL_ORG_ID` | Vercel Org ID |
| `VERCEL_PROJECT_ID` | Vercel 项目 ID |
| `VITE_GA_MEASUREMENT_ID` | GA4 衡量 ID（构建时注入） |
| `VITE_CLARITY_PROJECT_ID` | Clarity 项目 ID（构建时注入） |

---

## 埋点系统

埋点方案详见 [docs/analytics-tracking-plan.md](docs/analytics-tracking-plan.md)。

### 核心文件

| 文件 | 用途 |
|------|------|
| `src/lib/analytics.ts` | 埋点 SDK（GA4 + Clarity 初始化 + track 函数） |
| `src/hooks/useAnalytics.ts` | React hooks（Section 可见性/滚动深度等） |
| `src/main.tsx` | 应用入口，调用 `initAnalytics()` |

### 开发约定

- 事件名使用 `snake_case`
- 新增事件前先确认埋点方案，不要随意加
- 开发环境通过 `console.debug` 输出，不发送真实数据
- 调用方式：`track('event_name', { param1: 'value' })`

---

## 代码规范

### Commit Message 格式

严格遵循 [`.trae/rules/git-commit-message.md`](.trae/rules/git-commit-message.md) 的原子拆分规则：

- **每个 commit 只做一件事**，按业务模块/文件类型/功能拆分
- 类型：`feat` / `fix` / `refactor` / `chore` / `docs` / `test` / `style` / `perf`
- 格式：`<type>[可选 scope]: <简短祈使句主语>`
- 每个 commit 必须有 body 说明改动目的

示例：
```
fix(analytics): correct gtag placeholder function signature

Change rest params to arguments object so gtag.js can properly
process the dataLayer queue. Also add consent mode defaults.
```

### 通用约定

- 使用 TypeScript，避免 `any`
- 组件默认导出，页面组件放 `src/pages/`，可复用组件放 `src/components/`
- 样式用 Tailwind CSS，复杂 className 用 `cn()`（来自 `src/lib/utils.ts`）组合
- 图标用 `lucide-react`
- 状态管理用 Zustand，简单状态优先用 `useState`
- 新增环境变量必须同步更新 `.env.example`
- 图片/资源文件必须是真实文件（不是占位符）
- 不要直接在 `main` / `dev` 分支上提交，用 `feature/` 或 `fix/` 分支

---

## Git 工作流

### 分支

| 分支 | 用途 |
|------|------|
| `main` | 生产环境，**必须通过 PR 合并**，禁止直接 push |
| `dev` | Staging 环境，通过 PR 合并 |
| `feature/<描述>` / `fix/<描述>` / `chore/<描述>` | 功能/修复分支 |

### Push 前必须做的事

1. `git pull --rebase` 确认远程没有新提交
2. `npm run lint && npm run check && npm run build` 全部通过
3. 按原子规则拆分 commit

### PR 流程

1. 从 `dev` 切出功能分支
2. 开发完成后提 PR 到 `dev`
3. CI 通过（lint + type check + build + 预览部署）
4. Review 后合并到 `dev`
5. 验证 Staging 环境正常
6. 从 `dev` 提 PR 到 `main`，合并后自动部署生产

---

## CI/CD

工作流文件：`.github/workflows/deploy.yml`

### 触发条件

- `push` 到 `main` 或 `dev` 分支
- `pull_request` 到 `main` 或 `dev` 分支

### Job 结构

| Job | 触发条件 | 说明 |
|-----|---------|------|
| `ci-check` | 全部 | lint + type check |
| `build` | ci-check 通过 | 构建产物 + upload artifact |
| `preview-deploy` | PR 事件 | 部署到 Cloudflare Pages + Vercel 预览环境 |
| `deploy-staging` | push dev | 部署到 Staging（dev 分支） |
| `deploy-production` | push main | 部署到 Production（main 分支） |

### 部署平台

| 平台 | 项目名 | 环境隔离方式 |
|------|--------|-------------|
| Cloudflare Pages | `soft-desk-landing` | `--branch` 参数（main/dev/pr-{号}） |
| Vercel | `soft-desk-landing` | `--prebuilt` + `--prod`（生产）/ 不带（预览） |

### 重要说明

- **Vercel 使用 `--prebuilt` 模式**：在 GitHub Actions 中构建，然后直接上传 `.vercel/output` 目录
- **环境变量在构建时注入**：GitHub Secrets → `npm run build` → 产物包含埋点 ID 等
- **Cloudflare 用 `_redirects` 文件**处理 SPA 路由回退：`/* /index.html 200`
- **Vercel 用 `vercel.json` 的 `rewrites`** 处理 SPA 路由回退

---

## 关键文件索引

| 文件 | 用途 |
|------|------|
| `src/lib/analytics.ts` | 埋点 SDK（GA4 + Clarity） |
| `src/hooks/useAnalytics.ts` | 埋点 React hooks |
| `src/router.tsx` | 路由配置 |
| `src/main.tsx` | 应用入口 + 埋点初始化 |
| `src/pages/Landing.tsx` | 落地页主组件 |
| `src/components/RadialMenu.tsx` | 径向菜单（核心功能演示） |
| `src/lib/utils.ts` | 工具函数（cn 等） |
| `public/_redirects` | Cloudflare Pages SPA 路由回退 |
| `vercel.json` | Vercel 部署配置 |
| `.github/workflows/deploy.yml` | CI/CD 工作流 |
| `.trae/rules/git-commit-message.md` | Commit 原子拆分规则 |
| `docs/analytics-tracking-plan.md` | 埋点方案文档 |

---

## 不要做的事

- 不要用 pnpm/yarn，只用 npm
- 不要提交 `.env` 文件
- 不要直接在 `main` 或 `dev` 分支上提交，用 feature/fix 分支
- 不要创建假的占位图片文件，必须用真实图片
- 不要随意添加新的埋点事件，先确认埋点方案
- 不要修改 `public/_redirects` 的 SPA 回退规则
- 不要在 Vercel 部署中去掉 `--prebuilt`（否则环境变量不生效）
- 不要把 `VITE_` 前缀的变量名写错（构建时会注入，错了就没值）
