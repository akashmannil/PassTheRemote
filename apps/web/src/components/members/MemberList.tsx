"use client";

import type { ChannelJoinPayload, UserRole } from "@ptr/types";
import { Skeleton } from "@/components/ui/skeleton";

interface MemberListProps {
  members: ChannelJoinPayload[];
  hostId?: string;
  loading?: boolean;
}

function RoleBadge({ role }: { role: UserRole }) {
  const labels: Record<UserRole, string> = {
    owner: "owner",
    admin: "admin",
    member: "",
  };

  const label = labels[role];
  if (!label) return null;

  return (
    <span className="rounded px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-ptr-accent/20 text-ptr-accent">
      {label}
    </span>
  );
}

function MemberAvatar({ username, avatarUrl }: { username: string; avatarUrl: string | null }) {
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={username}
        className="h-8 w-8 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ptr-surface text-sm font-semibold text-ptr-text">
      {username.charAt(0).toUpperCase()}
    </div>
  );
}

export function MemberList({ members, hostId, loading = false }: MemberListProps) {
  return (
    <aside className="flex h-full w-[240px] flex-col border-l border-ptr-border bg-ptr-surface px-2 py-3">
      <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-ptr-muted">
        Members — {members.length}
      </p>

      {loading ? (
        <div className="flex flex-col gap-2 px-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-0.5">
          {members.map((member) => {
            const isHost = member.userId === hostId;
            return (
              <div
                key={member.userId}
                className="flex items-center gap-2 rounded-ptr px-2 py-1 hover:bg-ptr-border/30"
              >
                <div className="relative">
                  <MemberAvatar
                    username={member.username}
                    avatarUrl={member.avatarUrl}
                  />
                  {/* Online indicator */}
                  <span
                    className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-ptr-surface bg-ptr-success"
                    aria-hidden="true"
                  />
                </div>
                <span className="flex-1 truncate text-sm text-ptr-text">
                  {member.username}
                </span>
                {isHost && <RoleBadge role="owner" />}
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}
