import * as React from "react";

import { cn } from "@/lib/utils";

interface AdminFormFieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
  charCount?: { current: number; max: number };
  children: React.ReactNode;
  className?: string;
}

export function AdminFormField({
  label,
  htmlFor,
  hint,
  error,
  required,
  charCount,
  children,
  className,
}: AdminFormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={htmlFor}
          className="text-[13px] font-medium text-text"
        >
          {label}
          {required ? <span className="ml-0.5 text-red-600">*</span> : null}
        </label>
        {charCount ? (
          <span
            className={cn(
              "font-mono text-[11px]",
              charCount.current > charCount.max
                ? "text-red-600"
                : "text-text-3"
            )}
          >
            {charCount.current}/{charCount.max}
          </span>
        ) : null}
      </div>
      {children}
      {error ? (
        <p
          role="alert"
          className="text-[12px] text-red-600"
        >
          {error}
        </p>
      ) : hint ? (
        <p className="text-[12px] text-text-3">{hint}</p>
      ) : null}
    </div>
  );
}
