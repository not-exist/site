# 2026-10-25 迁移方案：Firefly → Twilight

## 背景与目标

原站点基于 Astro 7 + Firefly 主题（6.16.8，与上游 CuteLeaf/Firefly master 完全同步），以纯静态方式部署在 Cloudflare Workers，自定义域名 `log.ilnbam1.xyz`。

目标：迁移到 [Spr-Aachen/Twilight](https://github.com/Spr-Aachen/Twilight)（受 Fuwari 启发的 Astro 博客模板，MIT，2026-10 仍活跃更新）。

迁移原则：

1. 现有内容与 URL 保持不变（SEO / 外链）。
2. 部署方式不变（Cloudflare Workers 静态资产 + 自定义域名）。
3. 可随时回滚（Firefly 版本打 tag `firefly-6.16.8-archive` 存档）。

## 可行性

两个主题高度同源（Twilight 原型即 Fuwari）：同为 Astro + Svelte + content collections + Pagefind + Expressive Code，文章 frontmatter 几乎一致，迁移成本低。Twilight 额外能力：Decap CMS、文章加密、diary/相册/时间线、三语 UI、Waline/Twikoo 评论、音乐播放器、粒子效果。

## 内容映射（实际执行）

| Firefly | Twilight | 说明 |
| --- | --- | --- |
| `posts/welcome.md` | `src/content/posts/welcome.md` | 去掉 `slug` 字段（Twilight 无此字段，文件名即 URL），保留 `pinned` |
| `posts/10.16-A.md`（slug: 10-16-a） | `src/content/posts/10-16-a.md` | **改名保 URL** `/posts/10-16-a/` |
| `spec/about.md` | `src/content/about.md` | spec 集合，补 frontmatter |
| `spec/guestbook.md` | `src/content/guestbook.md` + `src/pages/guestbook.astro` | Twilight 无内置留言板，仿 about.astro 自建页面 |
| `spec/friends.mdx`（MDX 自带数据/布局） | `src/content/friends.md`（纯 Markdown） | Twilight 友链卡片走 `src/content/friends/*.json`；暂无友链，站信息/注意事项/申请流程转 Markdown |
| `siteConfig.ts` / `profileConfig.ts` / `navBarConfig.ts` / `announcementConfig.ts` | `twilight.config.yaml` | 标题/域名/hue 165/system/Asia/Shanghai(UTC+8)/头像/签名/GitHub+Email+RSS+Atom 链接 |
| 壁纸（src/assets 桌面 d1-d6 + 移动 m1-m6，banner 模式） | `public/assets/images/wallpapers/` + `site.wallpaper` | 轮播 + Ken Burns |
| 音乐（local 模式单曲「使一颗心免于哀伤」） | `public/assets/music/` + `musicPlayer.local.playlist` | 关闭自动播放 |
| 许可证 CC BY-NC-SA 4.0 | `post.license` | 相同 |
| 评论（未启用） | `post.comment.enable: false` | 后续可切 Waline/Twikoo |
| PIO 看板娘（Firefly 亦未启用） | `pio.enable: false` | Spine 模型与 Twilight 的 Live2D 运行时不兼容，不迁移 |
| favicon / logo（Firefly 吉祥物） | Twilight 默认 favicon | 站点未定制过图标 |
| `wrangler.jsonc` / `.nvmrc`（Node 22.23） | 原样保留 | Workers 静态资产部署；Twilight 无 engines 限制 |

导航简化为扁平结构：主页 / 归档 / 友链 / 留言 / 关于（Twilight 的下拉菜单需要真实落地页，原「文章/社交/我的/关于」子菜单中的动态、相册、书签、打赏、追番等页面 Twilight 无对应物且均为占位内容，故移除；分类/标签由侧栏组件承载）。

## 基础设施调整

- `astro.config.mjs`：适配器逻辑改为「无平台环境变量时输出纯静态」（原默认 Vercel serverless），保留 CF_PAGES/NETLIFY/EDGEONE/VERCEL 分支。
- 移除 Twilight 自带的 `vercel.json`、`.pages.yml`、`Dockerfile`、`docker-compose.yml`、`esa.jsonc`、`.github/`。
- Decap CMS（`.decap.yml` + OAuth）：保持禁用；如需后台管理再配 OAuth（secret 走 Cloudflare 环境变量）。
- OG 图片生成保持关闭（`generateOgImages: false`），与原 Firefly 开启状态不同，构建更快；如需再开。
- `AGENTS.md` / `README.md` 重写为 Twilight 结构。

## 验证

- `pnpm check`、`pnpm type-check`、`pnpm build`
- `pnpm preview` 逐页对比：首页、归档、`/posts/10-16-a/`、about、friends、guestbook、RSS/Atom、搜索

## 回滚

`git revert` 迁移提交，或从 `firefly-6.16.8-archive` tag 重建 main。

## 执行记录（2026-10-25）

- 迁移以单个提交完成并合入 main，Firefly 版本存档于 tag `firefly-6.16.8-archive`。
- 迁移期间 origin/main 被并行推进为 Fuwari 适配版（含新文章《痛苦是/不是构成生命意义的必要条件》与 wrangler devDependency 恢复）。处理：以 `-s ours` 策略合并保留 Twilight 文件树并接入历史，随后单独移植新文章（`10-24-a.md`，frontmatter 天然兼容）与 wrangler devDependency（Cloudflare 部署命令 `pnpm exec wrangler deploy` 需要）。
- 实际与原计划的偏差：导航扁平化（主页/归档/友链/留言/关于）；favicon 沿用 Twilight 默认；OG 图片生成保持关闭；`tsconfig.json` 增加 `skipLibCheck`，`type-check` 移除 `--isolatedDeclarations`（上游代码不满足该模式）。
- 验证：`pnpm check` / `type-check` / `build` 通过；preview 下 `/`、`/posts/10-16-a/`、`/posts/10-24-a/`、`/posts/welcome/`、`/about/`、`/friends/`、`/guestbook/`、`/archive/`、RSS/Atom 均 200，RSS 3 条目，sitemap 正确。
