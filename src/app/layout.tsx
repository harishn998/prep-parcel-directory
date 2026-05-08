import type { Metadata } from "next";
import { poppins, jetbrainsMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://prepparcelpartners.example"),
  title: "Prep Parcel Partners — The 3PL directory for serious eCommerce brands",
  description:
    "A premium directory of vetted 3PL warehouse and fulfillment partners. Find your next fulfillment partner across the US, Canada, and UK.",
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
        {children}
      </body>
    </html>
  );
}
