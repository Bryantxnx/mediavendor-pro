"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  Camera,
} from "lucide-react";

const SITE_URL = "https://mediavendor-pro.vercel.app";

const navLinks = [
  { label: "Home", href: `${SITE_URL}/#home` },
  { label: "Services", href: `${SITE_URL}/#services` },
  { label: "Portfolio", href: `${SITE_URL}/#portfolio` },
  { label: "Pricelist", href: `${SITE_URL}/#pricelist` },
  { label: "Contact", href: `${SITE_URL}/#contact` },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a
          href={`${SITE_URL}/#home`}
          className="flex items-center gap-2 text-foreground transition-colors hover:text-accent"
        >
          <Camera className="h-6 w-6 text-accent" aria-hidden="true" />
          <span className="font-heading text-lg font-bold tracking-tight">
            MediaVendor<span className="text-accent">Pro</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA Desktop */}
        <a
          href={`${SITE_URL}/#pricelist`}
          className="hidden rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:inline-flex"
        >
          Minta Penawaran
        </a>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl transition-all duration-300 ease-out md:hidden",
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <ul className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={`${SITE_URL}/#pricelist`}
              className="mt-2 block rounded-md bg-accent px-3 py-2.5 text-center text-sm font-semibold text-accent-foreground transition-all hover:brightness-110"
              onClick={() => setOpen(false)}
            >
              Minta Penawaran
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
