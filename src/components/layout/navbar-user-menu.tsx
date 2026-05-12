"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProfileRow } from "@/lib/data/db-types";

function initialsFor(profile: ProfileRow): string {
  const source = profile.full_name?.trim() || profile.email;
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
}

export function NavbarUserMenu({ profile }: { profile: ProfileRow }) {
  const initials = initialsFor(profile);
  const displayName = profile.full_name?.trim() || profile.email;
  const isAdmin = profile.role === "admin";

  async function onSignOut() {
    await fetch("/auth/signout", {
      method: "POST",
      credentials: "same-origin",
    });
    // Hard reload so the server-rendered Navbar refetches profile and the
    // dropdown reverts to the Sign In button.
    window.location.assign("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open user menu"
        className="inline-flex items-center gap-1.5 rounded-full p-0.5 outline-none transition-colors duration-200 hover:bg-secondary focus-visible:ring-2 focus-visible:ring-blue"
      >
        {profile.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt=""
            referrerPolicy="no-referrer"
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-[12px] font-semibold text-white">
            {initials}
          </span>
        )}
        <ChevronDown className="h-3.5 w-3.5 text-text-3" strokeWidth={2} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-3 py-2.5">
          <div className="text-[13px] font-semibold text-text">
            {displayName}
          </div>
          <div className="mt-0.5 text-[12px] font-normal text-text-3">
            {profile.email}
          </div>
        </div>
        <DropdownMenuSeparator />
        {/* TODO Phase 1E-2: build /account UI */}
        <DropdownMenuItem
          render={<Link href="/account">Account settings</Link>}
        />
        {isAdmin && (
          <DropdownMenuItem
            render={<Link href="/admin">Admin dashboard</Link>}
          />
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
