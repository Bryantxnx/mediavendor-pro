"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Camera,
  Video,
  Lightbulb,
  Mic,
  Monitor,
  Grip,
  Info,
  MessageCircle,
  FileText,
} from "lucide-react";

const rentalCategories = [
  "Cameras",
  "Lenses",
  "Lighting",
  "Audio",
  "Support",
  "Packages",
] as const;
type RentalCategory = (typeof rentalCategories)[number];

const categoryIcons: Record<RentalCategory, React.ElementType> = {
  Cameras: Camera,
  Lenses: Video,
  Lighting: Lightbulb,
  Audio: Mic,
  Support: Grip,
  Packages: Monitor,
};

interface PriceItem {
  name: string;
  category: RentalCategory;
  pricePerDay: number;
  pricePerWeek: number;
  specs: string[];
  popular?: boolean;
}

const priceItems: PriceItem[] = [
  // Cameras
  {
    name: "Sony A7S III",
    category: "Cameras",
    pricePerDay: 500000,
    pricePerWeek: 2800000,
    specs: ["4K 120fps", "Full Frame", "Dual Card Slots"],
  },
  {
    name: "Canon EOS R5",
    category: "Cameras",
    pricePerDay: 600000,
    pricePerWeek: 3400000,
    specs: ["8K RAW", "45MP", "IBIS"],
    popular: true,
  },
  {
    name: "RED Komodo 6K",
    category: "Cameras",
    pricePerDay: 1500000,
    pricePerWeek: 8500000,
    specs: ["6K Super 35", "R3D RAW", "Global Shutter"],
  },
  {
    name: "Blackmagic Pocket 6K Pro",
    category: "Cameras",
    pricePerDay: 450000,
    pricePerWeek: 2500000,
    specs: ["6K Super 35", "BRAW", "Built-in ND"],
  },
  {
    name: "Sony FX6",
    category: "Cameras",
    pricePerDay: 900000,
    pricePerWeek: 5000000,
    specs: ["4K 120fps", "Full Frame", "Dual Base ISO"],
    popular: true,
  },
  // Lenses
  {
    name: "Sony 24-70mm f/2.8 GM II",
    category: "Lenses",
    pricePerDay: 200000,
    pricePerWeek: 1100000,
    specs: ["E-Mount", "f/2.8", "Weather Sealed"],
  },
  {
    name: "Canon RF 70-200mm f/2.8",
    category: "Lenses",
    pricePerDay: 250000,
    pricePerWeek: 1400000,
    specs: ["RF Mount", "f/2.8", "IS"],
    popular: true,
  },
  {
    name: "Sigma 35mm f/1.4 Art",
    category: "Lenses",
    pricePerDay: 150000,
    pricePerWeek: 800000,
    specs: ["Multi-Mount", "f/1.4", "Art Series"],
  },
  {
    name: "Sony 85mm f/1.4 GM",
    category: "Lenses",
    pricePerDay: 200000,
    pricePerWeek: 1100000,
    specs: ["E-Mount", "f/1.4", "Nano AR II"],
  },
  // Lighting
  {
    name: "Aputure 600d Pro",
    category: "Lighting",
    pricePerDay: 350000,
    pricePerWeek: 2000000,
    specs: ["600W Daylight", "Bowens Mount", "App Control"],
    popular: true,
  },
  {
    name: "Nanlite Forza 300B",
    category: "Lighting",
    pricePerDay: 250000,
    pricePerWeek: 1400000,
    specs: ["300W Bi-Color", "Bowens Mount", "Bluetooth"],
  },
  {
    name: "Godox SL200 II",
    category: "Lighting",
    pricePerDay: 150000,
    pricePerWeek: 800000,
    specs: ["200W Daylight", "Bowens Mount", "Silent Fan"],
  },
  {
    name: "Aputure MC Pro (4-set)",
    category: "Lighting",
    pricePerDay: 300000,
    pricePerWeek: 1700000,
    specs: ["RGBWW", "Magnetic", "App Control"],
  },
  // Audio
  {
    name: "Rode Wireless PRO",
    category: "Audio",
    pricePerDay: 200000,
    pricePerWeek: 1100000,
    specs: ["Dual Channel", "32-bit Float", "2 Transmitters"],
    popular: true,
  },
  {
    name: "Sennheiser MKH 416",
    category: "Audio",
    pricePerDay: 150000,
    pricePerWeek: 800000,
    specs: ["Shotgun Mic", "Super-Cardioid", "Industry Standard"],
  },
  {
    name: "Zoom F6 Recorder",
    category: "Audio",
    pricePerDay: 200000,
    pricePerWeek: 1100000,
    specs: ["6-Channel", "32-bit Float", "Timecode"],
  },
  {
    name: "DPA 4060 Lav (pair)",
    category: "Audio",
    pricePerDay: 250000,
    pricePerWeek: 1400000,
    specs: ["Omnidirectional", "Low Noise", "Miniature"],
  },
  // Support
  {
    name: "DJI RS 3 Pro",
    category: "Support",
    pricePerDay: 300000,
    pricePerWeek: 1700000,
    specs: ["3-Axis Gimbal", "4.5kg Payload", "LiDAR Focus"],
    popular: true,
  },
  {
    name: "Sachtler Ace XL Tripod",
    category: "Support",
    pricePerDay: 100000,
    pricePerWeek: 550000,
    specs: ["Fluid Head", "75mm Bowl", "8kg Payload"],
  },
  {
    name: "DJI Mavic 3 Pro Drone",
    category: "Support",
    pricePerDay: 500000,
    pricePerWeek: 2800000,
    specs: ["Hasselblad Cam", "4/3 CMOS", "43min Flight"],
  },
  {
    name: "Slider 120cm Motorized",
    category: "Support",
    pricePerDay: 200000,
    pricePerWeek: 1100000,
    specs: ["Carbon Fiber", "App Control", "Time-Lapse"],
  },
  // Packages
  {
    name: "Basic Interview Kit",
    category: "Packages",
    pricePerDay: 1200000,
    pricePerWeek: 6500000,
    specs: ["1 Camera + Lens", "2 LED Lights", "1 Wireless Mic"],
  },
  {
    name: "Pro Video Package",
    category: "Packages",
    pricePerDay: 3500000,
    pricePerWeek: 18000000,
    specs: ["2 Cameras + Lenses", "3-Point Lighting", "Full Audio Kit"],
    popular: true,
  },
  {
    name: "Event Coverage Kit",
    category: "Packages",
    pricePerDay: 2500000,
    pricePerWeek: 13000000,
    specs: ["2 Cameras", "On-Camera Lights", "Wireless Audio"],
  },
  {
    name: "Cinema Package",
    category: "Packages",
    pricePerDay: 8000000,
    pricePerWeek: 42000000,
    specs: ["RED/ARRI Camera", "Cinema Lenses", "Full Grip & Electric"],
    popular: true,
  },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID").format(price);
}

function buildWhatsAppUrl(itemName: string, category: string): string {
  const text = encodeURIComponent(
    `Halo MediaVendor Pro, saya ingin sewa unit *${itemName}* (Kategori: ${category}). Apakah ready untuk tanggal...`
  );
  return `https://wa.me/6285122979535?text=${text}`;
}

function scrollToContactWithPrefill(itemName: string) {
  // Dispatch custom event that Contact component listens to
  window.dispatchEvent(
    new CustomEvent("prefill-contact", { detail: { item: itemName } })
  );
  // Scroll to contact
  const el = document.getElementById("contact");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Pricelist() {
  const [activeCategory, setActiveCategory] =
    useState<RentalCategory>("Cameras");

  // Listen for deep-link from Services component
  useEffect(() => {
    function onHashChange() {
      const hash = window.location.hash;
      if (hash.startsWith("#pricelist-")) {
        const tab = hash.replace("#pricelist-", "") as RentalCategory;
        if (rentalCategories.includes(tab)) {
          setActiveCategory(tab);
        }
      }
    }
    window.addEventListener("hashchange", onHashChange);
    // Also check on mount
    onHashChange();
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const filtered = priceItems.filter((item) => item.category === activeCategory);
  const Icon = categoryIcons[activeCategory];

  return (
    <section id="pricelist" className="scroll-mt-20 bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
            Transparent Pricing
          </p>
          <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Equipment &amp; Service Pricelist
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
            All prices are in IDR (Indonesian Rupiah). Weekly rental comes with
            a significant discount. Prices exclude delivery and operator fees.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {rentalCategories.map((cat) => {
            const CatIcon = categoryIcons[cat];
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  activeCategory === cat
                    ? "bg-accent text-accent-foreground shadow-md shadow-accent/20"
                    : "border border-border bg-card text-muted-foreground hover:border-accent/30 hover:text-foreground"
                )}
              >
                <CatIcon className="h-4 w-4" aria-hidden="true" />
                {cat}
              </button>
            );
          })}
        </div>

        {/* Price Table - Desktop */}
        <div className="hidden lg:block">
          <div className="overflow-hidden rounded-xl border border-border/50">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 border-b border-border/50 bg-muted/50 px-6 py-3.5">
              <div className="col-span-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Equipment
              </div>
              <div className="col-span-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Specifications
              </div>
              <div className="col-span-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Per Day
              </div>
              <div className="col-span-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Per Week
              </div>
              <div className="col-span-2" />
            </div>

            {/* Table Rows */}
            {filtered.map((item) => (
              <div
                key={item.name}
                className={cn(
                  "grid grid-cols-12 items-center gap-4 border-b border-border/30 px-6 py-4 transition-colors hover:bg-muted/30",
                  item.popular && "bg-accent/[0.03]"
                )}
              >
                {/* Name */}
                <div className="col-span-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {item.name}
                      </span>
                      {item.popular && (
                        <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-accent">
                          Popular
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Specs */}
                <div className="col-span-3 flex flex-wrap gap-1.5">
                  {item.specs.map((spec) => (
                    <span
                      key={spec}
                      className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Price Per Day */}
                <div className="col-span-2 text-right">
                  <span className="text-sm font-bold text-foreground">
                    Rp {formatPrice(item.pricePerDay)}
                  </span>
                  <span className="block text-[10px] text-muted-foreground">
                    /day
                  </span>
                </div>

                {/* Price Per Week */}
                <div className="col-span-2 text-right">
                  <span className="text-sm font-bold text-accent">
                    Rp {formatPrice(item.pricePerWeek)}
                  </span>
                  <span className="block text-[10px] text-muted-foreground">
                    /week
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <a
                    href={buildWhatsAppUrl(item.name, item.category)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600/90 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-500"
                    title="Book via WhatsApp"
                  >
                    <MessageCircle className="h-3 w-3" aria-hidden="true" />
                    Book
                  </a>
                  <button
                    type="button"
                    onClick={() => scrollToContactWithPrefill(item.name)}
                    className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-2.5 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/20 cursor-pointer"
                    title="Pesan via Form"
                  >
                    <FileText className="h-3 w-3" aria-hidden="true" />
                    Form
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Cards - Mobile & Tablet */}
        <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
          {filtered.map((item) => (
            <div
              key={item.name}
              className={cn(
                "relative overflow-hidden rounded-xl border border-border/50 bg-card p-5 transition-all hover:border-accent/30",
                item.popular && "border-accent/30 shadow-md shadow-accent/5"
              )}
            >
              {item.popular && (
                <span className="absolute right-3 top-3 rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-accent">
                  Popular
                </span>
              )}

              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  {item.name}
                </h3>
              </div>

              {/* Specs */}
              <div className="mb-4 flex flex-wrap gap-1.5">
                {item.specs.map((spec) => (
                  <span
                    key={spec}
                    className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Pricing */}
              <div className="mb-4 flex items-end justify-between rounded-lg bg-muted/50 px-4 py-3">
                <div>
                  <span className="block text-[10px] uppercase text-muted-foreground">
                    Per Day
                  </span>
                  <span className="text-base font-bold text-foreground">
                    Rp {formatPrice(item.pricePerDay)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] uppercase text-muted-foreground">
                    Per Week
                  </span>
                  <span className="text-base font-bold text-accent">
                    Rp {formatPrice(item.pricePerWeek)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <a
                  href={buildWhatsAppUrl(item.name, item.category)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-emerald-600/90 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-500"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  Book via WA
                </a>
                <button
                  type="button"
                  onClick={() => scrollToContactWithPrefill(item.name)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-md bg-accent/10 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent/20 cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  Via Form
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Note */}
        <div className="mt-8 flex items-start gap-3 rounded-lg border border-border/50 bg-card p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          <div className="text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Note:</strong> All prices are
            subject to availability. Deposit required for all rentals. Delivery
            and operator services available at additional cost. Contact us for
            custom packages and long-term rental discounts.
          </div>
        </div>
      </div>
    </section>
  );
}
