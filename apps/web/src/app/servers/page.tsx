import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ServerBar } from "@/components/server/ServerBar";
import { CreateServerModal } from "@/components/modals/CreateServerModal";
import type { Server } from "@ptr/types";

async function getServersForUser(): Promise<Server[]> {
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
    .from("server_members")
    .select("server_id, servers(*)")
    .eq("user_id", user.id);

  return (
    (data
      ?.map((row) => (row.servers as unknown as Server) ?? null)
      .filter(Boolean) as Server[]) ?? []
  );
}

export default async function ServersPage() {
  const servers = await getServersForUser();

  return (
    <div className="flex h-screen bg-ptr-bg">
      <ServerBar servers={servers} />

      <main className="ml-[72px] flex flex-1 items-center justify-center">
        {servers.length === 0 ? (
          <div className="text-center">
            <p className="mb-4 text-ptr-muted">You haven&apos;t joined any servers yet.</p>
            <CreateServerModal>
              <button className="rounded-ptr bg-ptr-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90">
                Create your first server
              </button>
            </CreateServerModal>
          </div>
        ) : (
          <p className="text-ptr-muted">
            Select a server from the sidebar.
          </p>
        )}
      </main>
    </div>
  );
}
