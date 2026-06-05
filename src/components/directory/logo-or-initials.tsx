import Image from "next/image";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const SIZE_CLASS: Record<Size, string> = {
  sm: "h-10 w-10 text-[13px]",
  md: "h-14 w-14 text-[15px]",
  lg: "h-20 w-20 text-[20px] md:h-24 md:w-24 md:text-[24px]",
};

const SIZE_PX: Record<Size, string> = {
  sm: "40px",
  md: "56px",
  lg: "96px",
};

export function LogoOrInitials({
  logoUrl,
  initials,
  name,
  size = "md",
  className,
}: {
  logoUrl: string | null;
  initials: string;
  name: string;
  size?: Size;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-xl border border-border-soft bg-secondary",
        SIZE_CLASS[size],
        className
      )}
    >
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={`${name} logo`}
          fill
          sizes={SIZE_PX[size]}
          className="object-contain p-1.5"
        />
      ) : (
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center font-semibold tracking-tight text-navy"
        >
          {initials}
        </span>
      )}
    </div>
  );
}
