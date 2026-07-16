import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

import { getCurrentProfile } from "@/lib/auth/session";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AccountForm } from "@/components/account/account-form";

export const metadata: Metadata = {
  title: "Account settings — Prep Parcel Partners",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/login?redirect=/account");
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-[720px] px-6 py-12 md:px-8 md:py-16">
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-text md:text-[32px]">
            Account settings
          </h1>
          <p className="mt-1.5 text-[14px] leading-relaxed text-text-2">
            Manage how you appear on Prep Parcel and sign out of your session.
          </p>
          <div className="mt-8">
            <AccountForm profile={profile} />
          </div>
        </div>
      </main>
      <Footer />
      <Toaster
        position="top-right"
        theme="light"
        richColors
        closeButton
        offset={80}
      />
    </>
  );
}
