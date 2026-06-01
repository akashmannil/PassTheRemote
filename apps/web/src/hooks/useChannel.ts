"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import type { ChannelMembersPayload, ChannelJoinPayload } from "@ptr/types";

interface UseChannelOptions {
  channelId: string;
  serverId: string;
  user: { id: string; username: string; avatarUrl: string | null } | null;
}

export function useChannel({ channelId, serverId, user }: UseChannelOptions) {
  const [members, setMembers] = useState<ChannelJoinPayload[]>([]);

  useEffect(() => {
    if (!user) return;

    const socket = getSocket();

    if (!socket.connected) {
      socket.connect();
    }

    // Join channel
    socket.emit("channel:join", {
      channelId,
      serverId,
      userId: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
    });

    // Listen for member updates
    const handleMembers = (payload: ChannelMembersPayload) => {
      if (payload.channelId === channelId) {
        setMembers(payload.members);
      }
    };

    socket.on("channel:members", handleMembers);

    return () => {
      socket.emit("channel:leave", {
        channelId,
        serverId,
        userId: user.id,
      });
      socket.off("channel:members", handleMembers);
    };
  }, [channelId, serverId, user]);

  return { members };
}
