"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseClient } from "@/lib/supabase";
import type { ChannelType } from "@ptr/types";

const DEFAULT_CHANNELS: Array<{ name: string; type: ChannelType; position: number }> = [
  { name: "general", type: "text", position: 0 },
  { name: "watch-party", type: "watch", position: 1 },
  { name: "voice", type: "voice", position: 2 },
  { name: "music", type: "music", position: 3 },
];

interface CreateServerModalProps {
  children: React.ReactNode;
}

export function CreateServerModal({ children }: CreateServerModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const supabase = getSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in.");
        return;
      }

      // Create server
      const { data: server, error: serverError } = await supabase
        .from("servers")
        .insert({ name: name.trim(), owner_id: user.id })
        .select()
        .single();

      if (serverError || !server) {
        setError(serverError?.message ?? "Failed to create server.");
        return;
      }

      // Add owner as member
      const { error: memberError } = await supabase
        .from("server_members")
        .insert({ server_id: server.id, user_id: user.id, role: "owner" });

      if (memberError) {
        setError(memberError.message);
        return;
      }

      // Create default channels
      const { error: channelError } = await supabase.from("channels").insert(
        DEFAULT_CHANNELS.map((ch) => ({ ...ch, server_id: server.id }))
      );

      if (channelError) {
        setError(channelError.message);
        return;
      }

      setOpen(false);
      setName("");
      router.push(`/servers/${server.id}`);
      router.refresh();
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Create a Server</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreate} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="serverName"
              className="text-sm font-medium text-ptr-muted"
            >
              Server Name
            </label>
            <Input
              id="serverName"
              type="text"
              placeholder="My Awesome Server"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              maxLength={100}
              className={
                error ? "border-ptr-danger focus-visible:ring-ptr-danger" : ""
              }
            />
          </div>

          {error && (
            <p className="text-sm text-ptr-danger" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading || !name.trim()}
            className="bg-ptr-accent text-white hover:opacity-90"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Creating…
              </>
            ) : (
              "Create Server"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
