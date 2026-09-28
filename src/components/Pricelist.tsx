"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import {
  fadeUp,
  staggerContainer,
  staggerChild,
  viewportOnce,
} from "@/lib/motion";
import {
  rentalCategories,
  priceItems,
  categoryToServiceValue,
  type RentalCategory,
} from "@/data/pricelist";

/* ── Icon map ── */
const categoryIcons: Record<RentalCategory, React.ElementType> = {
  Kamera: Camera,
  Lensa: Video,
  Lighting: Lightbulb,
  Audio: Mic,
  Support: Grip,
  Paket: Monitor,
};

/* ── Helpers ── */
function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID").format(price);
}

function buildWhatsAppUrl(itemName: string, category: string): string {
  const text = encodeURIComponent(
    `Halo MediaVendor Pro, saya ingin sewa unit *${itemName}* (Kategori: ${category}). Apakah ready untuk tanggal...`
  );
  return `https://wa.me/6285122979535?text=${text}`;
}

function scrollToContactWithPrefill(
  itemName: string,
  category: RentalCategory
) {
  const serviceValue = categoryToServiceValue[category];
  window.dispatchEvent(
    new CustomEvent("prefill-contact", {
      detail: { item: itemName, service: serviceValue },
    })
  );
  const el = document.getElementById("contact");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

/* ── Component ── */
export default function Pricelist() {
  const [activeCategory, setActiveCategory] =
    useState<RentalCategory>("Kamera");

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
    onHashChange();
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const filtered = priceItems.filter(
    (item) => item.category === activeCategory
  );
  const Icon = categoryIcons[activeCategory];

  return (
    <section id="pricelist" className="scroll-mt-20 bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="mb-12 text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
            Harga Transparan
          </p>
          <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Daftar Harga Peralatan &amp; Layanan
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
            Semua harga dalam IDR (Rupiah). Sewa mingguan mendapat diskon
            signifikan. Harga belum termasuk biaya pengiriman dan operator.
          </p>
        </motion.div>

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

        {/* ── Price Table — Desktop ── */}
        <div className="hidden lg:block">
          <div className="overflow-hidden rounded-xl border border-border/50">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 border-b border-border/50 bg-muted/50 px-6 py-3.5">
              <div className="col-span-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Peralatan
              </div>
              <div className="col-span-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Spesifikasi
              </div>
              <div className="col-span-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Harian
              </div>
              <div className="col-span-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Mingguan
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
                    <Icon
                      className="h-5 w-5 text-accent"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {item.name}
                      </span>
                      {item.popular && (
                        <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-accent">
                          Populer
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
                    /hari
                  </span>
                </div>

                {/* Price Per Week */}
                <div className="col-span-2 text-right">
                  <span className="text-sm font-bold text-accent">
                    Rp {formatPrice(item.pricePerWeek)}
                  </span>
                  <span className="block text-[10px] text-muted-foreground">
                    /minggu
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <a
                    href={buildWhatsAppUrl(item.name, item.category)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600/90 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-500"
                    title="Sewa via WhatsApp"
                  >
                    <MessageCircle
                      className="h-3 w-3"
                      aria-hidden="true"
                    />
                    Sewa via WA
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      scrollToContactWithPrefill(item.name, item.category)
                    }
                    className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-2.5 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/20 cursor-pointer"
                    title="Pesan via Form"
                  >
                    <FileText className="h-3 w-3" aria-hidden="true" />
                    Pesan via Form
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Price Cards — Mobile & Tablet ── */}
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:hidden"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          key={activeCategory}
        >
          {filtered.map((item) => (
            <motion.div
              key={item.name}
              variants={staggerChild}
              className={cn(
                "relative overflow-hidden rounded-xl border border-border/50 bg-card p-5 transition-colors hover:border-accent/30",
                item.popular &&
                  "border-accent/30 shadow-md shadow-accent/5"
              )}
            >
              {item.popular && (
                <span className="absolute right-3 top-3 rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-accent">
                  Populer
                </span>
              )}

              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Icon
                    className="h-5 w-5 text-accent"
                    aria-hidden="true"
                  />
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
                    Harian
                  </span>
                  <span className="text-base font-bold text-foreground">
                    Rp {formatPrice(item.pricePerDay)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] uppercase text-muted-foreground">
                    Mingguan
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
                  <MessageCircle
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                  Sewa via WA
                </a>
                <button
                  type="button"
                  onClick={() =>
                    scrollToContactWithPrefill(item.name, item.category)
                  }
                  className="flex flex-1 items-center justify-center gap-1 rounded-md bg-accent/10 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent/20 cursor-pointer"
                >
                  <FileText
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                  Pesan via Form
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Note */}
        <div className="mt-8 flex items-start gap-3 rounded-lg border border-border/50 bg-card p-4">
          <Info
            className="mt-0.5 h-4 w-4 shrink-0 text-accent"
            aria-hidden="true"
          />
          <div className="text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Catatan:</strong> Semua
            harga tergantung ketersediaan. Deposit diperlukan untuk semua
            penyewaan. Layanan pengiriman dan operator tersedia dengan biaya
            tambahan. Hubungi kami untuk paket khusus dan diskon sewa
            jangka panjang.
          </div>
        </div>
      </div>
    </section>
  );
}
