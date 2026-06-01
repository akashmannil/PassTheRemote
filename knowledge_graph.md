# PTR Knowledge Graph

> Canonical map of schema, components, hooks, and socket events.
> Update this file in the same commit as any change to these artifacts.

---

## Database Schema

| Table | Status | Notes |
|-------|--------|-------|
| users | ✅ created | id, username, avatar_url, created_at |
| servers | ✅ created | id, name, icon_url, owner_id, created_at |
| server_members | ✅ created | server_id, user_id, role(owner/admin/member), joined_at |
| channels | ✅ created | id, server_id, name, type(text/watch/voice/music), position, created_at |
| channel_presence | ✅ created | channel_id, user_id, joined_at |
| messages | ✅ created | id, channel_id, user_id, content, created_at |
| invites | ✅ created | id, server_id, created_by, code(UNIQUE), expires_at, max_uses, uses |
| channel_sessions | ✅ created | id, channel_id(UNIQUE), host_id, media_url, media_type, is_playing, current_position, updated_at |

Migration file: `supabase/migrations/001_initial_schema.sql`

RLS policies: enabled on all tables; members can read servers they belong to; users can only insert/update own rows.

---

## Component Map

| Component | File | Status | Notes |
|-----------|------|--------|-------|
| RootLayout | apps/web/src/app/layout.tsx | ✅ created | Inter font, globals |
| Button | apps/web/src/components/ui/button.tsx | ✅ created | shadcn/ui, PTR accent |
| Input | apps/web/src/components/ui/input.tsx | ✅ created | shadcn/ui, PTR border |

---

## Hooks Map

| Hook | File | Status | Notes |
|------|------|--------|-------|
| (none yet) | — | — | — |

---

## Socket Events

| Event | Direction | Status | Notes |
|-------|-----------|--------|-------|
| channel:join | client→server | ✅ implemented | payload: ChannelJoinPayload + serverId |
| channel:leave | client→server | ✅ implemented | payload: { channelId, userId, serverId } |
| channel:members | server→room | ✅ implemented | payload: ChannelMembersPayload |
| server:presence | server→server-room | ✅ implemented | payload: ServerPresencePayload |

---

## Change Log

| Commit | Description |
|--------|-------------|
| Commit 1 | Init pnpm monorepo — apps/web, apps/server, packages/types |
| Commit 2 | TypeScript strict, path aliases, Tailwind PTR tokens, shadcn/ui |
| Commit 3 | Supabase migration 001 — all Phase 1 tables + RLS + indexes; shared TS types |
