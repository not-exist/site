# 个人静态博客替换方案设计

日期：2026-10-18
状态：已确认，实施中

## 目标

将当前仓库（Cloudflare Worker "Hello world" 项目）替换为一个好看的纯静态个人博客，保留现有 Cloudflare Worker 连接与 git 推送链路。

## 决策记录

| 决策点 | 选择 | 理由 |
|---|---|---|
| 框架 | Astro 5 | 2026 社区默认推荐；默认零 JS、Content Collections 类型安全、Cloudflare 部署顺畅 |
| 主题 | Firefly（CuteLeaf/Firefly） | 基于 Fuwari 二次开发，双侧边栏/瀑布流、Pagefind 搜索、友链、公告、RSS、Mermaid；中文文档丰富 |
| 部署 | 保留 Worker 连接，改静态资产模式 | Cloudflare 官方方向（Pages 已并入 Workers）；推送后 Workers Builds 自动构建部署 |
| 语言 | 中文为主（zh-CN） | 站点 lang 与默认文案中文化 |
| 评论/统计 | 不接 | 纯静态约束下评论需外部服务端，YAGNI；搜索等内置能力已满足写作需求 |

## 架构

以 Firefly 主题仓库整体替换当前仓库内容。Astro 构建产物为纯静态 `dist/`，无服务端、无数据库。

```
git push → Cloudflare Workers Builds → npm run build → npx wrangler deploy → dist/ 静态资产 → CDN 边缘分发
```

## 仓库结构（Firefly 标准结构）

- `astro.config.ts` — site URL、mdx、sitemap、pagefind
- `src/config/` — 主题配置集中地（siteConfig.ts、navBarConfig.ts 等），定制不改组件源码，便于后续同步主题更新
- `src/content/posts/` — Markdown 文章
- `src/pages/`、`src/components/`、`src/styles/` — 主题页面与组件
- `wrangler.jsonc` — 静态资产模式：`assets: { directory: "./dist" }`，无 `main` 入口
- `package.json` — Firefly 依赖与脚本（dev / build / preview）

删除原 Worker 的 `src/index.js` 与旧 `wrangler.jsonc`。

## 配置与内容（全部使用占位符）

- `siteConfig.ts`：`lang: "zh-CN"`；站点标题、作者名、简介暂用占位符（not-exist / not-exist 的博客），上线后可改
- 站点 URL 暂用 Cloudflare 分配的 `*.workers.dev`，绑自定义域名时只改一处
- 删除 Firefly 自带英文示例文章；放 1 篇中文欢迎占位文章 + 关于页占位简介；友链页保留结构留空
- 暗色模式、响应式、Pagefind 搜索、RSS、Mermaid 为内置默认能力

## 验证方式

1. 本地 `npm run build` 成功产出 `dist/`
2. `npx wrangler dev` 静态资产服务 curl 首页 200，返回 Firefly 渲染 HTML
3. `git push` 后 Cloudflare 自动构建部署成功
4. 线上 workers.dev 域名访问：暗色切换、搜索、移动端布局正常

## 范围外（YAGNI）

评论系统、统计埋点、自定义域名、i18n 双语、CMS 后台。
