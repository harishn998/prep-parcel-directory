"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer relative inline-flex h-6 w-11 shrink-0 cursor-default items-center rounded-full border border-transparent bg-border-soft outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue disabled:opacity-50 data-[checked]:bg-blue",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow-sm ring-0 transition-transform data-[checked]:translate-x-[22px]"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
