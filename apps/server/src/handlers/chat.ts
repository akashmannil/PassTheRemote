import type { Server, Socket } from "socket.io";
import { createClient } from "@supabase/supabase-js";
import type { ChatMessagePayload } from "@ptr/types";

function getSupabase() {
  const url = process.env["SUPABASE_URL"] ?? process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "";
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"] ?? "";

  if (!url || !key) {
    throw new Error("Missing Supabase server credentials");
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

export function registerChatHandlers(io: Server, socket: Socket): void {
  // Load last 50 messages for a channel
  socket.on(
    "chat:history",
    async (payload: { channelId: string }, callback: (msgs: ChatMessagePayload[]) => void) => {
      try {
        const supabase = getSupabase();
        const { data } = await supabase
          .from("messages")
          .select("id, channel_id, user_id, content, created_at, users(username, avatar_url)")
          .eq("channel_id", payload.channelId)
          .order("created_at", { ascending: false })
          .limit(50);

        const messages: ChatMessagePayload[] = (data ?? [])
          .reverse()
          .map((row) => {
            const user = Array.isArray(row.users) ? row.users[0] : row.users;
            return {
              id: row.id as string,
              channelId: row.channel_id as string,
              userId: row.user_id as string,
              username: (user?.username as string | undefined) ?? "unknown",
              avatarUrl: (user?.avatar_url as string | null | undefined) ?? null,
              content: row.content as string,
              createdAt: row.created_at as string,
            };
          });

        callback(messages);
      } catch {
        callback([]);
      }
    }
  );

  // Broadcast new message + persist to Supabase
  socket.on(
    "chat:send",
    async (
      payload: Omit<ChatMessagePayload, "id" | "createdAt">,
      callback?: (msg: ChatMessagePayload | { error: string }) => void
    ) => {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from("messages")
          .insert({
            channel_id: payload.channelId,
            user_id: payload.userId,
            content: payload.content,
          })
          .select()
          .single();

        if (error || !data) {
          callback?.({ error: error?.message ?? "Failed to send message" });
          return;
        }

        const msg: ChatMessagePayload = {
          id: data.id as string,
          channelId: data.channel_id as string,
          userId: data.user_id as string,
          username: payload.username,
          avatarUrl: payload.avatarUrl,
          content: data.content as string,
          createdAt: data.created_at as string,
        };

        io.to(payload.channelId).emit("chat:message", msg);
        callback?.(msg);
      } catch {
        callback?.({ error: "Unexpected error" });
      }
    }
  );
}
