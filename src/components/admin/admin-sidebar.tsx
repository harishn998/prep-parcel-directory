"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  Users,
  Inbox,
  Settings,
  ChevronUp,
  ExternalLink,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProfileRow } from "@/lib/data/db-types";

interface NavItem {
  href: string;
  label: string;
  icon: typeof Home;
  exact?: boolean;
}

const SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: "Manage",
    items: [
      { href: "/admin", label: "Overview", icon: Home, exact: true },
      { href: "/admin/partners", label: "Partners", icon: Building2 },
      { href: "/admin/submissions", label: "Submissions", icon: Inbox },
      { href: "/admin/users", label: "Users", icon: Users },
    ],
  },
  {
    label: "Analytics",
    items: [],
  },
  {
    label: "System",
    items: [{ href: "/admin/settings", label: "Settings", icon: Settings }],
  },
];

function initialsFor(profile: ProfileRow): string {
  const source = profile.full_name?.trim() || profile.email;
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
}

async function onSignOut() {
  await fetch("/auth/signout", { method: "POST", credentials: "same-origin" });
  window.location.assign("/");
}

export function AdminSidebar({ profile }: { profile: ProfileRow }) {
  const pathname = usePathname();
  const initials = initialsFor(profile);
  const displayName = profile.full_name?.trim() || profile.email;

  function isActive(item: NavItem): boolean {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  return (
    <aside
      className="fixed left-0 top-0 z-40 hidden h-screen w-[240px] flex-col border-r border-white/5 bg-[#0c1e3e] md:flex"
      style={{ padding: "24px 16px" }}
    >
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="text-[16px] font-semibold tracking-tight text-white">
          Prep Parcel
        </div>
        <span
          className="rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-[#94a3b8]"
          style={{ letterSpacing: "0.08em" }}
        >
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto">
        {SECTIONS.map((section) => (
          <div key={section.label}>
            <div
              className="px-2 pb-2 pt-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[#94a3b8]"
              style={{ letterSpacing: "0.08em" }}
            >
              {section.label}
            </div>
            {section.items.length === 0 ? (
              <div className="px-2 py-1 text-[11px] text-white/30">
                Coming soon
              </div>
            ) : (
              <ul className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={[
                          "relative flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-medium transition-colors",
                          active
                            ? "bg-white/10 text-white"
                            : "text-white/75 hover:bg-white/[0.06] hover:text-white",
                        ].join(" ")}
                      >
                        {active && (
                          <span
                            aria-hidden
                            className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-blue"
                          />
                        )}
                        <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom profile card */}
      <div className="mt-4 border-t border-white/5 pt-4">
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Open profile menu"
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left outline-none transition-colors hover:bg-white/[0.06]"
          >
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt=""
                referrerPolicy="no-referrer"
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue text-[11px] font-semibold text-white">
                {initials}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] font-medium text-white">
                {displayName}
              </div>
              <div className="truncate text-[11px] text-white/50">
                {profile.email}
              </div>
            </div>
            <ChevronUp className="h-3.5 w-3.5 text-white/50" strokeWidth={2} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side="top"
            sideOffset={8}
            className="w-56"
          >
            <DropdownMenuItem
              render={
                <Link href="/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>View public site</span>
                </Link>
              }
            />
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut}>
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div
          className="mt-2 px-3 font-mono text-[11px] text-[#475569]"
          style={{ letterSpacing: "0.08em" }}
        >
          v0.1.0
        </div>
      </div>
    </aside>
  );
}
