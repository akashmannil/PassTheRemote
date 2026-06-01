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
| RootLayout | apps/web/src/app/layout.tsx | ✅ | Inter font, globals |
| Button | apps/web/src/components/ui/button.tsx | ✅ | shadcn/ui, PTR accent |
| Input | apps/web/src/components/ui/input.tsx | ✅ | shadcn/ui, PTR border |
| Skeleton | apps/web/src/components/ui/skeleton.tsx | ✅ | pulse animation |
| Dialog | apps/web/src/components/ui/dialog.tsx | ✅ | Radix Dialog wrapper |
| GoogleOAuthButton | apps/web/src/components/auth/GoogleOAuthButton.tsx | ✅ | inline SVG Google icon |
| OAuthDivider | apps/web/src/components/auth/GoogleOAuthButton.tsx | ✅ | "or" divider |
| ServerBar | apps/web/src/components/server/ServerBar.tsx | ✅ | 72px fixed left, server icons |
| CreateServerModal | apps/web/src/components/modals/CreateServerModal.tsx | ✅ | create server + 4 default channels |
| ChannelSidebar | apps/web/src/components/channel/ChannelSidebar.tsx | ✅ | grouped by type, Lucide icons |
| TextChannel | apps/web/src/components/channel/TextChannel.tsx | ✅ | wires ChatPanel + ChatInput + MemberList |
| MemberList | apps/web/src/components/members/MemberList.tsx | ✅ | 240px panel, online dots, skeletons |
| ChatPanel | apps/web/src/components/chat/ChatPanel.tsx | ✅ | reverse scroll, skeletons, hover timestamp |
| ChatInput | apps/web/src/components/chat/ChatInput.tsx | ✅ | Enter to send, disabled when disconnected |

---

## Hooks Map

| Hook | File | Status | Notes |
|------|------|--------|-------|
| useSocket | apps/web/src/hooks/useSocket.ts | ✅ | connect singleton on mount |
| useChannel | apps/web/src/hooks/useChannel.ts | ✅ | join/leave + channel:members subscription |
| useChat | apps/web/src/hooks/useChat.ts | ✅ | history load, chat:message, optimistic send |

---

## Socket Events

| Event | Direction | Status | Notes |
|-------|-----------|--------|-------|
| channel:join | client→server | ✅ | payload: ChannelJoinPayload + serverId |
| channel:leave | client→server | ✅ | payload: { channelId, userId, serverId } |
| channel:members | server→room | ✅ | payload: ChannelMembersPayload |
| server:presence | server→server-room | ✅ | payload: ServerPresencePayload |
| chat:history | client→server (ack) | ✅ | payload: { channelId }, returns ChatMessagePayload[] |
| chat:send | client→server (ack) | ✅ | payload: message content, persists + broadcasts |
| chat:message | server→room | ✅ | payload: ChatMessagePayload |

---

## Change Log

| Commit | Description |
|--------|-------------|
| Commit 1 | Init pnpm monorepo — apps/web, apps/server, packages/types |
| Commit 2 | TypeScript strict, path aliases, Tailwind PTR tokens, shadcn/ui |
| Commit 3 | Supabase migration 001 — all Phase 1 tables + RLS + indexes; shared TS types |
| Commit 4 | Login page — Supabase email/password auth, error + loading states |
| Commit 5 | Register page — validation, signUp + users table insert |
| Commit 6 | Google OAuth — callback route, auto-upsert user on first login |
| Commit 7 | Server creation — ServerBar, CreateServerModal, 4 default channels |
| Commit 8 | Channel sidebar — grouped by type, Lucide icons, active state, invite button |
| Commit 9 | Socket.io presence — channel join/leave, in-memory rooms, MemberList |
| Commit 10 | Real-time chat — history load, optimistic send, ChatPanel + ChatInput |
| Commit 11 | Phase 1 complete — knowledge graph finalized |
