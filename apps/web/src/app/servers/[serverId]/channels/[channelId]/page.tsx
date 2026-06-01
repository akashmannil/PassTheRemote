import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import type { Channel } from "@ptr/types";

interface PageProps {
  params: Promise<{ serverId: string; channelId: string }>;
}

async function getChannel(channelId: string): Promise<Channel | null> {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data } = await supabase
    .from("channels")
    .select("*")
    .eq("id", channelId)
    .single();

  return data as Channel | null;
}

export default async function ChannelPage({ params }: PageProps) {
  const { channelId } = await params;
  const channel = await getChannel(channelId);

  if (!channel) notFound();

  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-ptr-muted text-sm">
        # {channel.name} — chat coming in Commit 10
      </p>
    </div>
  );
}
