import type { Metadata } from "next";
import Link from "next/link";
import { Package } from "lucide-react";
import { MagicLinkForm } from "./_components/magic-link-form";
import { GoogleSignInButton } from "./_components/google-sign-in-button";

export const metadata: Metadata = {
  title: "Sign in — Prep Parcel Partners",
  description:
    "Sign in to Prep Parcel Partners with your email or Google account.",
};

const ERROR_MESSAGES: Record<string, string> = {
  auth_failed:
    "We couldn't complete sign-in. Try again, or use a different method.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>;
}) {
  const { error, redirect } = await searchParams;
  const errorMessage = error ? ERROR_MESSAGES[error] ?? null : null;

  return (
    <div
      className="w-full max-w-[440px] rounded-2xl border border-border-soft bg-surface p-10 shadow-sm"
      style={{ borderRadius: 16 }}
    >
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 font-semibold text-navy"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-navy text-white">
          <Package className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <span className="text-[15px] tracking-tight">Prep Parcel</span>
      </Link>

      <h1 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-text">
        Sign in to Prep Parcel
      </h1>
      <p className="mt-2 text-[15px] leading-[1.5] text-text-2">
        Continue with email or Google
      </p>

      {errorMessage && (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700"
        >
          {errorMessage}
        </div>
      )}

      <div className="mt-6">
        <GoogleSignInButton redirect={redirect} />
      </div>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border-soft" />
        <span className="text-[13px] text-text-3">or</span>
        <span className="h-px flex-1 bg-border-soft" />
      </div>

      <MagicLinkForm redirect={redirect} />

      <p className="mt-4 text-[13px] text-text-3">
        We&apos;ll email you a sign-in link. No password needed.
      </p>

      <p className="mt-8 text-[12px] leading-[1.5] text-text-3">
        By signing in, you agree to our{" "}
        <Link href="#" className="text-text-2 underline-offset-2 hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="#" className="text-text-2 underline-offset-2 hover:underline">
          Privacy
        </Link>
        .
      </p>
    </div>
  );
}
