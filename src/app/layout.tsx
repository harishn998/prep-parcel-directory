import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { poppins, jetbrainsMono } from "@/lib/fonts";
import { getRobotsMetadata } from "@/lib/seo/noindex";
import { NoindexBanner } from "@/components/layout/noindex-banner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://prep-parcel-directory.vercel.app"
  ),
  title: "Prep Parcel Partners — The 3PL directory for serious eCommerce brands",
  description:
    "A premium directory of vetted 3PL warehouse and fulfillment partners. Find your next fulfillment partner across the US, Canada, and UK.",
  robots: getRobotsMetadata(),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NoindexBanner />
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
