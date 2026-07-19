# AGENTS.md — SoftDesk 落地页项目指令

本文档供 AI coding agents（Trae / Claude Code / Cursor / Codex / Copilot 等）在本项目工作时自动读取。
请严格遵循以下约定。

---

## 项目概览

SoftDesk 落地页是 AI 驱动的桌面软件管理效率工具官方网站，包含营销落地页和在线演示 App。

- **包管理器**：npm（不要用 pnpm/yarn）
- **构建工具**：Vite 6
- **框架**：React 18 + TypeScript + React Router 7
- **样式**：Tailwind CSS 3
- **状态管理**：Zustand 5
- **图表**：Recharts
- **图标**：Lucide React
- **Node 版本**：22 LTS（CI 固定使用 Node 22）

### 项目结构

```text
soft-desk-landing/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD：lint、类型检查、构建、双平台部署
├── .trae/
│   ├── rules/
│   │   ├── git-commit-message.md   # Commit 原子拆分规则
│   │   └── project_rules.md        # 项目级规则
│   └── documents/
│       ├── PRD.md
│       └── Technical-Architecture.md
├── docs/
│   └── analytics-tracking-plan.md  # 埋点方案
├── public/
│   ├── _redirects                  # Cloudflare Pages SPA 路由回退
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── features/               # AI 分类、工作流、软件库等功能组件
│   │   ├── layout/                 # Layout、Sidebar 等布局组件
│   │   ├── CookieBanner.tsx        # Cookie 授权与分析偏好
│   │   ├── RadialMenu.tsx          # 径向菜单
│   │   └── ...
│   ├── hooks/
│   │   ├── useAnalytics.ts         # 埋点 hooks
│   │   ├── useTheme.ts             # 主题切换
│   │   └── useDownloadUrls.ts      # 下载链接
│   ├── lib/
│   │   ├── analytics.ts            # GA4、Clarity 与 Consent Mode
│   │   └── utils.ts                # cn 等工具函数
│   ├── pages/
│   │   ├── Landing.tsx             # 营销落地页
│   │   ├── Privacy.tsx             # 隐私政策
│   │   ├── Dashboard.tsx           # 演示 App 仪表盘
│   │   └── ...
│   ├── stores/                     # Zustand stores
│   ├── services/                   # 服务层
│   ├── data/                       # 静态数据与 mock
│   ├── types/                      # TypeScript 类型
│   ├── router.tsx                  # React Router 配置
│   ├── main.tsx                    # React 应用入口
│   └── index.css                   # Tailwind 入口
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── vercel.json                     # Vercel SPA 配置
├── package.json
├── tsconfig.json
├── eslint.config.js
├── .env.example
├── DEPLOYMENT.md
└── AGENTS.md
```

### 路由结构

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Landing | 营销落地页 |
| `/privacy` | Privacy | 隐私政策 |
| `/app` | Dashboard | 演示 App 仪表盘 |
| `/app/library` | Library | 软件库 |
| `/app/favorites` | Favorites | 收藏夹 |
| `/app/workflows` | Workflows | 工作流 |
| `/app/my-shares` | MyShares | 我的分享 |
| `/app/statistics` | Statistics | 统计 |
| `/app/uninstall` | Uninstall | 卸载清理 |
| `/app/settings` | Settings | 设置 |
| `*` | Navigate | 重定向到 `/` |

---

## 常用命令

所有命令在仓库根目录执行。

### 本地开发

```bash
cp .env.example .env.local
npm install
npm run dev
npm run dev -- --port 3000 --host
```

Vite 默认端口为 5173。需要使用 3000 端口时显式传入 `--port 3000`。

### 构建与预览

```bash
npm run build
npm run preview
```

生产构建输出到 `dist/`。

### 代码检查

```bash
npm run lint
npm run check
```

### 提交前验证

```bash
npm run lint && npm run check && npm run build
```

以上命令必须全部成功。已知的既有 warning 可以如实报告，但不得忽略新增 error。

---

## 环境变量

- 所有 `.env*` 文件均被 `.gitignore` 忽略，仅 `.env.example` 可提交
- 前端变量必须使用 `VITE_` 前缀，才能通过 `import.meta.env` 读取
- 新增或重命名环境变量时必须同步更新 `.env.example`、CI 构建变量和相关文档
- 不得在代码、日志、提交信息或文档中写入真实 token、API Key、项目密钥

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 衡量 ID | 生产环境 |
| `VITE_CLARITY_PROJECT_ID` | Microsoft Clarity 项目 ID | 生产环境 |

### GitHub Secrets

| Secret 名称 | 说明 |
|-------------|------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare Pages 部署凭证 |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID |
| `VERCEL_TOKEN` | Vercel 部署凭证 |
| `VERCEL_ORG_ID` | Vercel Organization ID |
| `VERCEL_PROJECT_ID` | Vercel Project ID |
| `VITE_GA_MEASUREMENT_ID` | 构建时注入的 GA4 ID |
| `VITE_CLARITY_PROJECT_ID` | 构建时注入的 Clarity ID |

---

## 埋点与隐私合规

埋点方案详见 `docs/analytics-tracking-plan.md`。

### 核心文件

| 文件 | 用途 |
|------|------|
| `src/lib/analytics.ts` | Consent 状态、GA4/Clarity 加载与 track 函数 |
| `src/components/CookieBanner.tsx` | 接受、拒绝、保存和撤回分析授权 |
| `src/hooks/useAnalytics.ts` | Section 可见性、滚动深度等 hooks |
| `src/pages/Landing.tsx` | 读取授权状态并初始化分析服务 |
| `src/pages/Privacy.tsx` | 数据收集和第三方服务披露 |

### 开发约定

- 事件名使用 `snake_case`
- 新增事件前先确认埋点方案，不得随意增加
- 开发环境只通过 `console.debug` 输出，不发送真实 GA4/Clarity 数据
- 生产环境只有在用户授予 `analytics_storage` 后才能加载 GA4 和 Clarity
- 用户拒绝后不得发送分析事件；用户后续同意时应能正常加载脚本
- 页脚必须保留隐私政策和分析偏好入口，以便用户撤回授权
- 用户输入、软件名称、软件描述、AI 配置等潜在敏感区域必须使用 Clarity mask
- 不得把密钥、完整用户输入或可识别个人身份的信息写入埋点参数
- 调用方式：`track('event_name', { param1: 'value' })`

---

## 代码规范

### Commit Message

严格遵循 `.trae/rules/git-commit-message.md`：

```text
<type>(<scope>): <imperative subject within 50 chars>

<short body explaining the purpose>
```

- Commit message 必须使用英文
- type：`feat` / `fix` / `docs` / `refactor` / `test` / `chore` / `style` / `perf`
- 每个 commit 只处理一个目的，并必须包含简短 body
- 文档、配置、测试、UI、API、工具函数、功能、修复和重构应按逻辑拆分
- 不得把所有改动压缩为一个提交
- 不得把无关文件放进同一提交

示例：

```text
fix(analytics): honor revoked consent

Prevent analytics events from being sent after the user withdraws
analytics storage permission.
```

### 通用约定

- 使用 TypeScript，避免 `any`
- 修改前先阅读相邻文件，沿用现有组件、导出、命名和样式模式
- 页面组件放在 `src/pages/`，可复用组件放在 `src/components/`
- 样式使用 Tailwind CSS；复杂 `className` 使用 `src/lib/utils.ts` 的 `cn()`
- 图标使用 `lucide-react`
- 跨页面状态使用 Zustand；局部简单状态优先使用 `useState`
- 新增环境变量必须同步更新 `.env.example`
- 图片和资源必须是真实文件，不得创建文本占位图片
- 不得添加与需求无关的依赖、文件、文档或重构
- 不得直接在 `main` 或 `dev` 分支开发和提交，使用 `feature/`、`fix/` 或 `chore/` 分支

---

## Git 工作流

### 分支

| 分支 | 用途 |
|------|------|
| `main` | 生产环境，必须通过 PR 和人工 review 合并 |
| `dev` | Staging 集成分支，通过 PR 合并 |
| `feature/<描述>` | 新功能 |
| `fix/<描述>` | Bug 修复 |
| `chore/<描述>` | 配置、工具和维护改动 |

新分支原则上从最新的 `dev` 创建。

### 三条用户指令

#### 1. “提交代码”——验证、原子提交并推送当前分支

1. 使用 `git status`、`git diff` 和 `git diff --check` 检查改动
2. 确认当前分支不是 `main` 或 `dev`
3. 执行 `npm run lint && npm run check && npm run build`；失败则停止并报告
4. 按 `.trae/rules/git-commit-message.md` 拆分独立原子提交
5. 提交后执行 `git pull --rebase origin <当前分支>`，确认远程无新提交
6. 有冲突则停止，不得自动解决
7. 执行 `git push origin <当前分支>`
8. 输出提交列表、验证结果和推送结果

若当前分支尚未建立远程跟踪，使用 `git push -u origin <当前分支>`。不得创建空提交。

#### 2. “提交代码并合并到 dev”——通过 PR 合并到 dev

1. 完成“提交代码”的全部检查、原子提交和推送步骤
2. 执行 `git fetch origin dev`
3. 使用 `git merge --no-commit --no-ff origin/dev` 做冲突预检
4. 有冲突时执行 `git merge --abort`，输出冲突文件列表并停止
5. 无冲突时执行 `git merge --abort`，收集当前分支尚未合入 `dev` 的 commits
6. 根据提交生成 PR 标题和描述，执行 `gh pr create --base dev --head <当前分支>`
7. 等待 CI 成功后，通过 GitHub PR 合并；不得绕过分支保护直接 push `dev`
8. 输出 PR 链接和合并结果，并返回原工作分支

只有用户明确说“并合并到 dev”时才执行合并。若仓库要求人工 review 或 `gh` 无权限，则创建 PR 后停止并报告。

#### 3. “创建 PR”——提交推送并创建 PR，不合并

1. 完成“提交代码”的全部检查、原子提交和推送步骤
2. 执行冲突预检；有冲突则停止
3. 执行 `gh pr create --base dev --head <当前分支>`
4. 输出 PR 链接后停止，等待人工 review，不执行合并

### PR 模板

```markdown
## 改动摘要
- ...

## 影响范围
- [ ] 营销落地页
- [ ] 演示 App
- [ ] 埋点与隐私
- [ ] CI/CD
- [ ] 配置或文档

## 验证
- [x] `npm run lint`
- [x] `npm run check`
- [x] `npm run build`
- [ ] 手动测试

Closes #<issue号>
```

没有关联 issue 时删除 `Closes` 行，不得编造 issue 编号。

### 冲突规则

- 禁止 AI 自动解决 merge、rebase 或 cherry-pick 冲突
- 必须列出冲突文件和当前操作，等待开发者处理
- 开发者明确说“继续合并”或“继续 rebase”后，才能从对应步骤继续
- 不得为绕过冲突使用强制 push

### 发布到 main

- 不自动把 `dev` 合并到 `main`
- 必须从 `dev` 创建 PR 到 `main`
- 必须等待 CI 和人工 review，通过后再合并
- 不得直接 push `main`

---

## CI/CD

工作流文件：`.github/workflows/deploy.yml`。

### 触发条件

- `pull_request` 到 `main` 或 `dev`：CI + Cloudflare/Vercel Preview
- push 到 `dev`：CI + Staging 部署
- push 到 `main`：CI + Production 部署

### Job 结构

| Job | 触发条件 | 说明 |
|-----|---------|------|
| `ci-check` | 全部 | ESLint + TypeScript 检查 |
| `build` | `ci-check` 通过 | 生产构建并上传 `dist/` |
| `preview-deploy` | PR | Cloudflare Pages + Vercel Preview |
| `deploy-staging` | push `dev` | Staging 双平台部署 |
| `deploy-production` | push `main` | Production 双平台部署 |

### 部署约定

| 平台 | 项目 | 环境隔离 |
|------|------|----------|
| Cloudflare Pages | `soft-desk-landing` | `--branch main/dev/pr-{number}` |
| Vercel | `soft-desk-landing` | `--prebuilt`，生产额外使用 `--prod` |

- Vercel 使用 `.vercel/output` 预构建产物，不得随意移除 `--prebuilt`
- 环境变量由 GitHub Secrets 在 `npm run build` 时注入
- Cloudflare 使用 `public/_redirects` 处理 SPA 路由回退
- Vercel 使用预构建输出配置和 `vercel.json` 处理 SPA 路由
- 不得修改部署分支、项目名、环境隔离或回退规则，除非用户明确要求

---

## 关键文件索引

| 文件 | 用途 |
|------|------|
| `src/lib/analytics.ts` | Consent、GA4 和 Clarity SDK |
| `src/components/CookieBanner.tsx` | Cookie 授权和分析偏好 |
| `src/hooks/useAnalytics.ts` | 埋点 React hooks |
| `src/pages/Privacy.tsx` | 隐私政策 |
| `src/pages/Landing.tsx` | 营销页和分析初始化入口 |
| `src/router.tsx` | 路由配置 |
| `src/main.tsx` | React 渲染入口 |
| `src/components/RadialMenu.tsx` | 径向菜单演示 |
| `src/lib/utils.ts` | `cn()` 等工具函数 |
| `public/_redirects` | Cloudflare SPA 回退 |
| `vercel.json` | Vercel SPA 配置 |
| `.github/workflows/deploy.yml` | CI/CD 工作流 |
| `.trae/rules/git-commit-message.md` | 原子提交规则 |
| `docs/analytics-tracking-plan.md` | 埋点方案 |

---

## 不要做的事

- 不要使用 pnpm/yarn，只使用 npm
- 不要提交 `.env`、token、API Key 或其他密钥
- 不要直接在 `main` 或 `dev` 分支提交或 push
- 不要自动解决 Git 冲突或使用强制 push
- 不要把无关改动合并进同一 commit
- 不要创建假的占位图片或无必要的新文件
- 不要随意添加埋点事件、收集敏感数据或绕过用户授权
- 不要移除 Cookie 授权、隐私政策、分析偏好入口或 Clarity mask
- 不要修改 `public/_redirects` 的 SPA 回退规则
- 不要在 Vercel 部署中移除 `--prebuilt`
- 不要写错或移除 `VITE_` 环境变量前缀
