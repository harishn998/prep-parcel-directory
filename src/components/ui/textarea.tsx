import * as React from "react";

import { cn } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
          "flex min-h-[88px] w-full rounded-lg border border-border-soft bg-surface px-3 py-2 text-[14px] text-text outline-none transition-colors placeholder:text-text-3 focus-visible:border-blue focus-visible:ring-2 focus-visible:ring-blue/15 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus-visible:ring-red-500/15",
          className
        )}
        {...props}
      />
    );
  }
);

export { Textarea };
