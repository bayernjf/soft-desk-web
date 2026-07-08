# 双平台部署方案：Cloudflare Pages + Vercel

> 本方案实现代码推送到 GitHub 后，自动同时部署到 Cloudflare Pages 和 Vercel

---

## 📋 前置条件

1. GitHub 账号（项目已托管在 GitHub）
2. Cloudflare 账号（免费即可）
3. Vercel 账号（免费即可）
4. 本地已安装 Git

---

## 🔧 Step 1：准备项目配置文件

以下文件已创建，直接使用：

| 文件 | 用途 |
|------|------|
| `vercel.json` | Vercel 构建配置 + SPA 路由回退 |
| `public/_redirects` | Cloudflare Pages SPA 路由回退 |
| `wrangler.toml` | Cloudflare Wrangler CLI 配置 |
| `.github/workflows/deploy.yml` | GitHub Actions 自动部署工作流 |

---

## ☁️ Step 2：配置 Cloudflare Pages

### 2.1 创建 Cloudflare API Token

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 点击右上角头像 → **My Profile** → **API Tokens**
3. 点击 **Create Token** → 选择 **Use template** → 选择 **Cloudflare Pages**
4. 权限设置：
   - `Account > Pages > Edit`
   - `Account > Workers Scripts > Edit`（可选）
5. 设置 **Zone Resources** → `Include > All zones`
6. 点击 **Continue to summary** → **Create Token**
7. 复制生成的 Token（只显示一次，保存好）

### 2.2 获取 Cloudflare Account ID

1. 登录 Cloudflare Dashboard
2. 查看页面右下角，找到 **Account ID**
3. 复制保存

### 2.3 创建 Cloudflare Pages 项目

1. Cloudflare Dashboard → **Pages** → **Create a project**
2. 选择 **Connect to Git**
3. 选择你的 GitHub 仓库 `soft-desk-landing`
4. **Build settings**：
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`
5. 点击 **Save and Deploy**（第一次手动部署）

---

## 🚀 Step 3：配置 Vercel

### 3.1 创建 Vercel Project

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **Add New...** → **Project**
3. 导入 GitHub 仓库 `soft-desk-landing`
4. Vercel 会自动识别 Vite 项目，点击 **Deploy**

### 3.2 获取 Vercel Token

1. Vercel Dashboard → **Settings** → **Tokens**
2. 点击 **Create Token**
3. 名称：`GitHub Actions`
4. 权限：`Full Access` 或 `Deployments: Read/Write`
5. 点击 **Create** → 复制 Token

### 3.3 获取 Vercel Org ID 和 Project ID

1. 进入你的 Vercel 项目
2. 点击 **Settings** → **General**
3. 找到 **Project ID** 并复制
4. 找到 **Organization ID** 并复制

---

## 🗝️ Step 4：配置 GitHub Secrets

1. 进入你的 GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**，添加以下 Secrets：

| Secret Name | 值来源 |
|-------------|--------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token（Step 2.1） |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID（Step 2.2） |
| `VERCEL_TOKEN` | Vercel Token（Step 3.2） |
| `VERCEL_ORG_ID` | Vercel Organization ID（Step 3.3） |
| `VERCEL_PROJECT_ID` | Vercel Project ID（Step 3.3） |

---

## ⚙️ Step 5：配置环境变量（埋点必需）

在 **两个平台** 都需要配置以下环境变量：

### Cloudflare Pages
1. Pages → 你的项目 → **Settings** → **Environment variables**
2. 添加：
   ```
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   VITE_CLARITY_PROJECT_ID=xxxxxxxxxxxx
   ```

### Vercel
1. Vercel → 你的项目 → **Settings** → **Environment Variables**
2. 添加：
   ```
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   VITE_CLARITY_PROJECT_ID=xxxxxxxxxxxx
   ```

---

## 🔄 Step 6：测试自动部署

1. 本地修改代码：
   ```bash
   git add .
   git commit -m "test: trigger deployment"
   git push origin main
   ```

2. 查看部署状态：
   - GitHub 仓库 → **Actions** tab
   - 应该看到 `Deploy to Cloudflare Pages & Vercel` workflow 正在运行

3. 验证部署结果：
   - Cloudflare Pages：`https://<your-project>.pages.dev`
   - Vercel：`https://<your-project>.vercel.app`

---

## 📍 Step 7：自定义域名（可选）

### Cloudflare Pages
1. Pages → 项目 → **Custom domains** → **Set up a custom domain**
2. 输入域名（如 `soft-desk.example.com`）
3. Cloudflare 会自动配置 DNS 记录

### Vercel
1. Vercel → 项目 → **Settings** → **Domains**
2. 输入域名
3. 添加 Vercel 的 DNS 记录到你的域名解析商

---

## 📊 双平台对比与分工建议

| 用途 | Cloudflare Pages | Vercel |
|------|------------------|--------|
| **主生产环境** | ✅ 推荐（全球加速强、免费流量无限制） | 备用 |
| **预览环境** | PR 预览 | ✅ 推荐（预览体验好） |
| **埋点数据** | GA4 + Clarity | GA4 + Clarity |
| **CI/CD** | GitHub Actions | 内置 + GitHub Actions |

**建议分工**：
- **Cloudflare Pages**：作为主生产环境，对外提供访问
- **Vercel**：作为预览/备用环境，用于开发测试

---

## 🐛 常见问题

### Q: 部署后刷新页面 404？
A: 确保已配置 SPA 路由回退：
- Cloudflare: `public/_redirects` 文件已包含 `/* /index.html 200`
- Vercel: `vercel.json` 已配置 routes 规则

### Q: 环境变量不生效？
A: 环境变量需要在平台设置中添加，且需要重新部署才能生效。

### Q: GitHub Actions 部署失败？
A: 检查 Secrets 是否正确配置，查看 Action 日志中的错误信息。

### Q: Cloudflare Pages 构建失败？
A: 检查 Node.js 版本是否为 20.x，可在项目设置中指定。