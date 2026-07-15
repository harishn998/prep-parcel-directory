import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { poppins, jetbrainsMono } from "@/lib/fonts";
import { getRobotsMetadata } from "@/lib/seo/noindex";
import { NoindexBanner } from "@/components/layout/noindex-banner";
import { RouteTransition } from "@/components/layout/route-transition";
import { RouteProgress } from "@/components/route-progress";
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
      <head>
        {/* Phase 2E Layer C: dismiss the "Route Trace" preloader (pure CSS
            pseudo-elements, see globals.css) by toggling classes on <html>.
            Enforces a minimum visible duration so fast/cached loads still show
            it. Only mutates documentElement.classList — never touches
            React-tracked DOM, so it cannot collide with route-transition
            reconciliation. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var MIN=850,FADE=450,start=Date.now();console.debug('[pp-preloader] init',location.pathname,'readyState',document.readyState);function done(){var wait=Math.max(0,MIN-(Date.now()-start));setTimeout(function(){var h=document.documentElement;h.classList.add('preloader-done');console.debug('[pp-preloader] dismissed',location.pathname);setTimeout(function(){h.classList.add('preloader-hidden');},FADE);},wait);}if(document.readyState==='complete'){done();}else{window.addEventListener('load',done,{once:true});}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NoindexBanner />
        <NuqsAdapter>
          <RouteTransition>{children}</RouteTransition>
        </NuqsAdapter>
        <RouteProgress />
      </body>
    </html>
  );
}
