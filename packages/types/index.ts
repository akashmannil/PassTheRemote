// =========================================================
// PTR Shared TypeScript Types — matches 001_initial_schema.sql
// =========================================================

export type UserRole = "owner" | "admin" | "member";
export type ChannelType = "text" | "watch" | "voice" | "music";

export interface User {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Server {
  id: string;
  name: string;
  icon_url: string | null;
  owner_id: string;
  created_at: string;
}

export interface ServerMember {
  server_id: string;
  user_id: string;
  role: UserRole;
  joined_at: string;
}

export interface Channel {
  id: string;
  server_id: string;
  name: string;
  type: ChannelType;
  position: number;
  created_at: string;
}

export interface ChannelPresence {
  channel_id: string;
  user_id: string;
  joined_at: string;
}

export interface Message {
  id: string;
  channel_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface Invite {
  id: string;
  server_id: string;
  created_by: string;
  code: string;
  expires_at: string | null;
  max_uses: number | null;
  uses: number;
  created_at: string;
}

export interface ChannelSession {
  id: string;
  channel_id: string;
  host_id: string;
  media_url: string | null;
  media_type: string | null;
  is_playing: boolean;
  current_position: number;
  updated_at: string;
}

// =========================================================
// Joined / enriched types for UI
// =========================================================

export interface ServerMemberWithUser extends ServerMember {
  user: User;
}

export interface MessageWithUser extends Message {
  user: User;
}

export interface ChannelWithPresence extends Channel {
  member_count: number;
}

// =========================================================
// Socket event payloads
// =========================================================

export interface ChannelJoinPayload {
  channelId: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
}

export interface ChannelMembersPayload {
  channelId: string;
  members: ChannelJoinPayload[];
}

export interface ChatMessagePayload {
  id: string;
  channelId: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
  content: string;
  createdAt: string;
}

export interface ServerPresencePayload {
  serverId: string;
  onlineUserIds: string[];
}
