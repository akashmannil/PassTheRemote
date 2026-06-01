"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseClient } from "@/lib/supabase";
import {
  GoogleOAuthButton,
  OAuthDivider,
} from "@/components/auth/GoogleOAuthButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = getSupabaseClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      router.push("/servers");
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const hasError = error !== null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-ptr-bg px-4">
      <div
        className="w-full max-w-[400px] rounded-ptr border border-ptr-border bg-ptr-surface p-8"
        style={{ borderRadius: "6px" }}
      >
        {/* Wordmark */}
        <div className="mb-8 text-center">
          <span className="text-xl font-bold tracking-tight text-ptr-accent">
            PassTheRemote
          </span>
        </div>

        <h1 className="mb-6 text-center text-lg font-semibold text-ptr-text">
          Sign in to your account
        </h1>

        <GoogleOAuthButton />
        <OAuthDivider />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-ptr-muted"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className={
                hasError
                  ? "border-ptr-danger focus-visible:ring-ptr-danger"
                  : ""
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-ptr-muted"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className={
                hasError
                  ? "border-ptr-danger focus-visible:ring-ptr-danger"
                  : ""
              }
            />
          </div>

          {hasError && (
            <p className="text-sm text-ptr-danger" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-ptr-accent hover:opacity-90 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ptr-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-ptr-accent hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
