import type {
  ChannelJoinPayload,
  ChannelMembersPayload,
  ServerPresencePayload,
} from "@ptr/types";

// In-memory room state
// channelId → Set of user payloads
const channelRooms = new Map<string, Map<string, ChannelJoinPayload>>();

// serverId → Set of online user IDs
const serverPresence = new Map<string, Set<string>>();

export function joinChannel(
  channelId: string,
  payload: ChannelJoinPayload
): ChannelMembersPayload {
  if (!channelRooms.has(channelId)) {
    channelRooms.set(channelId, new Map());
  }
  channelRooms.get(channelId)!.set(payload.userId, payload);

  return {
    channelId,
    members: Array.from(channelRooms.get(channelId)!.values()),
  };
}

export function leaveChannel(
  channelId: string,
  userId: string
): ChannelMembersPayload {
  channelRooms.get(channelId)?.delete(userId);

  return {
    channelId,
    members: Array.from(channelRooms.get(channelId)?.values() ?? []),
  };
}

export function getChannelMembers(channelId: string): ChannelMembersPayload {
  return {
    channelId,
    members: Array.from(channelRooms.get(channelId)?.values() ?? []),
  };
}

export function trackServerPresence(
  serverId: string,
  userId: string
): void {
  if (!serverPresence.has(serverId)) {
    serverPresence.set(serverId, new Set());
  }
  serverPresence.get(serverId)!.add(userId);
}

export function removeServerPresence(
  serverId: string,
  userId: string
): ServerPresencePayload {
  serverPresence.get(serverId)?.delete(userId);
  return {
    serverId,
    onlineUserIds: Array.from(serverPresence.get(serverId)?.values() ?? []),
  };
}

export function getServerPresence(serverId: string): ServerPresencePayload {
  return {
    serverId,
    onlineUserIds: Array.from(serverPresence.get(serverId)?.values() ?? []),
  };
}

// Remove user from all channels and servers they're in
export function cleanupUser(userId: string): Array<ChannelMembersPayload> {
  const updates: ChannelMembersPayload[] = [];

  for (const [channelId, members] of channelRooms.entries()) {
    if (members.has(userId)) {
      members.delete(userId);
      updates.push({ channelId, members: Array.from(members.values()) });
    }
  }

  for (const users of serverPresence.values()) {
    users.delete(userId);
  }

  return updates;
}
