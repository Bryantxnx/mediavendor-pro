"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
} from "lucide-react";

const SITE_URL = "https://mediavendor-pro.vercel.app";

const navLinks = [
  { label: "Beranda", href: `${SITE_URL}/#home` },
  { label: "Layanan", href: `${SITE_URL}/#services` },
  { label: "Portofolio", href: `${SITE_URL}/#portfolio` },
  { label: "Daftar Harga", href: `${SITE_URL}/#pricelist` },
  { label: "Kontak", href: `${SITE_URL}/#contact` },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-background/70 backdrop-blur-2xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a
          href={`${SITE_URL}/#home`}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-emblem.svg"
            alt=""
            className="h-9 w-9 sm:h-10 sm:w-10"
            aria-hidden="true"
          />
          <div className="flex flex-col leading-none">
            <span className="font-heading text-base font-bold tracking-tight text-foreground sm:text-lg">
              Media<span className="bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent">Vendor</span>
            </span>
            <span className="text-[9px] font-bold tracking-[0.2em] text-amber-500/80 uppercase sm:text-[10px]">
              PRO
            </span>
          </div>
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
          "overflow-hidden border-t border-white/[0.06] bg-background/90 backdrop-blur-2xl transition-all duration-300 ease-out md:hidden",
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
