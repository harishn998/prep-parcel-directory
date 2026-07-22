"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ExternalLink, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTab, TabsPanel } from "@/components/ui/tabs";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { AdminTagInput } from "@/components/admin/admin-tag-input";
import { updateOwnListing } from "@/lib/actions/partner/listing";
import type { PartnerFormData } from "@/lib/validation/partner";

// The partner may edit everything EXCEPT the protected/admin-managed fields.
// Mirrors partnerListingUpdateSchema (slug/verified/isFeatured/isActive omitted).
export type PartnerListingFormData = Omit<
  PartnerFormData,
  "slug" | "verified" | "isFeatured" | "isActive"
>;

const COUNTRY_CODE_MAP: Record<
  PartnerListingFormData["country"],
  PartnerListingFormData["countryCode"]
> = {
  USA: "US",
  Canada: "CA",
  UK: "GB",
};

type Tab = "basics" | "business" | "tags" | "contact" | "seo";

interface Props {
  partnerId: string;
  slug: string; // for the public-profile link only; NOT editable here
  isActive: boolean;
  initial: PartnerListingFormData;
}

export function PartnerListingForm({ partnerId, slug, isActive, initial }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("basics");
  const [form, setForm] = useState<PartnerListingFormData>(initial);
  const [saving, setSaving] = useState(false);

  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initial),
    [form, initial]
  );

  function update<K extends keyof PartnerListingFormData>(
    key: K,
    value: PartnerListingFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateContact(key: "phone" | "email" | "website", value: string) {
    setForm((prev) => ({
      ...prev,
      contact: {
        phone: prev.contact?.phone ?? "",
        email: prev.contact?.email ?? "",
        website: prev.contact?.website ?? "",
        [key]: value,
      },
    }));
  }

  async function onSave() {
    if (saving || !dirty) return;
    setSaving(true);
    const r = await updateOwnListing(partnerId, form);
    setSaving(false);
    if (r.success) {
      toast.success("Listing updated");
      router.refresh();
    } else {
      toast.error(r.error ?? "Update failed");
    }
  }

  return (
    <div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList>
          <TabsTab value="basics">Basics</TabsTab>
          <TabsTab value="business">Business</TabsTab>
          <TabsTab value="tags">Services &amp; tags</TabsTab>
          <TabsTab value="contact">Contact</TabsTab>
          <TabsTab value="seo">SEO</TabsTab>
        </TabsList>

        {/* BASICS — note: NO slug field (protected). */}
        <TabsPanel value="basics">
          <div className="grid gap-5 rounded-xl border border-border bg-surface p-6">
            <AdminFormField label="Company name" htmlFor="p-name" required>
              <Input
                id="p-name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </AdminFormField>
            <AdminFormField
              label="Tagline"
              htmlFor="p-tagline"
              charCount={{ current: (form.tagline ?? "").length, max: 200 }}
            >
              <Input
                id="p-tagline"
                value={form.tagline ?? ""}
                onChange={(e) => update("tagline", e.target.value)}
              />
            </AdminFormField>
            <AdminFormField
              label="Description"
              htmlFor="p-desc"
              charCount={{ current: (form.description ?? "").length, max: 2000 }}
            >
              <Textarea
                id="p-desc"
                rows={5}
                value={form.description ?? ""}
                onChange={(e) => update("description", e.target.value)}
              />
            </AdminFormField>
            <div className="grid gap-5 md:grid-cols-3">
              <AdminFormField label="Country" htmlFor="p-country" required>
                <select
                  id="p-country"
                  value={form.country}
                  onChange={(e) => {
                    const country = e.target
                      .value as PartnerListingFormData["country"];
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
              <AdminFormField label="Country code" htmlFor="p-cc">
                <Input id="p-cc" value={form.countryCode} disabled />
              </AdminFormField>
              <AdminFormField
                label="Region (state slug)"
                htmlFor="p-state"
                required
              >
                <Input
                  id="p-state"
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                />
              </AdminFormField>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <AdminFormField
                label="State full name"
                htmlFor="p-statefull"
                required
              >
                <Input
                  id="p-statefull"
                  value={form.stateFullName}
                  onChange={(e) => update("stateFullName", e.target.value)}
                />
              </AdminFormField>
              <AdminFormField
                label="Location string"
                htmlFor="p-location"
                required
                hint="Display string, e.g. 'San Diego, CA'"
              >
                <Input
                  id="p-location"
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                />
              </AdminFormField>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <AdminFormField
                label="City slug"
                htmlFor="p-city"
                hint="Optional taxonomy city slug."
              >
                <Input
                  id="p-city"
                  value={form.city ?? ""}
                  onChange={(e) =>
                    update("city", e.target.value === "" ? null : e.target.value)
                  }
                />
              </AdminFormField>
              <AdminFormField label="City full name" htmlFor="p-cityfull">
                <Input
                  id="p-cityfull"
                  value={form.cityFullName ?? ""}
                  onChange={(e) =>
                    update(
                      "cityFullName",
                      e.target.value === "" ? null : e.target.value
                    )
                  }
                />
              </AdminFormField>
            </div>
            <AdminFormField
              label="Served states"
              hint="Other state slugs your warehouses can serve."
            >
              <AdminTagInput
                value={form.servedStates}
                onChange={(next) => update("servedStates", next)}
                placeholder="e.g. california, oregon"
              />
            </AdminFormField>
          </div>
        </TabsPanel>

        {/* BUSINESS */}
        <TabsPanel value="business">
          <div className="grid gap-5 rounded-xl border border-border bg-surface p-6 md:grid-cols-2">
            <AdminFormField label="Year founded" htmlFor="p-year">
              <Input
                id="p-year"
                type="number"
                value={form.yearFounded ?? ""}
                onChange={(e) =>
                  update(
                    "yearFounded",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
              />
            </AdminFormField>
            <AdminFormField label="Employee count" htmlFor="p-emp">
              <Input
                id="p-emp"
                value={form.employeeCount ?? ""}
                onChange={(e) => update("employeeCount", e.target.value)}
              />
            </AdminFormField>
            <AdminFormField label="Minimum order volume" htmlFor="p-mov">
              <Input
                id="p-mov"
                value={form.minimumOrderVolume ?? ""}
                onChange={(e) => update("minimumOrderVolume", e.target.value)}
              />
            </AdminFormField>
            <AdminFormField label="Pricing model" htmlFor="p-price">
              <Input
                id="p-price"
                value={form.pricingModel ?? ""}
                onChange={(e) => update("pricingModel", e.target.value)}
              />
            </AdminFormField>
            <AdminFormField label="Response time" htmlFor="p-resp">
              <Input
                id="p-resp"
                value={form.responseTime ?? ""}
                onChange={(e) => update("responseTime", e.target.value)}
              />
            </AdminFormField>
            <AdminFormField label="Fulfillment speed" htmlFor="p-speed">
              <Input
                id="p-speed"
                value={form.fulfillmentSpeed ?? ""}
                onChange={(e) => update("fulfillmentSpeed", e.target.value)}
              />
            </AdminFormField>
            <AdminFormField label="Order accuracy (%)" htmlFor="p-acc">
              <Input
                id="p-acc"
                type="number"
                step="0.01"
                value={form.orderAccuracy ?? ""}
                onChange={(e) =>
                  update(
                    "orderAccuracy",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
              />
            </AdminFormField>
            <AdminFormField label="Active brands served" htmlFor="p-brands">
              <Input
                id="p-brands"
                type="number"
                value={form.activeBrandsServed ?? ""}
                onChange={(e) =>
                  update(
                    "activeBrandsServed",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
              />
            </AdminFormField>
          </div>
        </TabsPanel>

        {/* TAGS */}
        <TabsPanel value="tags">
          <div className="grid gap-5 rounded-xl border border-border bg-surface p-6">
            <AdminFormField label="Services">
              <AdminTagInput
                value={form.services}
                onChange={(next) => update("services", next)}
              />
            </AdminFormField>
            <AdminFormField label="Service categories" hint="Taxonomy slugs.">
              <AdminTagInput
                value={form.serviceCategories}
                onChange={(next) => update("serviceCategories", next)}
              />
            </AdminFormField>
            <AdminFormField label="Integrations">
              <AdminTagInput
                value={form.integrations}
                onChange={(next) => update("integrations", next)}
              />
            </AdminFormField>
            <AdminFormField label="Certifications">
              <AdminTagInput
                value={form.certifications}
                onChange={(next) => update("certifications", next)}
              />
            </AdminFormField>
            <AdminFormField label="Specialties">
              <AdminTagInput
                value={form.specialties}
                onChange={(next) => update("specialties", next)}
              />
            </AdminFormField>
          </div>
        </TabsPanel>

        {/* CONTACT */}
        <TabsPanel value="contact">
          <div className="grid gap-5 rounded-xl border border-border bg-surface p-6">
            <AdminFormField label="Phone" htmlFor="p-phone">
              <Input
                id="p-phone"
                value={form.contact?.phone ?? ""}
                onChange={(e) => updateContact("phone", e.target.value)}
              />
            </AdminFormField>
            <AdminFormField label="Email" htmlFor="p-email">
              <Input
                id="p-email"
                type="email"
                value={form.contact?.email ?? ""}
                onChange={(e) => updateContact("email", e.target.value)}
              />
            </AdminFormField>
            <AdminFormField label="Website" htmlFor="p-web" hint="Include https://">
              <Input
                id="p-web"
                type="url"
                value={form.contact?.website ?? ""}
                onChange={(e) => updateContact("website", e.target.value)}
              />
            </AdminFormField>
          </div>
        </TabsPanel>

        {/* SEO */}
        <TabsPanel value="seo">
          <div className="grid gap-5 rounded-xl border border-border bg-surface p-6">
            <AdminFormField
              label="Meta title"
              htmlFor="p-mt"
              charCount={{ current: (form.metaTitle ?? "").length, max: 120 }}
            >
              <Input
                id="p-mt"
                value={form.metaTitle ?? ""}
                onChange={(e) => update("metaTitle", e.target.value)}
              />
            </AdminFormField>
            <AdminFormField
              label="Meta description"
              htmlFor="p-md"
              charCount={{ current: (form.metaDescription ?? "").length, max: 200 }}
            >
              <Textarea
                id="p-md"
                rows={3}
                value={form.metaDescription ?? ""}
                onChange={(e) => update("metaDescription", e.target.value)}
              />
            </AdminFormField>
          </div>
        </TabsPanel>
      </Tabs>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 mt-6 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-text-2">
            {dirty ? "Unsaved changes" : "All changes saved"}
          </span>
          {isActive ? (
            <Link
              href={`/directory/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[13px] font-medium text-blue hover:underline"
            >
              View public page
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
            </Link>
          ) : null}
        </div>
        <Button
          type="button"
          onClick={onSave}
          disabled={!dirty || saving}
          className="bg-blue text-white hover:bg-blue-hover"
        >
          <Save className="h-3.5 w-3.5" />
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
