"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hash, Tv, Volume2, Music, ChevronDown, UserPlus } from "lucide-react";
import type { Channel, ChannelType } from "@ptr/types";

const CHANNEL_TYPE_LABELS: Record<ChannelType, string> = {
  text: "TEXT CHANNELS",
  watch: "WATCH CHANNELS",
  voice: "VOICE CHANNELS",
  music: "MUSIC CHANNELS",
};

const CHANNEL_TYPE_ORDER: ChannelType[] = ["text", "watch", "voice", "music"];

function ChannelIcon({ type }: { type: ChannelType }) {
  const cls = "h-4 w-4 shrink-0 text-ptr-muted";
  switch (type) {
    case "text":  return <Hash className={cls} />;
    case "watch": return <Tv className={cls} />;
    case "voice": return <Volume2 className={cls} />;
    case "music": return <Music className={cls} />;
  }
}

interface ChannelRowProps {
  channel: Channel;
  serverId: string;
  isActive: boolean;
  memberCount: number;
}

function ChannelRow({ channel, serverId, isActive, memberCount }: ChannelRowProps) {
  return (
    <Link
      href={`/servers/${serverId}/channels/${channel.id}`}
      className={`group flex h-8 w-full items-center gap-1.5 rounded-ptr px-2 text-sm transition-colors ${
        isActive
          ? "bg-ptr-accent/15 text-ptr-accent"
          : "text-ptr-muted hover:bg-ptr-border/40 hover:text-ptr-text"
      }`}
    >
      <ChannelIcon type={channel.type} />
      <span className="flex-1 truncate">{channel.name}</span>
      {memberCount > 0 && (
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-ptr-success" aria-hidden="true" />
          <span className="text-xs text-ptr-muted">{memberCount}</span>
        </span>
      )}
    </Link>
  );
}

interface ChannelSidebarProps {
  serverId: string;
  serverName: string;
  channels: Channel[];
  presenceCounts?: Record<string, number>;
}

export function ChannelSidebar({
  serverId,
  serverName,
  channels,
  presenceCounts = {},
}: ChannelSidebarProps) {
  const pathname = usePathname();

  const grouped = CHANNEL_TYPE_ORDER.reduce<Record<ChannelType, Channel[]>>(
    (acc, type) => {
      acc[type] = channels.filter((ch) => ch.type === type);
      return acc;
    },
    { text: [], watch: [], voice: [], music: [] }
  );

  return (
    <aside className="flex h-full w-[240px] flex-col border-r border-ptr-border bg-ptr-surface">
      {/* Server name header */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-ptr-border px-4">
        <span className="truncate text-base font-bold text-ptr-text">
          {serverName}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-ptr-muted" />
      </div>

      {/* Channel groups */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {CHANNEL_TYPE_ORDER.map((type) => {
          const group = grouped[type];
          if (group.length === 0) return null;

          return (
            <div key={type} className="mb-4">
              <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-ptr-muted">
                {CHANNEL_TYPE_LABELS[type]}
              </p>
              {group.map((channel) => {
                const isActive = pathname.includes(channel.id);
                return (
                  <ChannelRow
                    key={channel.id}
                    channel={channel}
                    serverId={serverId}
                    isActive={isActive}
                    memberCount={presenceCounts[channel.id] ?? 0}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Invite friends button pinned to bottom */}
      <div className="shrink-0 border-t border-ptr-border p-2">
        <button className="flex w-full items-center gap-2 rounded-ptr border border-ptr-border px-3 py-1.5 text-sm text-ptr-accent transition-colors hover:bg-ptr-border/40">
          <UserPlus className="h-4 w-4" />
          Invite Friends
        </button>
      </div>
    </aside>
  );
}
