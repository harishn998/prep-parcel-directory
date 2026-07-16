"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { ProfileRow } from "@/lib/data/db-types";
import { PrepParcelLogo } from "@/components/brand/prep-parcel-logo";
import { NavbarUserMenu } from "./navbar-user-menu";

const navLinks = [
  { label: "Directory", href: "/directory" },
  { label: "Categories", href: "/category" },
  { label: "Locations", href: "/location" },
];

export function NavbarClient({ profile }: { profile: ProfileRow | null }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full bg-navy backdrop-blur-sm",
        "transition-[border-color,box-shadow] duration-200",
        scrolled
          ? "border-b border-white/10"
          : "border-b border-transparent",
      ].join(" ")}
      style={{ height: 72 }}
    >
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6 md:px-8">
        <Link href="/" aria-label="Prep Parcel home" className="flex items-center">
          <PrepParcelLogo size="md" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[14px] font-medium text-white/80 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {profile ? (
            <NavbarUserMenu profile={profile} />
          ) : (
            <Link
              href="/login"
              className="hidden h-10 items-center rounded-md px-4 text-[14px] font-medium text-white/80 transition-colors duration-200 hover:bg-white/10 hover:text-white md:inline-flex"
            >
              Sign In
            </Link>
          )}
          <Button className="h-10 bg-blue px-4 text-[14px] font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-hover">
            List Your 3PL
          </Button>
        </div>
      </div>
    </header>
  );
}
