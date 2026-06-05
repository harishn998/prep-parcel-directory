import { cn } from "@/lib/utils";

export function ServicePill({
  children,
  muted = false,
  className,
}: {
  children: React.ReactNode;
  muted?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium",
        muted
          ? "bg-secondary/60 text-text-3"
          : "bg-slate-100 text-text-2",
        className
      )}
    >
      {children}
    </span>
  );
}
