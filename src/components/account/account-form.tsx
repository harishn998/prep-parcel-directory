"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { updateOwnProfile } from "@/lib/actions/account";
import type { ProfileRow } from "@/lib/data/db-types";

interface AccountFormProps {
  profile: ProfileRow;
  /** Show the "Sign out" control. Hidden where the surrounding shell already
   * offers sign-out (e.g. the admin sidebar). Defaults to true. */
  showSignOut?: boolean;
}

export function AccountForm({ profile, showSignOut = true }: AccountFormProps) {
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [busy, setBusy] = useState(false);

  const dirty = (fullName.trim() || null) !== (profile.full_name ?? null);

  async function onSave() {
    if (busy) return;
    setBusy(true);
    const r = await updateOwnProfile({ fullName });
    setBusy(false);
    if (r.success) {
      toast.success("Profile updated");
    } else {
      toast.error(r.error ?? "Could not update profile");
    }
  }

  async function onSignOut() {
    await fetch("/auth/signout", {
      method: "POST",
      credentials: "same-origin",
    });
    window.location.assign("/");
  }

  return (
    <div className="grid gap-5 rounded-xl border border-border bg-surface p-6">
      <AdminFormField
        label="Display name"
        htmlFor="acct-name"
        hint="How your name appears across Prep Parcel."
        charCount={{ current: fullName.length, max: 80 }}
      >
        <Input
          id="acct-name"
          value={fullName}
          maxLength={80}
          placeholder="Your name"
          onChange={(e) => setFullName(e.target.value)}
        />
      </AdminFormField>

      <AdminFormField
        label="Email"
        htmlFor="acct-email"
        hint="Your sign-in email can't be changed here."
      >
        <Input
          id="acct-email"
          value={profile.email}
          readOnly
          disabled
          className="cursor-not-allowed text-text-2"
        />
      </AdminFormField>

      <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-5">
        {showSignOut ? (
          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-[14px] font-medium text-text-2 transition-colors hover:bg-background hover:text-text"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
            Sign out
          </button>
        ) : (
          <span />
        )}
        <Button
          type="button"
          onClick={onSave}
          disabled={busy || !dirty}
          className="bg-blue text-white hover:bg-blue-hover"
        >
          {busy ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
