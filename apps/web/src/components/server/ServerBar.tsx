"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { CreateServerModal } from "@/components/modals/CreateServerModal";
import type { Server } from "@ptr/types";

interface ServerBarProps {
  servers: Server[];
  activeServerId?: string;
}

function ServerIcon({
  server,
  isActive,
}: {
  server: Server;
  isActive: boolean;
}) {
  return (
    <Link
      href={`/servers/${server.id}`}
      title={server.name}
      className="group relative flex items-center"
    >
      {/* Active indicator */}
      <span
        className={`absolute -left-3 h-full w-1 rounded-r transition-all ${
          isActive ? "bg-ptr-accent" : "bg-transparent group-hover:bg-ptr-muted"
        }`}
        aria-hidden="true"
      />
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full bg-ptr-surface text-sm font-semibold text-ptr-text transition-all hover:bg-ptr-border ${
          isActive ? "rounded-ptr" : ""
        }`}
      >
        {server.icon_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={server.icon_url}
            alt={server.name}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          server.name.charAt(0).toUpperCase()
        )}
      </div>
    </Link>
  );
}

export function ServerBar({ servers, activeServerId }: ServerBarProps) {
  return (
    <nav className="fixed left-0 top-0 flex h-full w-[72px] flex-col items-center gap-2 bg-ptr-bg py-3 px-3">
      {servers.map((server) => (
        <ServerIcon
          key={server.id}
          server={server}
          isActive={server.id === activeServerId}
        />
      ))}

      <div className="mt-auto">
        <CreateServerModal>
          <button
            title="Create a Server"
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-ptr-border text-ptr-muted transition-colors hover:border-ptr-success hover:text-ptr-success"
          >
            <Plus className="h-5 w-5" />
          </button>
        </CreateServerModal>
      </div>
    </nav>
  );
}
