"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, ExternalLink, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsList,
  TabsTab,
  TabsPanel,
} from "@/components/ui/tabs";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { AdminTagInput } from "@/components/admin/admin-tag-input";
import { AdminConfirmModal } from "@/components/admin/admin-confirm-modal";
import { LogoUploader } from "@/components/admin/media-upload/logo-uploader";
import { CoverUploader } from "@/components/admin/media-upload/cover-uploader";
import {
  updatePartner,
  togglePartnerVerified,
  togglePartnerFeatured,
  deactivatePartner,
  reactivatePartner,
} from "@/lib/actions/admin/partners";
import {
  WarehouseManager,
  type WarehouseEntry,
} from "@/components/shared/warehouse-manager";
import { relativeTime } from "@/lib/utils";
import type { PartnerFormData } from "@/lib/validation/partner";

interface Props {
  partnerId: string;
  initial: PartnerFormData;
  warehouses: WarehouseEntry[];
  meta: { createdAt: string; updatedAt: string };
  currentLogoUrl: string | null;
  currentCoverUrl: string | null;
}

const COUNTRY_CODE_MAP: Record<PartnerFormData["country"], PartnerFormData["countryCode"]> = {
  USA: "US",
  Canada: "CA",
  UK: "GB",
};

type Tab =
  | "media"
  | "basics"
  | "business"
  | "tags"
  | "contact"
  | "seo"
  | "warehouses";

export function PartnerEditForm({
  partnerId,
  initial,
  warehouses: initialWarehouses,
  meta,
  currentLogoUrl,
  currentCoverUrl,
}: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("media");
  const [form, setForm] = useState<PartnerFormData>(initial);
  const [warehouses, setWarehouses] =
    useState<WarehouseEntry[]>(initialWarehouses);
  const [, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);

  const dirty = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(initial);
  }, [form, initial]);

  function update<K extends keyof PartnerFormData>(
    key: K,
    value: PartnerFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateContact(
    key: "phone" | "email" | "website",
    value: string
  ) {
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

  function discardChanges() {
    setForm(initial);
  }

  async function onSave() {
    if (saving) return;
    setSaving(true);
    const r = await updatePartner(partnerId, form);
    setSaving(false);
    if (r.success) {
      toast.success("Partner updated");
      router.refresh();
    } else {
      toast.error(r.error ?? "Update failed");
    }
  }

  function copyPublicUrl() {
    const url = `${window.location.origin}/directory/${form.slug}`;
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("URL copied"))
      .catch(() => toast.error("Could not copy URL"));
  }

  function runStatusAction(
    fn: () => Promise<{ success: boolean; error?: string }>,
    successMsg: string
  ) {
    startTransition(async () => {
      const r = await fn();
      if (r.success) {
        toast.success(successMsg);
        router.refresh();
      } else {
        toast.error(r.error ?? "Action failed");
      }
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Form column */}
      <div className="lg:col-span-8">
        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
          <TabsList>
            <TabsTab value="media">Media</TabsTab>
            <TabsTab value="basics">Basics</TabsTab>
            <TabsTab value="business">Business</TabsTab>
            <TabsTab value="tags">Services & tags</TabsTab>
            <TabsTab value="contact">Contact</TabsTab>
            <TabsTab value="seo">SEO</TabsTab>
            <TabsTab value="warehouses">Warehouses</TabsTab>
          </TabsList>

          {/* MEDIA */}
          <TabsPanel value="media">
            <div className="grid gap-8 rounded-xl border border-border bg-surface p-6">
              <section className="flex flex-col gap-3">
                <div>
                  <h3 className="font-heading text-[15px] font-semibold text-navy">
                    Logo
                  </h3>
                  <p className="mt-1 text-[13px] text-text-2">
                    Square image, displayed at ~56px on cards and ~80px on the
                    profile. PNG, JPG, or WebP.
                  </p>
                </div>
                <LogoUploader
                  partnerId={partnerId}
                  currentUrl={currentLogoUrl}
                />
              </section>

              <section className="flex flex-col gap-3">
                <div>
                  <h3 className="font-heading text-[15px] font-semibold text-navy">
                    Cover image
                  </h3>
                  <p className="mt-1 text-[13px] text-text-2">
                    Wide banner image, displayed at the top of the partner
                    profile. 3:1 aspect, max 5 MB.
                  </p>
                </div>
                <CoverUploader
                  partnerId={partnerId}
                  currentUrl={currentCoverUrl}
                />
              </section>
            </div>
          </TabsPanel>

          {/* BASICS */}
          <TabsPanel value="basics">
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
              <AdminFormField
                label="Tagline"
                htmlFor="f-tagline"
                charCount={{ current: (form.tagline ?? "").length, max: 200 }}
              >
                <Input
                  id="f-tagline"
                  value={form.tagline ?? ""}
                  onChange={(e) => update("tagline", e.target.value)}
                />
              </AdminFormField>
              <AdminFormField
                label="Description"
                htmlFor="f-desc"
                charCount={{ current: (form.description ?? "").length, max: 2000 }}
              >
                <Textarea
                  id="f-desc"
                  rows={5}
                  value={form.description ?? ""}
                  onChange={(e) => update("description", e.target.value)}
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
                <AdminFormField label="Country code" htmlFor="f-cc">
                  <Input id="f-cc" value={form.countryCode} disabled />
                </AdminFormField>
                <AdminFormField label="Region (state slug)" htmlFor="f-state" required>
                  <Input
                    id="f-state"
                    value={form.state}
                    onChange={(e) => update("state", e.target.value)}
                  />
                </AdminFormField>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <AdminFormField label="State full name" htmlFor="f-statefull" required>
                  <Input
                    id="f-statefull"
                    value={form.stateFullName}
                    onChange={(e) => update("stateFullName", e.target.value)}
                  />
                </AdminFormField>
                <AdminFormField label="Location string" htmlFor="f-location" required hint="Display string, e.g. 'San Diego, CA'">
                  <Input
                    id="f-location"
                    value={form.location}
                    onChange={(e) => update("location", e.target.value)}
                  />
                </AdminFormField>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <AdminFormField label="City slug" htmlFor="f-city" hint="Optional taxonomy city slug.">
                  <Input
                    id="f-city"
                    value={form.city ?? ""}
                    onChange={(e) =>
                      update("city", e.target.value === "" ? null : e.target.value)
                    }
                  />
                </AdminFormField>
                <AdminFormField label="City full name" htmlFor="f-cityfull">
                  <Input
                    id="f-cityfull"
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
              <AdminFormField label="Served states" hint="Other state slugs this partner can serve.">
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
              <AdminFormField label="Year founded" htmlFor="f-year">
                <Input
                  id="f-year"
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
              <AdminFormField label="Employee count" htmlFor="f-emp">
                <Input
                  id="f-emp"
                  value={form.employeeCount ?? ""}
                  onChange={(e) => update("employeeCount", e.target.value)}
                />
              </AdminFormField>
              <AdminFormField label="Minimum order volume" htmlFor="f-mov">
                <Input
                  id="f-mov"
                  value={form.minimumOrderVolume ?? ""}
                  onChange={(e) => update("minimumOrderVolume", e.target.value)}
                />
              </AdminFormField>
              <AdminFormField label="Pricing model" htmlFor="f-price">
                <Input
                  id="f-price"
                  value={form.pricingModel ?? ""}
                  onChange={(e) => update("pricingModel", e.target.value)}
                />
              </AdminFormField>
              <AdminFormField label="Response time" htmlFor="f-resp">
                <Input
                  id="f-resp"
                  value={form.responseTime ?? ""}
                  onChange={(e) => update("responseTime", e.target.value)}
                />
              </AdminFormField>
              <AdminFormField label="Fulfillment speed" htmlFor="f-speed">
                <Input
                  id="f-speed"
                  value={form.fulfillmentSpeed ?? ""}
                  onChange={(e) => update("fulfillmentSpeed", e.target.value)}
                />
              </AdminFormField>
              <AdminFormField label="Order accuracy (%)" htmlFor="f-acc">
                <Input
                  id="f-acc"
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
              <AdminFormField label="Active brands served" htmlFor="f-brands">
                <Input
                  id="f-brands"
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
              <AdminFormField label="Phone" htmlFor="f-phone">
                <Input
                  id="f-phone"
                  value={form.contact?.phone ?? ""}
                  onChange={(e) => updateContact("phone", e.target.value)}
                />
              </AdminFormField>
              <AdminFormField label="Email" htmlFor="f-email">
                <Input
                  id="f-email"
                  type="email"
                  value={form.contact?.email ?? ""}
                  onChange={(e) => updateContact("email", e.target.value)}
                />
              </AdminFormField>
              <AdminFormField label="Website" htmlFor="f-web" hint="Include https://">
                <Input
                  id="f-web"
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
                htmlFor="f-mt"
                charCount={{ current: (form.metaTitle ?? "").length, max: 120 }}
              >
                <Input
                  id="f-mt"
                  value={form.metaTitle ?? ""}
                  onChange={(e) => update("metaTitle", e.target.value)}
                />
              </AdminFormField>
              <AdminFormField
                label="Meta description"
                htmlFor="f-md"
                charCount={{ current: (form.metaDescription ?? "").length, max: 200 }}
              >
                <Textarea
                  id="f-md"
                  rows={3}
                  value={form.metaDescription ?? ""}
                  onChange={(e) => update("metaDescription", e.target.value)}
                />
              </AdminFormField>
            </div>
          </TabsPanel>

          {/* WAREHOUSES */}
          <TabsPanel value="warehouses">
            <WarehouseManager
              partnerId={partnerId}
              initial={warehouses}
              onChange={setWarehouses}
            />
          </TabsPanel>
        </Tabs>

        {/* Sticky save bar */}
        <div className="sticky bottom-0 mt-6 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 shadow-md">
          <span className="text-[13px] text-text-2">
            {dirty ? "Unsaved changes" : "All changes saved"}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={discardChanges}
              disabled={!dirty || saving}
            >
              Discard
            </Button>
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
      </div>

      {/* Sidebar column */}
      <aside className="flex flex-col gap-4 lg:col-span-4">
        {/* Status card */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="text-[14px] font-semibold text-text">Status</h3>
          <div className="mt-4 space-y-3.5">
            <ToggleRow
              label="Active"
              hint="Show this partner in the public directory"
              checked={form.isActive}
              onChange={(next) => {
                update("isActive", next);
                runStatusAction(
                  () =>
                    next
                      ? reactivatePartner(partnerId)
                      : deactivatePartner(partnerId),
                  next ? "Reactivated" : "Deactivated"
                );
              }}
            />
            <ToggleRow
              label="Verified"
              hint="Marks this partner with a verified badge"
              checked={form.verified}
              onChange={(next) => {
                update("verified", next);
                runStatusAction(
                  () => togglePartnerVerified(partnerId, !next),
                  next ? "Marked verified" : "Verification removed"
                );
              }}
            />
            <ToggleRow
              label="Featured"
              hint="Promote on directory landing pages"
              checked={form.isFeatured}
              onChange={(next) => {
                update("isFeatured", next);
                runStatusAction(
                  () => togglePartnerFeatured(partnerId, !next),
                  next ? "Featured" : "Unfeatured"
                );
              }}
            />
          </div>
          <div className="mt-5 grid gap-1 border-t border-border pt-4 text-[12px] text-text-3">
            <div>Created {relativeTime(meta.createdAt)}</div>
            <div>Last updated {relativeTime(meta.updatedAt)}</div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="text-[14px] font-semibold text-text">Quick actions</h3>
          <div className="mt-3 space-y-2">
            <Link
              href={`/directory/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-[13px] font-medium text-text transition-colors hover:bg-background"
            >
              <span>View on public site</span>
              <ExternalLink className="h-3.5 w-3.5 text-text-3" strokeWidth={2} />
            </Link>
            <button
              type="button"
              onClick={copyPublicUrl}
              className="inline-flex w-full items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-[13px] font-medium text-text transition-colors hover:bg-background"
            >
              <span>Copy public URL</span>
              <Copy className="h-3.5 w-3.5 text-text-3" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="rounded-xl border border-red-200 bg-red-50/40 p-5">
          <h3 className="text-[14px] font-semibold text-red-700">Danger zone</h3>
          <p className="mt-1 text-[12px] text-red-700/80">
            {form.isActive
              ? "Deactivating hides this partner from public listings. Reversible."
              : "This partner is currently inactive. Reactivate to re-list publicly."}
          </p>
          {form.isActive ? (
            <AdminConfirmModal
              title="Deactivate this partner?"
              description="This will hide the partner from public listings. They can be reactivated later."
              confirmText="Deactivate"
              confirmTone="destructive"
              onConfirm={() => {
                runStatusAction(
                  () => deactivatePartner(partnerId),
                  "Deactivated"
                );
              }}
              trigger={
                <button
                  type="button"
                  className="mt-3 inline-flex h-9 items-center justify-center rounded-lg border border-red-300 bg-white px-3 text-[13px] font-medium text-red-700 transition-colors hover:bg-red-100"
                >
                  Deactivate partner
                </button>
              }
            />
          ) : (
            <button
              type="button"
              onClick={() =>
                runStatusAction(
                  () => reactivatePartner(partnerId),
                  "Reactivated"
                )
              }
              className="mt-3 inline-flex h-9 items-center justify-center rounded-lg border border-red-300 bg-white px-3 text-[13px] font-medium text-red-700 transition-colors hover:bg-red-100"
            >
              Reactivate partner
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="text-[13px] font-medium text-text">{label}</div>
        {hint ? (
          <div className="mt-0.5 text-[12px] text-text-3">{hint}</div>
        ) : null}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={(next) => onChange(Boolean(next))}
      />
    </div>
  );
}
