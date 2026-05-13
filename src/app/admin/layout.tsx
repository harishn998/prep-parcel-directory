import { redirect } from "next/navigation";
import { Toaster } from "sonner";

import { getCurrentProfile } from "@/lib/auth/session";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopBar } from "@/components/admin/admin-top-bar";

export const metadata = {
  robots: { index: false, follow: false },
  title: {
    template: "%s · Admin · Prep Parcel",
    default: "Admin · Prep Parcel",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense in depth: middleware already gates /admin/*, but a stale
  // session could slip through. Re-check at the route level.
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    redirect("/login?redirect=/admin");
  }

  return (
    <>
      <AdminSidebar profile={profile} />
      <div className="flex min-h-screen flex-col md:pl-[240px]">
        <AdminTopBar adminEmail={profile.email} />
        <main className="flex-1 bg-background">{children}</main>
        <footer className="border-t border-border bg-surface px-6 py-3 text-[12px] text-text-3 md:pl-6">
          Admin · Prep Parcel
        </footer>
      </div>
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
