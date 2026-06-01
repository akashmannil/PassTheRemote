"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getSocket } from "@/lib/socket";
import type { ChatMessagePayload } from "@ptr/types";

interface UseChatOptions {
  channelId: string;
  user: { id: string; username: string; avatarUrl: string | null } | null;
}

export function useChat({ channelId, user }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const channelIdRef = useRef(channelId);
  channelIdRef.current = channelId;

  useEffect(() => {
    const socket = getSocket();

    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) setConnected(true);

    // Load history
    setLoading(true);
    socket.emit(
      "chat:history",
      { channelId },
      (history: ChatMessagePayload[]) => {
        setMessages(history);
        setLoading(false);
      }
    );

    const handleMessage = (msg: ChatMessagePayload) => {
      if (msg.channelId === channelIdRef.current) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("chat:message", handleMessage);

    return () => {
      socket.off("chat:message", handleMessage);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [channelId]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!user || !content.trim()) return;

      const socket = getSocket();

      // Optimistic append
      const optimistic: ChatMessagePayload = {
        id: `optimistic-${Date.now()}`,
        channelId,
        userId: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimistic]);

      socket.emit(
        "chat:send",
        {
          channelId,
          userId: user.id,
          username: user.username,
          avatarUrl: user.avatarUrl,
          content: content.trim(),
        },
        (result: ChatMessagePayload | { error: string }) => {
          if ("error" in result) {
            // Remove optimistic on failure
            setMessages((prev) =>
              prev.filter((m) => m.id !== optimistic.id)
            );
          } else {
            // Replace optimistic with real message
            setMessages((prev) =>
              prev.map((m) => (m.id === optimistic.id ? result : m))
            );
          }
        }
      );
    },
    [channelId, user]
  );

  return { messages, loading, connected, sendMessage };
}
