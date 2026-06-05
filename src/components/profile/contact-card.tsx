"use client";

import { Phone, Mail, Globe, Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import type { Partner } from "@/lib/data/types";

export function ContactCard({ partner }: { partner: Partner }) {
  return (
    <section className="shadow-card-static rounded-2xl border border-border-soft bg-surface p-6">
      <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-text-3">
        Contact
      </h3>
      <ul className="mt-4 space-y-2.5">
        <ContactRow
          icon={Phone}
          label="Phone"
          value={partner.contact.phone}
        />
        <ContactRow
          icon={Mail}
          label="Email"
          value={partner.contact.email}
        />
        <ContactRow
          icon={Globe}
          label="Website"
          value={partner.contact.website.replace(/^https?:\/\//, "")}
          copyValue={partner.contact.website}
        />
      </ul>
    </section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  copyValue,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  copyValue?: string;
}) {
  const { copy, copied } = useCopyToClipboard();
  return (
    <li>
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border-soft bg-background px-3 py-2.5 transition-colors duration-200 hover:border-blue">
        <span className="flex min-w-0 items-center gap-2.5">
          <Icon className="h-4 w-4 shrink-0 text-text-3" strokeWidth={2} />
          <span className="min-w-0">
            <span className="block text-[11px] font-medium uppercase tracking-[0.08em] text-text-3">
              {label}
            </span>
            <span className="block truncate text-[13px] font-medium text-text">
              {value}
            </span>
          </span>
        </span>
        <button
          type="button"
          onClick={() => copy(copyValue ?? value)}
          aria-label={`Copy ${label.toLowerCase()}`}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-3 transition-colors duration-200 hover:bg-secondary hover:text-navy"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-success" strokeWidth={2.5} />
          ) : (
            <Copy className="h-3.5 w-3.5" strokeWidth={2} />
          )}
        </button>
      </div>
    </li>
  );
}
