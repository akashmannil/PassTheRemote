"use client";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket";

export function useSocket(): void {
  useEffect(() => {
    const socket = getSocket();

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      // Don't disconnect on each unmount — socket is a singleton.
      // Disconnection happens explicitly (e.g. on logout).
    };
  }, []);
}
