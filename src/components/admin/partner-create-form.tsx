"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { createPartner } from "@/lib/actions/admin/partners";
import type { PartnerFormData } from "@/lib/validation/partner";
import type { ActionResult } from "@/lib/actions/admin/_result";

const COUNTRY_CODE_MAP: Record<
  PartnerFormData["country"],
  PartnerFormData["countryCode"]
> = {
  USA: "US",
  Canada: "CA",
  UK: "GB",
};

const EMPTY: PartnerFormData = {
  slug: "",
  name: "",
  tagline: null,
  description: null,
  location: "",
  country: "USA",
  countryCode: "US",
  state: "",
  stateFullName: "",
  city: null,
  cityFullName: null,
  servedStates: [],
  yearFounded: null,
  employeeCount: null,
  minimumOrderVolume: null,
  pricingModel: null,
  responseTime: null,
  fulfillmentSpeed: null,
  orderAccuracy: null,
  activeBrandsServed: null,
  services: [],
  serviceCategories: [],
  integrations: [],
  certifications: [],
  specialties: [],
  contact: null,
  verified: false,
  isFeatured: false,
  isActive: true,
  metaTitle: null,
  metaDescription: null,
};

interface PartnerCreateFormProps {
  /** Prefill values merged over the empty form (e.g. from an approved submission). */
  defaults?: Partial<PartnerFormData>;
  /** Override the submit action. Defaults to createPartner. Must return the new
   * partner's id + slug so we can route to its admin page. */
  submitAction?: (
    form: PartnerFormData
  ) => Promise<ActionResult<{ id: string; slug: string }>>;
  submitLabel?: string;
  submittingLabel?: string;
  successMessage?: string;
}

export function PartnerCreateForm({
  defaults,
  submitAction = createPartner,
  submitLabel = "Create partner",
  submittingLabel = "Creating…",
  successMessage = "Partner created",
}: PartnerCreateFormProps = {}) {
  const router = useRouter();
  const [form, setForm] = useState<PartnerFormData>({ ...EMPTY, ...defaults });
  const [busy, setBusy] = useState(false);

  function update<K extends keyof PartnerFormData>(
    key: K,
    value: PartnerFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit() {
    if (busy) return;
    setBusy(true);
    const r = await submitAction(form);
    setBusy(false);
    if (r.success) {
      toast.success(successMessage);
      router.push(`/admin/partners/${r.data.id}`);
    } else {
      toast.error(r.error ?? "Could not save partner");
    }
  }

  return (
    <div className="grid gap-5 rounded-xl border border-border bg-surface p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <AdminFormField label="Slug" htmlFor="f-slug" required hint="Lowercase letters, numbers, hyphens only.">
          <Input
            id="f-slug"
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
          />
        </AdminFormField>
        <AdminFormField label="Name" htmlFor="f-name" required>
          <Input
            id="f-name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </AdminFormField>
      </div>

      <AdminFormField label="Tagline" htmlFor="f-tag">
        <Input
          id="f-tag"
          value={form.tagline ?? ""}
          onChange={(e) =>
            update("tagline", e.target.value === "" ? null : e.target.value)
          }
        />
      </AdminFormField>

      <AdminFormField label="Description" htmlFor="f-desc">
        <Textarea
          id="f-desc"
          rows={4}
          value={form.description ?? ""}
          onChange={(e) =>
            update("description", e.target.value === "" ? null : e.target.value)
          }
        />
      </AdminFormField>

      <div className="grid gap-5 md:grid-cols-3">
        <AdminFormField label="Country" htmlFor="f-country" required>
          <select
            id="f-country"
            value={form.country}
            onChange={(e) => {
              const country = e.target.value as PartnerFormData["country"];
              setForm((prev) => ({
                ...prev,
                country,
                countryCode: COUNTRY_CODE_MAP[country],
              }));
            }}
            className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-[14px] text-text"
          >
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
            <option value="UK">UK</option>
          </select>
        </AdminFormField>
        <AdminFormField label="Region (state slug)" htmlFor="f-state" required>
          <Input
            id="f-state"
            value={form.state}
            onChange={(e) => update("state", e.target.value)}
          />
        </AdminFormField>
        <AdminFormField label="State full name" htmlFor="f-statefull" required>
          <Input
            id="f-statefull"
            value={form.stateFullName}
            onChange={(e) => update("stateFullName", e.target.value)}
          />
        </AdminFormField>
      </div>

      <AdminFormField label="Location string" htmlFor="f-location" required hint="Display string, e.g. 'San Diego, CA'">
        <Input
          id="f-location"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
        />
      </AdminFormField>

      <div className="mt-2 flex items-center justify-end gap-2 border-t border-border pt-5">
        <Link
          href="/admin/partners"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-4 text-[14px] font-medium text-text transition-colors hover:bg-background"
        >
          Cancel
        </Link>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={busy}
          className="bg-blue text-white hover:bg-blue-hover"
        >
          {busy ? submittingLabel : submitLabel}
        </Button>
      </div>
    </div>
  );
}
