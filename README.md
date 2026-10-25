# not-exist 的博客

基于 [Astro](https://astro.build/) + [Twilight](https://github.com/Spr-Aachen/Twilight) 主题的个人静态博客，部署于 Cloudflare Workers（自定义域名 `log.ilnbam1.xyz`）。

## 常用命令

```bash
pnpm install        # 安装依赖
pnpm dev            # 本地开发服务器
pnpm check          # Astro 诊断
pnpm type-check     # TypeScript 检查
pnpm build          # 生成图标 + Pagefind + 静态构建，输出到 dist/
pnpm preview        # 本地预览生产构建
pnpm new-post       # 新建文章脚手架
```

## 目录结构

- `twilight.config.yaml` — 站点主配置（标题/域名/导航/侧栏/壁纸/音乐等）
- `src/content/posts/` — 博客文章（Markdown，文件名即 URL：`10-16-a.md` → `/posts/10-16-a/`）
- `src/content/` — about / friends / guestbook 等页面内容（spec 集合）
- `src/content/friends/` — 友链数据（JSON，每友链一个文件）
- `src/pages/` — 路由（`guestbook.astro` 为自定义留言板页）
- `public/` — 静态资产（头像、壁纸、音乐）
- `docs/plans/` — 设计与迁移文档

## 部署

`pnpm build` 产出纯静态 `dist/`，由 `wrangler.jsonc` 以 Cloudflare Workers 静态资产模式托管。`astro.config.mjs` 在未设置平台环境变量（`CF_PAGES`/`NETLIFY`/`EDGEONE`/`VERCEL`）时输出纯静态；`.nvmrc` 固定 Cloudflare 构建使用的 Node 版本。

## 上游同步

主题源码来自 [Spr-Aachen/Twilight](https://github.com/Spr-Aachen/Twilight)，站点定制集中在 `twilight.config.yaml`、`src/content/`、`src/pages/guestbook.astro` 与部署文件，便于后续同步主题更新。Firefly 旧版见 tag `firefly-6.16.8-archive`。
