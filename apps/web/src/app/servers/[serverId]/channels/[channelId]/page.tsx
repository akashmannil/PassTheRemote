import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { TextChannel } from "@/components/channel/TextChannel";
import type { Channel, User } from "@ptr/types";

interface PageProps {
  params: Promise<{ serverId: string; channelId: string }>;
}

async function getPageData(channelId: string, serverId: string) {
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
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");

  const [{ data: channelData }, { data: userData }] = await Promise.all([
    supabase.from("channels").select("*").eq("id", channelId).single(),
    supabase.from("users").select("*").eq("id", authUser.id).single(),
  ]);

  if (!channelData) notFound();
  if (channelData.server_id !== serverId) notFound();

  return {
    channel: channelData as Channel,
    user: userData as User | null,
  };
}

export default async function ChannelPage({ params }: PageProps) {
  const { serverId, channelId } = await params;
  const { channel, user } = await getPageData(channelId, serverId);

  const clientUser = user
    ? { id: user.id, username: user.username, avatarUrl: user.avatar_url }
    : null;

  return (
    <TextChannel channel={channel} serverId={serverId} user={clientUser} />
  );
}
