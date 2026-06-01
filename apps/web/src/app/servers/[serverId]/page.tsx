import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Channel } from "@ptr/types";

interface PageProps {
  params: Promise<{ serverId: string }>;
}

async function getFirstChannel(serverId: string): Promise<Channel | null> {
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
    .eq("server_id", serverId)
    .order("position", { ascending: true })
    .limit(1)
    .single();

  return data as Channel | null;
}

export default async function ServerPage({ params }: PageProps) {
  const { serverId } = await params;
  const firstChannel = await getFirstChannel(serverId);

  if (firstChannel) {
    redirect(`/servers/${serverId}/channels/${firstChannel.id}`);
  }

  return (
    <div className="flex h-screen items-center justify-center bg-ptr-bg">
      <p className="text-ptr-muted">No channels found in this server.</p>
    </div>
  );
}
