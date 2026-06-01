"use client";

import { useEffect, useRef } from "react";
import type { ChatMessagePayload } from "@ptr/types";
import { Skeleton } from "@/components/ui/skeleton";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MessageRow({ msg }: { msg: ChatMessagePayload }) {
  return (
    <div className="group flex items-start gap-3 px-4 py-1 hover:bg-ptr-surface/50">
      {/* Avatar */}
      <div className="mt-0.5 h-8 w-8 shrink-0 rounded-full bg-ptr-border flex items-center justify-center text-sm font-semibold text-ptr-text">
        {msg.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={msg.avatarUrl}
            alt={msg.username}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          msg.username.charAt(0).toUpperCase()
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-ptr-text">
            {msg.username}
          </span>
          <span className="hidden text-[11px] text-ptr-muted group-hover:block">
            {formatTime(msg.createdAt)}
          </span>
        </div>
        <p className="break-words text-sm text-ptr-text/90 leading-5">
          {msg.content}
        </p>
      </div>
    </div>
  );
}

function MessageSkeleton({ width }: { width: string }) {
  return (
    <div className="flex items-start gap-3 px-4 py-1">
      <Skeleton className="mt-0.5 h-8 w-8 rounded-full" />
      <div className="flex flex-col gap-1.5 pt-1">
        <Skeleton className="h-3 w-20" />
        <Skeleton className={`h-3 ${width}`} />
      </div>
    </div>
  );
}

interface ChatPanelProps {
  messages: ChatMessagePayload[];
  loading: boolean;
}

const SKELETON_WIDTHS = ["w-48", "w-64", "w-36", "w-72", "w-52", "w-44"];

export function ChatPanel({ messages, loading }: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto py-2">
      {loading ? (
        SKELETON_WIDTHS.map((w, i) => <MessageSkeleton key={i} width={w} />)
      ) : (
        <>
          {messages.map((msg) => (
            <MessageRow key={msg.id} msg={msg} />
          ))}
          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
}
