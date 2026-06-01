import type { Server, Socket } from "socket.io";
import type { ChannelJoinPayload } from "@ptr/types";
import {
  joinChannel,
  leaveChannel,
  trackServerPresence,
  removeServerPresence,
  getServerPresence,
} from "../rooms";

export function registerChannelHandlers(io: Server, socket: Socket): void {
  let currentChannelId: string | null = null;
  let currentServerId: string | null = null;
  let currentUserId: string | null = null;

  socket.on(
    "channel:join",
    (payload: ChannelJoinPayload & { serverId: string }) => {
      const { channelId, serverId, userId, username, avatarUrl } = payload;

      // Leave previous channel if switching
      if (currentChannelId && currentChannelId !== channelId) {
        socket.leave(currentChannelId);
        const update = leaveChannel(currentChannelId, userId);
        io.to(currentChannelId).emit("channel:members", update);
      }

      currentChannelId = channelId;
      currentServerId = serverId;
      currentUserId = userId;

      socket.join(channelId);
      socket.join(`server:${serverId}`);

      const members = joinChannel(channelId, { channelId, userId, username, avatarUrl });
      io.to(channelId).emit("channel:members", members);

      trackServerPresence(serverId, userId);
      const presence = getServerPresence(serverId);
      io.to(`server:${serverId}`).emit("server:presence", presence);
    }
  );

  socket.on("channel:leave", (payload: { channelId: string; userId: string; serverId: string }) => {
    const { channelId, userId, serverId } = payload;

    socket.leave(channelId);
    const members = leaveChannel(channelId, userId);
    io.to(channelId).emit("channel:members", members);

    const presence = removeServerPresence(serverId, userId);
    io.to(`server:${serverId}`).emit("server:presence", presence);

    currentChannelId = null;
    currentUserId = null;
    currentServerId = null;
  });

  socket.on("disconnect", () => {
    if (currentChannelId && currentUserId) {
      socket.leave(currentChannelId);
      const members = leaveChannel(currentChannelId, currentUserId);
      io.to(currentChannelId).emit("channel:members", members);
    }

    if (currentServerId && currentUserId) {
      const presence = removeServerPresence(currentServerId, currentUserId);
      io.to(`server:${currentServerId}`).emit("server:presence", presence);
    }
  });
}
