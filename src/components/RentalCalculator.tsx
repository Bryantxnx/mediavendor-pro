"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Calculator, MessageCircle, Trash2, Check, Tag } from "lucide-react";
import {
  fadeUp,
  staggerContainer,
  staggerChild,
  buttonPress,
  viewportOnce,
} from "@/lib/motion";
import {
  priceItems,
  rentalCategories,
  type RentalCategory,
  type PriceItem,
} from "@/data/pricelist";

/* ── Helpers ── */
function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID").format(price);
}

/* ── Duration options & discount tiers ── */
const DURATION_OPTIONS = [1, 2, 3, 5, 7] as const;
type Duration = (typeof DURATION_OPTIONS)[number];

function getDiscount(days: Duration): { pct: number; label: string } {
  if (days >= 7) return { pct: 0, label: "Tarif mingguan" };
  if (days >= 5) return { pct: 10, label: "Diskon 10%" };
  if (days >= 3) return { pct: 5, label: "Diskon 5%" };
  return { pct: 0, label: "" };
}

export default function RentalCalculator() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] =
    useState<RentalCategory>("Kamera");
  const [days, setDays] = useState<Duration>(1);

  const filtered = priceItems.filter((i) => i.category === activeCategory);

  function toggle(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function clearAll() {
    setSelected(new Set());
  }

  /* Derived values */
  const selectedItems = useMemo(
    () => priceItems.filter((i) => selected.has(i.name)),
    [selected]
  );

  const totalDaily = useMemo(
    () => selectedItems.reduce((s, i) => s + i.pricePerDay, 0),
    [selectedItems]
  );

  /* Duration-aware totals */
  const discount = getDiscount(days);

  const totalBeforeDiscount = useMemo(() => {
    if (days >= 7)
      return selectedItems.reduce((s, i) => s + i.pricePerWeek, 0);
    return totalDaily * days;
  }, [selectedItems, totalDaily, days]);

  const totalAfterDiscount = useMemo(() => {
    if (days >= 7) return totalBeforeDiscount; // weekly rate already discounted
    return Math.round(totalBeforeDiscount * (1 - discount.pct / 100));
  }, [totalBeforeDiscount, discount.pct, days]);

  const savings = totalBeforeDiscount - totalAfterDiscount;

  /* WhatsApp deep-link */
  const waUrl = useMemo(() => {
    if (selectedItems.length === 0) return "#";
    const discountLine =
      discount.pct > 0
        ? `(${discount.label})`
        : days >= 7
          ? "(tarif mingguan)"
          : "";
    const lines = [
      "Halo MediaVendor Pro, saya ingin sewa peralatan berikut:",
      "",
      ...selectedItems.map(
        (i, idx) =>
          `${idx + 1}. ${i.name} — Rp ${formatPrice(i.pricePerDay)}/hari`
      ),
      "",
      `Durasi sewa: ${days} hari`,
      `Total estimasi: Rp ${formatPrice(totalAfterDiscount)} ${discountLine}`.trim(),
      ...(savings > 0
        ? [`Hemat: Rp ${formatPrice(savings)}`]
        : []),
      "",
      "Detail kebutuhan:",
      "- Tanggal sewa: ",
      "- Lokasi: ",
    ];
    return `https://wa.me/6285122979535?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [selectedItems, totalAfterDiscount, savings, days, discount]);

  return (
    <section
      id="kalkulator"
      className="scroll-mt-20 bg-background py-24"
    >
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
            Estimasi Biaya
          </p>
          <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Kalkulator Sewa
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
            Centang peralatan yang Anda butuhkan, lihat estimasi total, lalu
            langsung kirim daftar pesanan via WhatsApp.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* ── Left: Item picker ── */}
          <div className="lg:col-span-2">
            {/* Category tabs */}
            <div className="mb-6 flex flex-wrap gap-2">
              {rentalCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "relative rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    activeCategory === cat
                      ? "bg-accent text-accent-foreground"
                      : "glass text-muted-foreground hover:text-foreground"
                  )}
                >
                  {cat}
                  {/* Count badge */}
                  {priceItems.filter(
                    (i) => i.category === cat && selected.has(i.name)
                  ).length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                      {
                        priceItems.filter(
                          (i) => i.category === cat && selected.has(i.name)
                        ).length
                      }
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Item list */}
            <motion.div
              className="grid gap-3 sm:grid-cols-2"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              key={activeCategory}
            >
              {filtered.map((item) => {
                const isSelected = selected.has(item.name);
                return (
                  <motion.button
                    key={item.name}
                    type="button"
                    onClick={() => toggle(item.name)}
                    variants={staggerChild}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "group relative flex items-start gap-3 rounded-xl p-4 text-left transition-all cursor-pointer",
                      isSelected
                        ? "glass border border-accent/30 shadow-[0_0_20px_-6px_rgba(245,158,11,0.15)]"
                        : "glass glow-border"
                    )}
                  >
                    {/* Checkbox */}
                    <div
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                        isSelected
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border bg-muted"
                      )}
                    >
                      {isSelected && (
                        <Check className="h-3 w-3" aria-hidden="true" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground truncate">
                          {item.name}
                        </span>
                        {item.popular && (
                          <span className="shrink-0 rounded bg-accent/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-accent">
                            Populer
                          </span>
                        )}
                      </div>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        Rp {formatPrice(item.pricePerDay)}/hari
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          {/* ── Right: Summary panel ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl glass p-6">
              <div className="mb-4 flex items-center gap-2">
                <Calculator
                  className="h-5 w-5 text-accent"
                  aria-hidden="true"
                />
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  Ringkasan
                </h3>
              </div>

              {selectedItems.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Belum ada peralatan dipilih.
                  <br />
                  Centang alat di sebelah kiri untuk mulai.
                </p>
              ) : (
                <>
                  {/* Selected items list */}
                  <ul className="mb-4 max-h-60 space-y-2 overflow-y-auto">
                    {selectedItems.map((item) => (
                      <li
                        key={item.name}
                        className="flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs"
                      >
                        <span className="truncate font-medium text-foreground">
                          {item.name}
                        </span>
                        <span className="shrink-0 text-muted-foreground">
                          Rp {formatPrice(item.pricePerDay)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Divider */}
                  <div className="mb-4 h-px bg-border/50" />

                  {/* Duration picker */}
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      Durasi Sewa
                    </p>
                    <div className="flex gap-1.5">
                      {DURATION_OPTIONS.map((d) => {
                        const disc = getDiscount(d);
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setDays(d)}
                            className={cn(
                              "relative flex-1 rounded-md py-2 text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                              days === d
                                ? "bg-accent text-accent-foreground"
                                : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                          >
                            {d}h
                            {disc.pct > 0 && (
                              <span className="absolute -right-0.5 -top-1.5 rounded bg-emerald-500/90 px-1 text-[8px] font-bold text-white">
                                -{disc.pct}%
                              </span>
                            )}
                            {d >= 7 && (
                              <span className="absolute -right-0.5 -top-1.5 rounded bg-emerald-500/90 px-1 text-[8px] font-bold text-white">
                                Best
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {days === 1 ? "Per Hari" : `${days} Hari`}
                      {discount.pct > 0 && (
                        <span className="ml-1.5 inline-flex items-center gap-0.5 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">
                          <Tag className="h-2.5 w-2.5" aria-hidden="true" />
                          {discount.label}
                        </span>
                      )}
                      {days >= 7 && discount.pct === 0 && (
                        <span className="ml-1.5 inline-flex items-center gap-0.5 rounded bg-accent/20 px-1.5 py-0.5 text-[9px] font-bold text-accent">
                          <Tag className="h-2.5 w-2.5" aria-hidden="true" />
                          Tarif mingguan
                        </span>
                      )}
                    </span>
                    <span className="font-heading text-lg font-bold text-foreground">
                      Rp {formatPrice(totalAfterDiscount)}
                    </span>
                  </div>
                  {savings > 0 && (
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-emerald-400">
                        Anda hemat
                      </span>
                      <span className="text-xs font-semibold text-emerald-400">
                        − Rp {formatPrice(savings)}
                      </span>
                    </div>
                  )}
                  {days > 1 && (
                    <div className="mb-6 flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground/60">
                        Rata-rata per hari
                      </span>
                      <span className="text-[10px] text-muted-foreground/60">
                        Rp {formatPrice(Math.round(totalAfterDiscount / days))}/hari
                      </span>
                    </div>
                  )}
                  {days === 1 && <div className="mb-6" />}

                  {/* Action buttons */}
                  <div className="flex flex-col gap-3">
                    <motion.a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      {...buttonPress}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
                    >
                      <MessageCircle
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                      Kirim via WhatsApp ({selectedItems.length} item)
                    </motion.a>
                    <button
                      type="button"
                      onClick={clearAll}
                      className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" aria-hidden="true" />
                      Hapus Semua
                    </button>
                  </div>
                </>
              )}

              {/* Item count */}
              <p className="mt-4 text-center text-[10px] text-muted-foreground">
                {selected.size} dari {priceItems.length} peralatan dipilih
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
