# SoftDesk Web 埋点方案

> 版本：v1.0 | 更新日期：2026-07-07 | 负责人：产品&研发

## 1. 目标

通过数据埋点追踪用户在落地页和演示 App 中的行为，为产品迭代、商业化转化和用户体验优化提供数据支撑。

## 2. 埋点工具

| 工具 | 用途 | 费用 |
|------|------|------|
| Google Analytics 4 (GA4) | 流量分析、漏斗、留存 | 免费 |
| Microsoft Clarity | 热力图、会话回放 | 免费 |

### 接入方式

- **GA4**：通过 `gtag.js` 脚本注入，使用 `MEASUREMENT_ID` 环境变量
- **Clarity**：通过 `clarity.js` 脚本注入，使用 `CLARITY_PROJECT_ID` 环境变量
- 环境变量通过 `.env` 文件管理，不提交到仓库

## 3. 事件清单

### 3.1 通用约定

- 所有事件名使用 `snake_case`
- 所有属性名使用 `snake_case`
- `page_path`、`page_title` 由 GA4 自动采集，不自定义
- 自定义参数不超过 10 个/事件

### 3.2 落地页事件

#### 3.2.1 页面浏览

| 事件名 | 触发时机 | 参数 |
|--------|---------|------|
| `page_view` | 页面加载完成 | `page_path`(自动), `page_title`(自动) |
| `landing_section_view` | 落地页各 section 进入视口 | `section_name`: hero / features / radial_menu / workflow / favorites / ai / theme / cta |
| `cta_click` | 点击 CTA 按钮 | `cta_text`, `cta_location`: hero / bottom / nav |

#### 3.2.2 径向菜单演示

| 事件名 | 触发时机 | 参数 |
|--------|---------|------|
| `radial_demo_try_click` | 点击"点击体验径向菜单"按钮 | — |
| `radial_demo_open` | 径向菜单在演示区弹出 | — |
| `radial_demo_slot_hover` | 鼠标悬停扇区 | `slot_index`, `item_name`, `item_type` |
| `radial_demo_launch` | 点击扇区启动 | `slot_index`, `item_name`, `item_type` |
| `radial_demo_page_switch` | 滚轮切换页面 | `from_page`, `to_page`, `direction` |
| `radial_demo_close` | 关闭径向菜单 | `close_method`: click_outside / esc / slot_click |

#### 3.2.3 功能介绍交互

| 事件名 | 触发时机 | 参数 |
|--------|---------|------|
| `feature_card_click` | 点击功能卡片 | `feature_name`: favorites / workflow / radial_menu / ai / theme |
| `theme_toggle` | 切换主题 | `from_theme`, `to_theme` |
| `scroll_depth` | 页面滚动深度里程碑 | `depth_percent`: 25 / 50 / 75 / 100 |

### 3.3 演示 App 事件

#### 3.3.1 导航与页面

| 事件名 | 触发时机 | 参数 |
|--------|---------|------|
| `app_enter` | 进入演示 App | `referrer`: landing / direct |
| `app_page_view` | App 内页面切换 | `page_name`: dashboard / software / favorites / workflows / radial_menu / shares / stats / cleanup / settings |
| `sidebar_nav_click` | 点击侧边栏菜单 | `nav_item`, `nav_index` |

#### 3.3.2 核心功能使用

| 事件名 | 触发时机 | 参数 |
|--------|---------|------|
| `radial_menu_open` | 唤出径向菜单 | `trigger`: middle_click / button |
| `radial_menu_slot_hover` | 鼠标悬停扇区 | `slot_index`, `item_name`, `item_type`, `page_index` |
| `radial_menu_launch` | 通过径向菜单启动 | `slot_index`, `item_name`, `item_type`, `target_id`, `page_index` |
| `radial_menu_page_switch` | 滚轮翻页 | `from_page`, `to_page`, `direction` |
| `radial_menu_close` | 关闭径向菜单 | `close_method`, `duration_ms` |

#### 3.3.3 收藏夹

| 事件名 | 触发时机 | 参数 |
|--------|---------|------|
| `favorite_add` | 添加收藏 | `item_name`, `item_type` |
| `favorite_remove` | 取消收藏 | `item_name`, `item_type` |
| `favorite_view` | 查看收藏夹页面 | `item_count` |

#### 3.3.4 工作流

| 事件名 | 触发时机 | 参数 |
|--------|---------|------|
| `workflow_create` | 创建工作流 | `workflow_name`, `step_count` |
| `workflow_run` | 运行工作流 | `workflow_id`, `workflow_name`, `step_count` |
| `workflow_delete` | 删除工作流 | `workflow_id` |
| `workflow_favorite` | 收藏工作流 | `workflow_id` |

#### 3.3.5 AI 功能

| 事件名 | 触发时机 | 参数 |
|--------|---------|------|
| `ai_settings_open` | 打开 AI 设置页 | — |
| `ai_toggle` | 开关 AI 功能 | `feature`: smart_grouping / ai_suggestions, `enabled`: boolean |
| `ai_model_add` | 添加 AI 模型配置 | `provider` |
| `ai_model_edit` | 编辑 AI 模型配置 | `provider` |
| `ai_model_delete` | 删除 AI 模型配置 | `provider` |
| `ai_model_toggle` | 启用/停用模型 | `provider`, `enabled`: boolean |

#### 3.3.6 设置

| 事件名 | 触发时机 | 参数 |
|--------|---------|------|
| `settings_open` | 打开设置页 | `active_tab`: general / appearance / ai / privacy |
| `settings_change` | 修改设置项 | `setting_key`, `setting_value` |

## 4. 用户属性

| 属性名 | 说明 | 取值 |
|--------|------|------|
| `user_type` | 用户类型 | visitor / demo_user |
| `first_visit_date` | 首次访问日期 | YYYY-MM-DD |
| `theme_preference` | 主题偏好 | light / dark |
| `has_used_radial_menu` | 是否用过径向菜单 | true / false |
| `has_created_workflow` | 是否创建过工作流 | true / false |
| `has_configured_ai` | 是否配置过 AI | true / false |

## 5. 关键漏斗

### 5.1 落地页转化漏斗

```
page_view → landing_section_view(radial_menu) → radial_demo_try_click → radial_demo_open → app_enter
```

### 5.2 径向菜单使用漏斗

```
radial_menu_open → radial_menu_slot_hover → radial_menu_launch
```

### 5.3 功能探索漏斗

```
app_enter → app_page_view(dashboard) → app_page_view(workflows) → workflow_create
```

### 5.4 AI 功能转化漏斗

```
ai_settings_open → ai_toggle(enabled) → ai_model_add → ai_model_toggle(enabled)
```

## 6. 数据看板规划

### 6.1 流量概览看板

- UV / PV / 新访客占比
- 流量来源分布
- 落地页跳出率
- 页面平均停留时长

### 6.2 功能使用看板

- 径向菜单：唤出次数、启动次数、翻页次数
- 工作流：创建数、运行数、收藏数
- 收藏夹：添加数、查看数
- AI 功能：开关次数、模型配置数

### 6.3 转化看板

- 落地页 → 演示 App 转化率
- 演示 App 各功能渗透率
- 核心功能使用留存

### 6.4 体验看板

- 页面加载时间
- JS 错误率
- 热力图分析（Clarity）
- 会话回放（Clarity）

## 7. 技术实现

### 7.1 架构

```
src/lib/analytics.ts    # 统一埋点 SDK
├── initAnalytics()     # 初始化 GA4 + Clarity
├── track(event, params) # 通用埋点函数
├── trackPageView()     # 页面浏览
└── setUserProperty()   # 设置用户属性
```

### 7.2 环境变量

```env
# .env.local
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_CLARITY_PROJECT_ID=xxxxxxxxxxxx
```

### 7.3 调用示例

```typescript
import { track } from '@/lib/analytics';

// 简单事件
track('radial_menu_open', { trigger: 'middle_click' });

// 页面浏览
trackPageView('/app');
```

### 7.4 开发环境处理

- 开发环境（`dev`）下埋点不发送真实数据
- 通过 `console.debug` 输出事件信息，便于调试
- 生产环境自动加载 GA4 和 Clarity 脚本

## 8. 隐私合规

- 不收集 PII（个人身份信息）
- IP 地址由 GA4 自动匿名化
- 遵守 GDPR / CCPA，提供 Cookie 同意选项
- 隐私政策中说明数据收集范围

## 9. 上线检查清单

- [ ] GA4 Measurement ID 配置正确
- [ ] Clarity Project ID 配置正确
- [ ] 开发环境不发送数据
- [ ] 关键事件可在 GA4 DebugView 中验证
- [ ] 隐私政策页面已上线
- [ ] Cookie 同意弹窗已添加（如需）
