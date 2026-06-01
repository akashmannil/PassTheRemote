import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ServerBar } from "@/components/server/ServerBar";
import { ChannelSidebar } from "@/components/channel/ChannelSidebar";
import type { Server, Channel } from "@ptr/types";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ serverId: string }>;
}

async function getLayoutData(serverId: string) {
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

  const [{ data: memberData }, { data: channelData }, { data: serverData }] =
    await Promise.all([
      supabase
        .from("server_members")
        .select("server_id, servers(*)")
        .eq("user_id", user.id),
      supabase
        .from("channels")
        .select("*")
        .eq("server_id", serverId)
        .order("position", { ascending: true }),
      supabase.from("servers").select("*").eq("id", serverId).single(),
    ]);

  const servers =
    (memberData
      ?.map((row) => (row.servers as unknown as Server) ?? null)
      .filter(Boolean) as Server[]) ?? [];

  const channels = (channelData as Channel[] | null) ?? [];
  const server = serverData as Server | null;

  if (!server) redirect("/servers");

  return { servers, channels, server };
}

export default async function ServerLayout({ children, params }: LayoutProps) {
  const { serverId } = await params;
  const { servers, channels, server } = await getLayoutData(serverId);

  return (
    <div className="flex h-screen overflow-hidden bg-ptr-bg">
      <ServerBar servers={servers} activeServerId={serverId} />

      <div className="ml-[72px] flex flex-1 overflow-hidden">
        <ChannelSidebar
          serverId={serverId}
          serverName={server.name}
          channels={channels}
        />
        <main className="flex flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
