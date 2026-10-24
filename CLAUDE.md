# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal static blog of not-exist, built on the upstream [Fuwari](https://github.com/saicaca/fuwari) theme (Astro 5 + Svelte 5 + Tailwind CSS 3). Deployed to Cloudflare Workers (`wrangler.jsonc`, static assets from `dist/`, site `https://log.ilnbam1.xyz`).

## Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Dev server at `localhost:4321` |
| `pnpm build` | `astro build` + Pagefind indexing into `dist/` |
| `pnpm preview` | Preview production build |
| `pnpm check` | `astro check` for type/error checking |
| `pnpm type-check` | `tsc --noEmit --isolatedDeclarations` |
| `pnpm new-post <filename>` | Scaffold a new post in `src/content/posts/` |
| `pnpm format` / `pnpm lint` | Biome format / lint+fix on `src/` |

Package manager is **pnpm** (enforced via `preinstall`). Upstream pins `pnpm@9.14.4`; `.nvmrc` pins Node 22.23 for Cloudflare builds.

## Structure

- `src/config.ts` — all site settings (title, lang, hue, banner, navbar, profile, license)
- `src/content/posts/` — blog posts (`.md`), URL slug = file name; frontmatter: title, published, description, image, tags, category, draft, lang
- `src/content/spec/` — special pages (`about.md`)
- `src/types/config.ts` — config types; `LinkPreset` enum for navbar presets
- `src/plugins/` — remark/rehype plugins (KaTeX, admonitions, GitHub card directive `::github{repo="..."}`)
- `public/favicon/` — default light/dark favicon set

## Code Style

- **Biome**: tab indentation, double quotes
- Commit convention: **Conventional Commits** (`feat:`, `fix:`, `chore:`, ...)

## Deployment

Cloudflare Workers builds from the repo (`astro build && pagefind --site dist`), serving `dist/` as static assets via `wrangler.jsonc`.
