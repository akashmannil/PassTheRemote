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

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

function validate(
  username: string,
  password: string,
  confirmPassword: string
): FormErrors {
  const errors: FormErrors = {};

  if (username.length < 3 || username.length > 20) {
    errors.username = "Username must be between 3 and 20 characters.";
  }

  if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const validationErrors = validate(username, password, confirmPassword);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabaseClient();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });

      if (signUpError) {
        setErrors({ general: signUpError.message });
        return;
      }

      const userId = data.user?.id;
      if (userId) {
        const { error: insertError } = await supabase
          .from("users")
          .insert({ id: userId, username });

        if (insertError) {
          setErrors({ general: insertError.message });
          return;
        }
      }

      router.push("/servers");
    } catch {
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-ptr-bg px-4">
      <div className="w-full max-w-[400px] rounded-ptr border border-ptr-border bg-ptr-surface p-8">
        {/* Wordmark */}
        <div className="mb-8 text-center">
          <span className="text-xl font-bold tracking-tight text-ptr-accent">
            PassTheRemote
          </span>
        </div>

        <h1 className="mb-6 text-center text-lg font-semibold text-ptr-text">
          Create an account
        </h1>

        <GoogleOAuthButton />
        <OAuthDivider />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-sm font-medium text-ptr-muted"
            >
              Username
            </label>
            <Input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              className={
                errors.username
                  ? "border-ptr-danger focus-visible:ring-ptr-danger"
                  : ""
              }
            />
            {errors.username && (
              <p className="text-xs text-ptr-danger">{errors.username}</p>
            )}
          </div>

          {/* Email */}
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
                errors.email
                  ? "border-ptr-danger focus-visible:ring-ptr-danger"
                  : ""
              }
            />
            {errors.email && (
              <p className="text-xs text-ptr-danger">{errors.email}</p>
            )}
          </div>

          {/* Password */}
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className={
                errors.password
                  ? "border-ptr-danger focus-visible:ring-ptr-danger"
                  : ""
              }
            />
            {errors.password && (
              <p className="text-xs text-ptr-danger">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-ptr-muted"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              className={
                errors.confirmPassword
                  ? "border-ptr-danger focus-visible:ring-ptr-danger"
                  : ""
              }
            />
            {errors.confirmPassword && (
              <p className="text-xs text-ptr-danger">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {errors.general && (
            <p className="text-sm text-ptr-danger" role="alert">
              {errors.general}
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
                Creating account…
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ptr-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-ptr-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
