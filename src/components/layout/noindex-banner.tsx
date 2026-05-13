import { isSiteNoindex } from "@/lib/seo/noindex";

export function NoindexBanner() {
  if (!isSiteNoindex()) return null;

  return (
    <div
      className="w-full bg-amber/15 border-b border-amber/30 py-2 px-4 text-center"
      role="alert"
    >
      <p className="text-[12px] font-medium text-amber">
        <span className="font-mono uppercase tracking-wider text-[11px]">
          Noindex mode
        </span>
        <span className="mx-2 opacity-50">·</span>
        This site is hidden from search engines. Set{" "}
        <code className="bg-amber/20 px-1.5 py-0.5 rounded text-[11px] font-mono">
          NEXT_PUBLIC_SITE_NOINDEX=false
        </code>{" "}
        to enable indexing.
      </p>
    </div>
  );
}
