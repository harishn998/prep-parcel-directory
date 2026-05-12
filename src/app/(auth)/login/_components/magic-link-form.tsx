"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type State =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "sent"; email: string }
  | { status: "error"; message: string };

function friendlyError(rawMessage: string): string {
  const m = rawMessage.toLowerCase();
  if (m.includes("rate") || m.includes("too many"))
    return "You've tried too many times. Wait a minute and try again.";
  if (m.includes("invalid") && m.includes("email"))
    return "That email doesn't look right. Check the format and try again.";
  return "Something went wrong sending the link. Try again in a moment.";
}

export function MagicLinkForm({ redirect }: { redirect?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>({ status: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setState({ status: "submitting" });

    const supabase = createSupabaseBrowserClient();
    const callbackUrl = new URL(
      "/auth/callback",
      process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin
    );
    if (redirect) callbackUrl.searchParams.set("redirect", redirect);

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: callbackUrl.toString() },
    });

    if (error) {
      setState({ status: "error", message: friendlyError(error.message) });
      return;
    }

    setState({ status: "sent", email: email.trim() });
  }

  if (state.status === "sent") {
    return (
      <div className="rounded-lg border border-border-soft bg-secondary px-4 py-5">
        <p className="text-[14px] font-semibold text-text">
          Check your email
        </p>
        <p className="mt-1.5 text-[13px] leading-[1.55] text-text-2">
          We sent a sign-in link to{" "}
          <span className="font-medium text-text">{state.email}</span>. Open
          it on this device to continue.
        </p>
        <button
          type="button"
          onClick={() => {
            setEmail("");
            setState({ status: "idle" });
          }}
          className="mt-3 text-[13px] font-medium text-blue underline-offset-2 hover:underline"
        >
          Try a different email
        </button>
      </div>
    );
  }

  const isSubmitting = state.status === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
      <Input
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
        className="h-12 border-border-soft bg-surface text-[14px]"
        aria-invalid={state.status === "error" || undefined}
      />
      {state.status === "error" && (
        <p role="alert" className="text-[13px] text-red-600">
          {state.message}
        </p>
      )}
      <Button
        type="submit"
        disabled={isSubmitting || !email.trim()}
        className="h-12 w-full bg-blue text-[14px] font-medium text-white hover:bg-blue-hover disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send magic link"}
      </Button>
    </form>
  );
}
