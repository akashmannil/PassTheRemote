"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  channelName: string;
  connected: boolean;
  onSend: (content: string) => void;
}

export function ChatInput({ channelName, connected, onSend }: ChatInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const trimmed = value.trim();
      if (trimmed && connected) {
        onSend(trimmed);
        setValue("");
      }
    }
  }

  return (
    <div className="shrink-0 border-t border-ptr-border bg-ptr-surface px-4 py-3">
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={connected ? `Message #${channelName}` : "Connecting…"}
        disabled={!connected}
        className="bg-ptr-bg disabled:opacity-50"
        maxLength={2000}
      />
    </div>
  );
}
