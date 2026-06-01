# PTR — Claude Code Project Guide

## Project
PassTheRemote (PTR) is a Discord-like media sync web app. Users join servers, enter channels, and watch/listen to media in real time together.

## Monorepo Layout
```
apps/web      — Next.js 14 App Router (TypeScript strict, Tailwind, shadcn/ui)
apps/server   — Node.js + Express + Socket.io (TypeScript strict)
packages/types — Shared TypeScript types
supabase/     — Database migrations and seed files
```

## Dev Commands
```bash
pnpm dev          # start all apps in parallel
pnpm typecheck    # must pass before every commit
pnpm --filter @ptr/web dev
pnpm --filter @ptr/server dev
```

## Rules — ALWAYS FOLLOW
1. One commit per logical unit of work
2. Run `pnpm typecheck` before every commit — zero errors allowed
3. Update `knowledge_graph.md` in the same commit if any schema, socket event, component, or hook changed
4. TypeScript strict mode — zero `any` types
5. Never move to the next commit until the current one is clean

## Design System
- Background: `#0d1117` (`--ptr-bg`)
- Surface: `#161b22` (`--ptr-surface`)
- Border: `#30363d` (`--ptr-border`)
- Text: `#e6edf3` (`--ptr-text`)
- Muted: `#7d8590` (`--ptr-muted`)
- Accent: `#2f81f7` (`--ptr-accent`)
- Success: `#3fb950` (`--ptr-success`)
- Danger: `#f85149` (`--ptr-danger`)
- Border radius: 6px
- Font: Inter (next/font)
- Icons: Lucide React only
- UI components: shadcn/ui only
- No gradients, no animations, no decorative elements
- Skeleton loaders on every async element

## Key Files
- `knowledge_graph.md` — canonical schema + component + socket event map
- `supabase/migrations/` — SQL migrations
- `apps/web/src/lib/supabase.ts` — Supabase client wrapper
- `apps/web/src/lib/socket.ts` — Socket.io singleton client
