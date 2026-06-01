# PTR Knowledge Graph

> Canonical map of schema, components, hooks, and socket events.
> Update this file in the same commit as any change to these artifacts.

---

## Database Schema

| Table | Status | Notes |
|-------|--------|-------|
| users | ⬜ pending | id, username, avatar_url, created_at |
| servers | ⬜ pending | id, name, icon_url, owner_id, created_at |
| server_members | ⬜ pending | server_id, user_id, role, joined_at |
| channels | ⬜ pending | id, server_id, name, type, position, created_at |
| channel_presence | ⬜ pending | channel_id, user_id, joined_at |
| messages | ⬜ pending | id, channel_id, user_id, content, created_at |
| invites | ⬜ pending | id, server_id, created_by, code, expires_at, max_uses, uses |
| channel_sessions | ⬜ pending | id, channel_id, host_id, media_url, media_type, is_playing, current_position, updated_at |

---

## Component Map

| Component | File | Status | Notes |
|-----------|------|--------|-------|
| RootLayout | apps/web/src/app/layout.tsx | ✅ created | Inter font, globals |

---

## Hooks Map

| Hook | File | Status | Notes |
|------|------|--------|-------|
| (none yet) | — | — | — |

---

## Socket Events

| Event | Direction | Status | Notes |
|-------|-----------|--------|-------|
| (none yet) | — | — | — |

---

## Change Log

| Commit | Description |
|--------|-------------|
| Commit 1 | Init pnpm monorepo — apps/web, apps/server, packages/types |
