# Repository Guidelines

## Project Structure & Module Organization

This is an Astro 5 static blog using the [Twilight](https://github.com/Spr-Aachen/Twilight) theme with Svelte islands and TypeScript configuration. Main source code lives in `src/`: routes in `src/pages`, layouts in `src/layouts`, reusable UI in `src/components`, styles in `src/styles`, content in `src/content` (posts in `src/content/posts`, page copy in the `spec` collection, friend links as JSON files in `src/content/friends`), helpers in `src/utils`, and Markdown/HTML plugins in `src/plugins`. Site configuration is centralized in `twilight.config.yaml` (typed by `src/types/config.ts` and loaded via `src/config.ts`); keep site customization in the YAML and content files so theme code stays close to upstream. Static files served directly belong in `public`. Design and migration docs live in `docs/plans`. Deployment uses Cloudflare Workers static assets via `wrangler.jsonc`; `.nvmrc` pins the Node version used by Cloudflare builds.

## Build, Test, and Development Commands

Use `pnpm`.

- `pnpm dev`: run the local Astro dev server (generates icons first).
- `pnpm check`: run Astro diagnostics.
- `pnpm type-check`: run TypeScript with `--noEmit`.
- `pnpm build`: generate icons, run the Astro build, and produce Pagefind search output in `dist`.
- `pnpm preview`: preview the production build locally.
- `pnpm new-post`: scaffold a new content post.

## Coding Style & Naming Conventions

Formatting follows the Twilight theme style: 4-space indentation, double quotes for JavaScript/TypeScript strings. Keep Astro and Svelte components in `PascalCase` (`PostCard.astro`, `Search.svelte`). Blog post URLs derive from the file name (`10-16-a.md` → `/posts/10-16-a/`); there is no separate slug field, so name files after the desired URL. Avoid unrelated formatting churn so upstream theme updates stay easy to merge.

## Testing Guidelines

There is no dedicated unit-test framework configured. Before submitting changes, run `pnpm check`, `pnpm type-check`, and `pnpm build` for rendering, content, or generated asset work. For visual or interactive changes, verify with `pnpm dev` or `pnpm preview` and include screenshots in the PR. Name future tests near the feature they cover, using the local file name as the stem.

## Commit & Pull Request Guidelines

Use Conventional Commits, matching the current history: `feat: ...`, `fix: ...`, and `chore: ...`. Keep commits and PRs focused on one concern. PRs should include a concise summary, linked issues when relevant, validation commands run, and screenshots for UI changes. Discuss major features or design changes in an issue or discussion before implementation.

## Security & Configuration Tips

Do not commit secrets, tokens, or service keys. `.env` is gitignored and currently unused (Decap CMS OAuth is disabled); keep deployment-specific settings in the target platform environment (e.g. Cloudflare). Review generated files such as `dist` before committing them.
