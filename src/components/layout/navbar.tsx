"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

const navLinks = [
  { label: "Directory", href: "/directory" },
  { label: "Categories", href: "/category" },
  { label: "Locations", href: "/location" },
  { label: "Compare", href: "#" },
  { label: "Blog", href: "#" },
];

export function Navbar() {
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
        "sticky top-0 z-50 w-full bg-surface/95 backdrop-blur-sm",
        "transition-[border-color,box-shadow] duration-200",
        scrolled
          ? "border-b border-border-soft"
          : "border-b border-transparent",
      ].join(" ")}
      style={{ height: 72 }}
    >
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-navy"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-navy text-white">
            <Package className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="text-[15px] tracking-tight">Prep Parcel</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[14px] font-medium text-text-2 transition-colors duration-200 hover:text-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="hidden h-10 px-4 text-[14px] font-medium text-text-2 hover:bg-secondary hover:text-navy md:inline-flex"
          >
            Sign In
          </Button>
          <Button className="h-10 bg-blue px-4 text-[14px] font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-hover">
            List Your 3PL
          </Button>
        </div>
      </div>
    </header>
  );
}
