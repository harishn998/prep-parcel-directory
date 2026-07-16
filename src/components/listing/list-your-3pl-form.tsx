"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { submitListing } from "@/lib/actions/listing";
import { ListingPendingPanel } from "./listing-pending-panel";

export interface ServiceOption {
  slug: string;
  name: string;
}
export interface LocationGroup {
  country: string;
  states: { slug: string; name: string }[];
}

type Errors = Partial<
  Record<
    "name" | "website" | "email" | "description" | "serviceCategories" | "servedStates",
    string
  >
>;

// Public form — deliberately does NOT use the Admin* form components.
function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-text">
        {label}
        {required ? <span className="ml-0.5 text-red-600">*</span> : null}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-[12px] text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[12px] text-text-3">{hint}</p>
      ) : null}
    </div>
  );
}

const URL_RE = /^https?:\/\/.+\..+/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ListYour3plForm({
  defaultEmail,
  serviceOptions,
  locationGroups,
}: {
  defaultEmail: string;
  serviceOptions: ServiceOption[];
  locationGroups: LocationGroup[];
}) {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState(defaultEmail);
  const [description, setDescription] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function toggle(list: string[], set: (v: string[]) => void, slug: string) {
    set(list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]);
  }

  function validate(): Errors {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = "Enter your company name.";
    if (!URL_RE.test(website.trim()))
      e.website = "Enter a valid website URL (including https://).";
    if (!EMAIL_RE.test(email.trim())) e.email = "Enter a valid contact email.";
    if (description.trim().length < 20)
      e.description = "Add at least a sentence describing what you do.";
    if (services.length === 0) e.serviceCategories = "Select at least one service.";
    if (locations.length === 0)
      e.servedStates = "Select at least one location you serve.";
    return e;
  }

  async function onSubmit() {
    if (busy) return;
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setBusy(true);
    const r = await submitListing({
      name: name.trim(),
      website: website.trim(),
      email: email.trim(),
      description: description.trim(),
      serviceCategories: services,
      servedStates: locations,
    });
    setBusy(false);
    if (r.success) {
      setSubmitted(true);
      toast.success("Listing submitted for review");
    } else {
      toast.error(r.error ?? "Could not submit your listing.");
    }
  }

  if (submitted) {
    return <ListingPendingPanel justSubmitted companyName={name.trim() || null} />;
  }

  return (
    <div className="grid gap-6 rounded-2xl border border-border-soft bg-surface p-6 shadow-sm md:p-8">
      <Field label="Company name" htmlFor="l-name" required error={errors.name}>
        <Input
          id="l-name"
          value={name}
          maxLength={120}
          placeholder="Acme Fulfillment Co."
          onChange={(e) => setName(e.target.value)}
        />
      </Field>

      <div className="grid gap-6 md:grid-cols-2">
        <Field
          label="Website"
          htmlFor="l-website"
          required
          error={errors.website}
          hint="Include https://"
        >
          <Input
            id="l-website"
            type="url"
            value={website}
            placeholder="https://acmefulfillment.com"
            onChange={(e) => setWebsite(e.target.value)}
          />
        </Field>
        <Field
          label="Contact email"
          htmlFor="l-email"
          required
          error={errors.email}
          hint="Where we'll reach you about this listing."
        >
          <Input
            id="l-email"
            type="email"
            value={email}
            placeholder="ops@acmefulfillment.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
      </div>

      <Field
        label="Description"
        htmlFor="l-description"
        required
        error={errors.description}
        hint="What you do, who you serve, and what makes you a good fit."
      >
        <Textarea
          id="l-description"
          rows={5}
          value={description}
          maxLength={2000}
          placeholder="We're a Midwest 3PL specializing in DTC fulfillment and FBA prep for supplement and beverage brands…"
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>

      <Field
        label="Services offered"
        required
        error={errors.serviceCategories}
        hint="Select every service you provide."
      >
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {serviceOptions.map((opt) => {
            const checked = services.includes(opt.slug);
            return (
              <label
                key={opt.slug}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border-soft bg-background px-3 py-2.5 text-[13px] text-text transition-colors hover:border-blue/40"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggle(services, setServices, opt.slug)}
                />
                <span>{opt.name}</span>
              </label>
            );
          })}
        </div>
      </Field>

      <Field
        label="Locations served"
        required
        error={errors.servedStates}
        hint="Select the regions your warehouses can serve."
      >
        <div className="flex flex-col gap-4">
          {locationGroups.map((group) => (
            <div key={group.country}>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">
                {group.country}
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {group.states.map((st) => {
                  const checked = locations.includes(st.slug);
                  return (
                    <label
                      key={st.slug}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border-soft bg-background px-3 py-2 text-[13px] text-text transition-colors hover:border-blue/40"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggle(locations, setLocations, st.slug)}
                      />
                      <span>{st.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Field>

      <div className="flex items-center justify-between gap-4 border-t border-border-soft pt-6">
        <p className="text-[12px] text-text-3">
          Submissions are reviewed before going live.
        </p>
        <button
          type="button"
          onClick={onSubmit}
          disabled={busy}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-blue px-5 text-[14px] font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Submitting…" : "Submit for review"}
        </button>
      </div>
    </div>
  );
}
