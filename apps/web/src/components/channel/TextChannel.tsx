"use client";

import { useChat } from "@/hooks/useChat";
import { useChannel } from "@/hooks/useChannel";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { ChatInput } from "@/components/chat/ChatInput";
import { MemberList } from "@/components/members/MemberList";
import type { Channel } from "@ptr/types";

interface TextChannelProps {
  channel: Channel;
  serverId: string;
  user: { id: string; username: string; avatarUrl: string | null } | null;
}

export function TextChannel({ channel, serverId, user }: TextChannelProps) {
  const { messages, loading, connected, sendMessage } = useChat({
    channelId: channel.id,
    user,
  });

  const { members } = useChannel({
    channelId: channel.id,
    serverId,
    user,
  });

  return (
    <div className="flex h-full flex-1 overflow-hidden">
      {/* Main chat area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Channel header */}
        <div className="flex h-12 shrink-0 items-center border-b border-ptr-border px-4 gap-2">
          <span className="text-sm font-semibold text-ptr-text">
            # {channel.name}
          </span>
        </div>

        <ChatPanel messages={messages} loading={loading} />
        <ChatInput
          channelName={channel.name}
          connected={connected}
          onSend={sendMessage}
        />
      </div>

      {/* Member list */}
      <MemberList members={members} loading={false} />
    </div>
  );
}
