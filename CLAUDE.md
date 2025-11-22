# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Nexty 是一个基于 Next.js 15、React 19 和 PostgreSQL 的全栈 SaaS 样板项目,集成了认证、支付、AI、国际化等完整功能。

## 常用命令

### 开发与构建
```bash
pnpm dev              # 启动开发服务器 (默认 http://localhost:3000)
pnpm dev:turbo        # 使用 Turbopack 启动开发服务器
pnpm build            # 生产构建
pnpm start            # 启动生产服务器
pnpm lint             # 运行 ESLint 检查
pnpm analyze          # 构建并启用 bundle 分析器
```

### 数据库操作 (Drizzle ORM)
```bash
pnpm db:generate      # 根据 schema 生成迁移文件
pnpm db:migrate       # 执行迁移
pnpm db:push          # 直接推送 schema 到数据库(跳过迁移)
pnpm db:studio        # 打开 Drizzle Studio 可视化界面
pnpm db:seed          # 运行种子脚本 (lib/db/seed/index.ts)
```

**重要**: 项目使用 pnpm,不要使用 npm 或 yarn。

## 核心架构

### 技术栈
- **框架**: Next.js 15 (App Router) + React 19
- **语言**: TypeScript
- **样式**: Tailwind CSS 4 + shadcn/ui
- **认证**: Better Auth + Drizzle adapter (支持 Google/GitHub 登录)
- **数据库**: PostgreSQL + Drizzle ORM
- **支付**: Stripe (订阅制和一次性付款)
- **存储**: Cloudflare R2 (S3 兼容)
- **邮件**: Resend
- **国际化**: next-intl (支持英语、中文、日语)
- **状态管理**: Zustand
- **AI集成**: ai-sdk (支持 OpenAI、Anthropic、Google、DeepSeek、XAI、Replicate 等)

### 项目结构

```
app/
  [locale]/           # 国际化路由 (en/zh/ja)
    (basic-layout)/   # 基础布局页面
    (protected)/      # 需要认证的页面
      dashboard/      # 用户面板
        (admin)/      # 管理员页面
  api/                # API 路由处理器
  (site)/             # 站点页面

components/
  ui/                 # shadcn/ui 基础组件
  [feature]/          # 按功能组织的组件

lib/
  auth/               # Better Auth 配置 (服务端/客户端)
  db/                 # Drizzle ORM schema、迁移、种子脚本
    schema.ts         # 数据库 schema 定义
    migrations/       # 迁移文件
    seed/             # 种子数据
  stripe/             # Stripe SDK 初始化
  cloudflare/         # R2 存储辅助函数
  resend/             # Resend 客户端
  api-response.ts     # API 统一响应格式
  action-response.ts  # Server Action 统一响应格式

actions/              # Server Actions (业务逻辑)
  stripe/             # Stripe 相关操作
  resend/             # 邮件发送操作

i18n/
  messages/           # 翻译文件 (en.json, zh.json, ja.json)
  routing.ts          # 语言路由配置
  request.ts          # 国际化请求处理

emails/               # React 邮件模板
config/               # 项目配置 (站点、颜色、模型)
stores/               # Zustand 状态存储
types/                # TypeScript 类型定义
content/              # 静态内容 (隐私政策、服务条款等)
blogs/                # MDX 博客内容 (按语言组织)
```

### 路由架构

- **中间件** (`middleware.ts`): 处理 next-intl 语言路由和推荐来源 cookie
- **语言前缀**: 所有页面路由通过 `/[locale]/` 前缀支持多语言
- **保护路由**: 受保护的页面位于 `(protected)` 路由组,需要认证
- **管理员页面**: 使用 `isAdmin()` (lib/auth/server.ts) 检查权限
- **默认重定向**: `/dashboard` → `/dashboard/settings` (见 next.config.mjs)

## 关键开发规范

### 1. Next.js 最佳实践

- **优先使用服务端组件 (RSC)**: 除非需要交互性、浏览器 API 或 React hooks,否则使用 Server Components
- **数据获取**: 在 Server Components 中使用 `async/await` 直接获取数据
- **Server Actions 优先**: 对于表单提交和数据变更,优先使用 Server Actions (在 `actions/` 目录中集中管理)
- **统一响应格式**:
  - API 路由: 使用 `lib/api-response.ts` 中的辅助函数
  - Server Actions: 使用 `lib/action-response.ts` 中的辅助函数
- **元数据**: 使用 Metadata API 进行 SEO 优化

### 2. 国际化 (i18n)

- **翻译 hook**:
  - Server Components: `import { getTranslations } from 'next-intl/server'`
  - Client Components: `import { useTranslations } from 'next-intl'`
- **所有用户可见文本必须国际化**,包括 UI 文本、错误消息、表单验证等
- **避免硬编码字符串**,使用 `t('key', { param })` 进行插值
- **支持语言**: en (英语)、zh (中文)、ja (日语)
- **翻译文件路径**: `i18n/messages/{locale}.json`
- **格式化**: 使用 `useFormatter` (客户端) 或 `getFormatter` (服务端) 进行日期、时间、数字、货币格式化

### 3. 认证 (Better Auth + Drizzle)

- **Session 获取**:
  - Server Components/Actions: `auth.api.getSession({ headers })`
  - Client Components: 使用 `lib/auth/auth-client.ts` 中的 `authClient`
- **权限检查**:
  - 认证保护: `getSession()` (lib/auth/server.ts)
  - 管理员检查: `isAdmin()` (lib/auth/server.ts)
- **数据库 Schema**: 使用 `lib/db/schema.ts` 中导出的表,不要创建重复的 schema
- **社交登录**: 在 `lib/auth/index.ts` 的 `socialProviders` 中配置
- **Magic Link**: 通过 `actions/resend` 和 `emails/magic-link-email.tsx` 发送

### 4. 数据库操作 (Drizzle)

- **DB 实例**: 使用 `lib/db/index.ts` 中的共享 `db` 实例,不要创建新连接
- **Schema**: 所有表定义在 `lib/db/schema.ts`
- **查询**: 使用 Drizzle 的类型化 DSL (`select`, `insert`, `update`, `delete`)
- **条件**: 使用 `eq`, `and`, `or` 等辅助函数,避免手写 SQL 字符串
- **迁移工作流**:
  1. 修改 `lib/db/schema.ts`
  2. 运行 `pnpm db:generate` 生成迁移
  3. 运行 `pnpm db:migrate` 应用迁移

### 5. API 和数据处理

- **验证**: 使用 `zod` 进行输入验证,客户端错误返回 4xx
- **错误处理**: 不要向客户端抛出原始错误,使用统一的响应格式
- **Rate Limiting**: 对公开 API 考虑使用 Upstash (`lib/upstash`)
- **外部服务**:
  - Stripe: 使用 `lib/stripe` 单例和 `actions/stripe/*`
  - R2: 使用 `lib/cloudflare/r2.ts` 中的辅助函数
  - Resend: 使用 `actions/resend` 和 `lib/resend`

### 6. Stripe 集成

- **初始化**: 受 `NEXT_PUBLIC_ENABLE_STRIPE` 和 `STRIPE_SECRET_KEY` 控制
- **Webhook**: 在 `app/api/stripe/webhook/route.ts` 处理,分发到 `webhook-handlers.ts`
- **关键 Webhook 处理器**:
  - `handleCheckoutSessionCompleted`: 一次性支付和订阅
  - `handleInvoicePaid`: 订阅发票支付
  - `handleSubscriptionUpdate`: 订阅更新/取消
  - `handleRefund`: 退款处理
  - `handleEarlyFraudWarningCreated`: 欺诈警告
- **Metadata**: 使用 `metadata.userId` 和 `metadata.planId` 关联 Stripe 对象到本地实体
- **必需环境变量**: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_CUSTOMER_PORTAL_URL`

### 7. AI 集成

- **支持的提供商**: OpenAI, Anthropic, Google, DeepSeek, XAI, OpenRouter, Replicate
- **API 路由**: 在 `app/api/ai-demo/` 中 (single-chat, multi-chat, text-to-image, etc.)
- **客户端使用**: 使用 `@ai-sdk/react` 的 hooks (`useChat`, `useCompletion`)
- **安全**: 所有 API 密钥必须在服务端初始化,不要在客户端导入
- **示例组件**: 参考 `components/ai-demo/`

### 8. 组件开发

- **UI 组件**: 使用 `components/ui/` 中的 shadcn/ui 组件
- **复用现有组件**: 查看项目已有组件,避免重复造轮子,保持视觉一致性
- **动态导入**: 使用 `next/dynamic` 延迟加载非关键组件
- **图片**: 使用 `next/image` 进行优化
- **链接**: 使用 `next/link` 进行内部导航

### 9. 环境变量

核心必需变量:
- `DATABASE_URL`: PostgreSQL 连接字符串
- `BETTER_AUTH_SECRET`: Better Auth 密钥
- `NEXT_PUBLIC_BETTER_AUTH_URL`: Better Auth URL
- `NEXT_PUBLIC_SITE_URL`: 站点 URL

可选功能变量:
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- R2: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`
- Resend: `RESEND_API_KEY`, `ADMIN_EMAIL`
- AI: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, 等

完整列表见 `.cursor/rules/12-env-variables.mdc`

## 开发工作流

1. **启动开发服务器**: `pnpm dev`
2. **修改 Schema**: 编辑 `lib/db/schema.ts` → `pnpm db:generate` → `pnpm db:migrate`
3. **添加翻译**: 在 `i18n/messages/*.json` 中为所有语言添加翻译键
4. **创建 API**: 优先使用 Server Actions (`actions/`),否则使用 Route Handlers (`app/api/`)
5. **测试支付**: 确保 Webhook 签名验证正确,使用 Stripe CLI 本地测试
6. **JSON 文件编辑后**: 进行格式检查,确保 JSON 有效

## 注意事项

- **包管理器**: 必须使用 pnpm
- **Next.js 版本**: 15 (App Router,不是 Pages Router)
- **React 版本**: 19
- **控制台日志**: 生产环境会移除 `console.*` (除了 `console.error`)
- **类型安全**: 充分利用 TypeScript 和 Drizzle 的类型推断
- **安全**: 不要提交 `.env` 文件或将密钥暴露给客户端
- **响应式设计**: 所有 UI 必须在各种设备上适配
- **可访问性**: 遵循 WCAG 标准,使用语义化 HTML

## 文档与支持

- 官方文档: https://nexty.dev/docs
- 路线图: https://nexty.dev/roadmap
- Discord 社区: https://discord.gg/VRDxBgXUZ8
- 联系邮箱: hi@nexty.dev

## 代码质量检查

- 编辑文件后使用 `context7` MCP 确保代码质量
- 完成开发任务后在本地进行验收检查和调试
- 必要时调用相关 agent 协助一次性完成任务开发
