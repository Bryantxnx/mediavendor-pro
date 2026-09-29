"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Camera,
  Video,
  Lightbulb,
  Mic,
  Monitor,
  Grip,
  Users,
  Calculator,
  MessageCircle,
  Trash2,
  Check,
  Tag,
  Plus,
  Minus,
  FileDown,
  ChevronUp,
  ShoppingCart,
  X,
  CreditCard,
  Loader2,
} from "lucide-react";
import {
  fadeUp,
  staggerContainer,
  staggerChild,
  buttonPress,
  viewportOnce,
} from "@/lib/motion";
import {
  priceItems as fallbackItems,
  rentalCategories,
  type RentalCategory,
  type PriceItem,
} from "@/data/pricelist";
import { generateInvoicePDF } from "@/lib/generate-invoice";
import { buildWaUrl } from "@/data/site-config";

/* ── Snap.js type declaration ── */
declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess?: (result: unknown) => void;
        onPending?: (result: unknown) => void;
        onError?: (result: unknown) => void;
        onClose?: () => void;
      }) => void;
    };
  }
}

/* ── Icon map ── */
const categoryIcons: Record<RentalCategory, React.ElementType> = {
  Kamera: Camera,
  Lensa: Video,
  Lighting: Lightbulb,
  Audio: Mic,
  Support: Grip,
  Kru: Users,
  Paket: Monitor,
};

/* ── Helpers ── */
function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID").format(price);
}

function buildWhatsAppUrl(
  selectedItems: PriceItem[],
  quantities: Map<string, number>,
  days: number,
  totalAfterDiscount: number,
  savings: number,
  discount: { pct: number; label: string }
): string {
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
    ...selectedItems.map((i, idx) => {
      const qty = quantities.get(i.name) ?? 1;
      const qtyLabel = qty > 1 ? ` (×${qty})` : "";
      return `${idx + 1}. ${i.name}${qtyLabel} — Rp ${formatPrice(i.pricePerDay * qty)}/hari`;
    }),
    "",
    `Durasi sewa: ${days} hari`,
    `Total estimasi: Rp ${formatPrice(totalAfterDiscount)} ${discountLine}`.trim(),
    ...(savings > 0 ? [`Hemat: Rp ${formatPrice(savings)}`] : []),
    "",
    "Detail kebutuhan:",
    "- Tanggal sewa: ",
    "- Lokasi: ",
  ];
  return buildWaUrl(lines.join("\n"));
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

/* ── Extracted Summary Content ──
 *  Dulunya function component di dalam PricelistCalculator — bikin re-render
 *  tiap parent update karena React bikin instance baru terus.
 *  Sekarang di luar, terima props, stabil.
 */
interface SummaryContentProps {
  selectedItems: PriceItem[];
  quantities: Map<string, number>;
  days: Duration;
  discount: { pct: number; label: string };
  totalAfterDiscount: number;
  savings: number;
  totalUnitCount: number;
  setDays: (d: Duration) => void;
  openCheckout: (mode: "midtrans" | "whatsapp") => void;
  handleInvoiceOnly: () => void;
  clearAll: () => void;
  isMobile?: boolean;
}

function SummaryContent({
  selectedItems,
  quantities,
  days,
  discount,
  totalAfterDiscount,
  savings,
  totalUnitCount,
  setDays,
  openCheckout,
  handleInvoiceOnly,
  clearAll,
  isMobile = false,
}: SummaryContentProps) {
  return (
    <>
      {/* Selected items list */}
      <ul
        className={cn(
          "space-y-2 overflow-y-auto",
          isMobile ? "max-h-40 mb-3" : "max-h-60 mb-4"
        )}
      >
        {selectedItems.map((item) => {
          const qty = quantities.get(item.name) ?? 1;
          return (
            <li
              key={item.name}
              className="flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs"
            >
              <span className="truncate font-medium text-foreground">
                {item.name}
                {qty > 1 && (
                  <span className="ml-1 text-accent font-bold">
                    ×{qty}
                  </span>
                )}
              </span>
              <span className="shrink-0 text-muted-foreground">
                Rp {formatPrice(item.pricePerDay * qty)}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Divider */}
      <div className="mb-3 h-px bg-border/50" />

      {/* Duration picker */}
      <div className="mb-3">
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
          <span className="text-xs text-emerald-400">Anda hemat</span>
          <span className="text-xs font-semibold text-emerald-400">
            − Rp {formatPrice(savings)}
          </span>
        </div>
      )}
      {days > 1 && (
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground/60">
            Rata-rata per hari
          </span>
          <span className="text-[10px] text-muted-foreground/60">
            Rp {formatPrice(Math.round(totalAfterDiscount / days))}/hari
          </span>
        </div>
      )}
      {days === 1 && <div className="mb-4" />}

      {/* Action buttons */}
      <div className="flex flex-col gap-2.5">
        <motion.button
          type="button"
          onClick={() => openCheckout("midtrans")}
          {...buttonPress}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-500 cursor-pointer"
        >
          <CreditCard className="h-4 w-4" aria-hidden="true" />
          Bayar Langsung
        </motion.button>

        <motion.button
          type="button"
          onClick={() => openCheckout("whatsapp")}
          {...buttonPress}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 cursor-pointer"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Pesan via WA ({totalUnitCount} unit)
        </motion.button>

        <button
          type="button"
          onClick={handleInvoiceOnly}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-accent/10 px-4 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent/20 cursor-pointer"
        >
          <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
          Download Invoice PDF
        </button>

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
  );
}

/* ══════════════════════════════════════════
 *  UNIFIED COMPONENT
 * ══════════════════════════════════════════ */
export default function PricelistCalculator() {
  const [products, setProducts] = useState<PriceItem[]>(fallbackItems);
  const [quantities, setQuantities] = useState<Map<string, number>>(new Map());
  const [activeCategory, setActiveCategory] =
    useState<RentalCategory>("Kamera");
  const [days, setDays] = useState<Duration>(1);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState<"midtrans" | "whatsapp">("whatsapp");
  const [customerName, setCustomerName] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  // Fetch products dari Supabase API, fallback ke file kalau gagal
  useEffect(() => {
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data: PriceItem[]) => {
        if (data && data.length > 0) setProducts(data);
      })
      .catch(() => {
        // Fallback ke data dari file — landing page tetep jalan
      });
  }, []);

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

  const filtered = products.filter((i) => i.category === activeCategory);

  function toggle(name: string) {
    setQuantities((prev) => {
      const next = new Map(prev);
      if (next.has(name)) next.delete(name);
      else next.set(name, 1);
      return next;
    });
  }

  function setQty(name: string, qty: number) {
    setQuantities((prev) => {
      const next = new Map(prev);
      if (qty <= 0) next.delete(name);
      else next.set(name, qty);
      return next;
    });
  }

  function clearAll() {
    setQuantities(new Map());
    setMobileSheetOpen(false);
  }

  /* Derived */
  const selectedItems = useMemo(
    () => products.filter((i) => quantities.has(i.name)),
    [quantities, products]
  );

  const totalUnitCount = useMemo(
    () => Array.from(quantities.values()).reduce((a, b) => a + b, 0),
    [quantities]
  );

  const totalDaily = useMemo(
    () =>
      selectedItems.reduce(
        (s, i) => s + i.pricePerDay * (quantities.get(i.name) ?? 1),
        0
      ),
    [selectedItems, quantities]
  );

  const discount = getDiscount(days);

  const totalBeforeDiscount = useMemo(() => {
    if (days >= 7)
      return selectedItems.reduce(
        (s, i) => s + i.pricePerWeek * (quantities.get(i.name) ?? 1),
        0
      );
    return totalDaily * days;
  }, [selectedItems, totalDaily, days, quantities]);

  const totalAfterDiscount = useMemo(() => {
    if (days >= 7) return totalBeforeDiscount;
    return Math.round(totalBeforeDiscount * (1 - discount.pct / 100));
  }, [totalBeforeDiscount, discount.pct, days]);

  const savings = totalBeforeDiscount - totalAfterDiscount;

  const waUrl = useMemo(
    () =>
      buildWhatsAppUrl(
        selectedItems,
        quantities,
        days,
        totalAfterDiscount,
        savings,
        discount
      ),
    [selectedItems, quantities, days, totalAfterDiscount, savings, discount]
  );

  // Open checkout modal — user picks payment method
  function openCheckout(mode: "midtrans" | "whatsapp") {
    setCheckoutMode(mode);
    setShowCheckoutModal(true);
  }

  // Submit order to API
  async function submitOrder() {
    if (!customerName.trim() || !customerWhatsapp.trim()) return;
    setIsSubmitting(true);

    try {
      const orderItems = selectedItems.map((i) => ({
        product_name: i.name,
        quantity: quantities.get(i.name) ?? 1,
        unit_price: days >= 7 ? i.pricePerWeek : i.pricePerDay,
        subtotal: (days >= 7 ? i.pricePerWeek : i.pricePerDay) * (quantities.get(i.name) ?? 1),
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: customerName,
            whatsapp: customerWhatsapp,
            email: customerEmail || undefined,
          },
          items: orderItems,
          rental_days: days,
          total_amount: totalAfterDiscount,
          discount_pct: discount.pct,
          payment_method: checkoutMode,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal membuat pesanan");

      if (checkoutMode === "midtrans" && result.snap_token) {
        // Generate invoice (belum lunas) and download
        await generateInvoicePDF({
          items: selectedItems.map((i) => ({ item: i, qty: quantities.get(i.name) ?? 1 })),
          days, totalBeforeDiscount, totalAfterDiscount,
          discountPct: discount.pct, discountLabel: discount.label,
          customerName: customerName || undefined,
          customerPhone: customerWhatsapp || undefined,
          customerEmail: customerEmail || undefined,
          orderNumber: result.order_number,
          isPaid: false,
        });
        // Open Midtrans Snap popup
        window.snap.pay(result.snap_token, {
          onSuccess: () => {
            setOrderSuccess(result.order_number);
            setShowCheckoutModal(false);
            clearAll();
          },
          onPending: () => {
            setOrderSuccess(result.order_number);
            setShowCheckoutModal(false);
          },
          onError: () => {
            alert("Pembayaran gagal. Silakan coba lagi.");
          },
          onClose: () => {
            // User closed popup without finishing
          },
        });
      } else {
        // WhatsApp path — download invoice + open WA
        await generateInvoicePDF({
          items: selectedItems.map((i) => ({ item: i, qty: quantities.get(i.name) ?? 1 })),
          days, totalBeforeDiscount, totalAfterDiscount,
          discountPct: discount.pct, discountLabel: discount.label,
          customerName: customerName || undefined,
          customerPhone: customerWhatsapp || undefined,
          customerEmail: customerEmail || undefined,
          orderNumber: result.order_number,
          isPaid: false,
        });
        window.open(waUrl, "_blank", "noopener,noreferrer");
        setOrderSuccess(result.order_number);
        setShowCheckoutModal(false);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleInvoiceOnly() {
    await generateInvoicePDF({
      items: selectedItems.map((i) => ({
        item: i,
        qty: quantities.get(i.name) ?? 1,
      })),
      days,
      totalBeforeDiscount,
      totalAfterDiscount,
      discountPct: discount.pct,
      discountLabel: discount.label,
    });
  }

  const Icon = categoryIcons[activeCategory];
  const hasSelection = selectedItems.length > 0;

  /* Props buat SummaryContent (extracted component di luar) */
  const summaryProps = {
    selectedItems,
    quantities,
    days,
    discount,
    totalAfterDiscount,
    savings,
    totalUnitCount,
    setDays,
    openCheckout,
    handleInvoiceOnly,
    clearAll,
  };

  return (
    <>
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
              Daftar Harga & Estimasi Sewa
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
              Pilih peralatan & kru yang Anda butuhkan, tentukan durasi sewa,
              lalu langsung kirim pesanan via WhatsApp beserta invoice PDF.
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {rentalCategories.map((cat) => {
              const CatIcon = categoryIcons[cat];
              const catSelected = products.filter(
                (i) => i.category === cat && quantities.has(i.name)
              ).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "relative inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    activeCategory === cat
                      ? "bg-accent text-accent-foreground shadow-md shadow-accent/20"
                      : "border border-border bg-card text-muted-foreground hover:border-accent/30 hover:text-foreground"
                  )}
                >
                  <CatIcon className="h-4 w-4" aria-hidden="true" />
                  {cat}
                  {catSelected > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
                      {catSelected}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Main Content: Items + Sidebar ── */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left: Item Cards */}
            <div className="lg:col-span-2">
              <motion.div
                className="grid gap-3 sm:grid-cols-2"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                key={activeCategory}
              >
                {filtered.map((item) => {
                  const isSelected = quantities.has(item.name);
                  const qty = quantities.get(item.name) ?? 0;
                  return (
                    <motion.div
                      key={item.name}
                      variants={staggerChild}
                      className={cn(
                        "group relative flex flex-col rounded-xl p-4 transition-all",
                        isSelected
                          ? "glass border border-accent/30 shadow-[0_0_20px_-6px_rgba(245,158,11,0.15)]"
                          : "glass glow-border"
                      )}
                    >
                      {/* Top: checkbox + name + popular */}
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggle(item.name)}
                          className="mt-0.5 cursor-pointer shrink-0"
                          aria-label={
                            isSelected
                              ? `Hapus ${item.name}`
                              : `Tambah ${item.name}`
                          }
                        >
                          <div
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded border transition-colors",
                              isSelected
                                ? "border-accent bg-accent text-accent-foreground"
                                : "border-border bg-muted"
                            )}
                          >
                            {isSelected && (
                              <Check
                                className="h-3 w-3"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                        </button>

                        <div
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => {
                            if (!isSelected) toggle(item.name);
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !isSelected)
                              toggle(item.name);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent/10">
                              <Icon
                                className="h-3.5 w-3.5 text-accent"
                                aria-hidden="true"
                              />
                            </div>
                            <span className="text-sm font-semibold text-foreground truncate">
                              {item.name}
                            </span>
                            {item.popular && (
                              <span className="shrink-0 rounded bg-accent/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-accent">
                                Populer
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Qty stepper */}
                        {isSelected && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setQty(item.name, qty - 1);
                              }}
                              className="flex h-7 w-7 items-center justify-center rounded-md bg-muted/80 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                              aria-label="Kurangi"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-bold text-foreground">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setQty(item.name, qty + 1);
                              }}
                              className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/20 text-accent transition-colors hover:bg-accent/30 cursor-pointer"
                              aria-label="Tambah"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Specs */}
                      <div className="mt-2.5 ml-8 flex flex-wrap gap-1.5">
                        {item.specs.map((spec) => (
                          <span
                            key={spec}
                            className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>

                      {/* Price row */}
                      <div className="mt-2.5 ml-8 flex items-center gap-4">
                        <span className="text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            Rp {formatPrice(item.pricePerDay)}
                          </span>
                          /hari
                        </span>
                        <span className="text-xs text-muted-foreground">
                          <span className="font-semibold text-accent">
                            Rp {formatPrice(item.pricePerWeek)}
                          </span>
                          /minggu
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* ── Right: Desktop Sticky Sidebar ── */}
            <div className="hidden lg:block lg:col-span-1">
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

                {!hasSelection ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Belum ada peralatan dipilih.
                    <br />
                    Centang alat di sebelah kiri untuk mulai.
                  </p>
                ) : (
                  <SummaryContent {...summaryProps} />
                )}

                <p className="mt-4 text-center text-[10px] text-muted-foreground">
                  {quantities.size} dari {products.length} peralatan dipilih
                </p>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="mt-8 flex items-start gap-3 rounded-lg glass p-4">
            <Tag
              className="mt-0.5 h-4 w-4 shrink-0 text-accent"
              aria-hidden="true"
            />
            <div className="text-xs leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Catatan:</strong> Semua harga
              tergantung ketersediaan. Deposit diperlukan untuk semua penyewaan.
              Sewa 3+ hari dapat diskon 5%, 5+ hari diskon 10%, 7 hari tarif
              mingguan spesial. Hubungi kami untuk paket khusus.
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
       *  MOBILE FLOATING BOTTOM BAR
       *  Only visible on < lg screens when items selected
       * ══════════════════════════════════════════ */}
      <AnimatePresence>
        {hasSelection && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
          >
            {/* Bottom Sheet (expanded) */}
            <AnimatePresence>
              {mobileSheetOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setMobileSheetOpen(false)}
                  />
                  {/* Sheet */}
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-card border-t border-border p-5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Calculator
                          className="h-5 w-5 text-accent"
                          aria-hidden="true"
                        />
                        <h3 className="font-heading text-lg font-semibold text-foreground">
                          Ringkasan
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMobileSheetOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label="Tutup"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <SummaryContent {...summaryProps} isMobile />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Collapsed bottom bar */}
            {!mobileSheetOpen && (
              <div className="border-t border-border bg-card/95 backdrop-blur-xl px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-3">
                  {/* Info tap area */}
                  <button
                    type="button"
                    onClick={() => setMobileSheetOpen(true)}
                    className="flex flex-1 items-center gap-3 cursor-pointer text-left"
                  >
                    <div className="relative">
                      <ShoppingCart
                        className="h-5 w-5 text-accent"
                        aria-hidden="true"
                      />
                      <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                        {totalUnitCount}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground truncate">
                        {quantities.size} item dipilih
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        Rp {formatPrice(totalAfterDiscount)}
                      </p>
                    </div>
                    <ChevronUp
                      className="h-4 w-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </button>

                  {/* Payment buttons */}
                  <motion.button
                    type="button"
                    onClick={() => openCheckout("midtrans")}
                    {...buttonPress}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-md bg-amber-600 px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-amber-500 cursor-pointer"
                  >
                    <CreditCard className="h-3.5 w-3.5" aria-hidden="true" />
                    Bayar
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => openCheckout("whatsapp")}
                    {...buttonPress}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-500 cursor-pointer"
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    WA
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
       *  CHECKOUT MODAL
       * ══════════════════════════════════════════ */}
      <AnimatePresence>
        {showCheckoutModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => !isSubmitting && setShowCheckoutModal(false)}
            />
            {/* Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md rounded-2xl bg-[#172230] border border-border p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {checkoutMode === "midtrans"
                      ? "Checkout \u2014 Bayar Langsung"
                      : "Checkout \u2014 Pesan via WhatsApp"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => !isSubmitting && setShowCheckoutModal(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                    aria-label="Tutup"
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  {/* Nama Lengkap */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Nama Lengkap <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nama lengkap Anda"
                      className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Nomor WhatsApp */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Nomor WhatsApp <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      value={customerWhatsapp}
                      onChange={(e) => setCustomerWhatsapp(e.target.value)}
                      placeholder="6281234567890"
                      className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Email — only for midtrans */}
                  {checkoutMode === "midtrans" && (
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        Email <span className="text-muted-foreground/50">(opsional)</span>
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="email@contoh.com"
                        className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        disabled={isSubmitting}
                      />
                    </div>
                  )}
                </div>

                {/* Order summary */}
                <div className="mt-5 rounded-lg bg-muted/30 px-4 py-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{totalUnitCount} unit &middot; {days} hari</span>
                    <span className="font-heading text-base font-bold text-foreground">
                      Rp {formatPrice(totalAfterDiscount)}
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutModal(false)}
                    disabled={isSubmitting}
                    className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={submitOrder}
                    disabled={isSubmitting || !customerName.trim() || !customerWhatsapp.trim()}
                    className={cn(
                      "flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                      checkoutMode === "midtrans"
                        ? "bg-amber-600 hover:bg-amber-500"
                        : "bg-emerald-600 hover:bg-emerald-500"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Memproses...
                      </>
                    ) : checkoutMode === "midtrans" ? (
                      <>
                        <CreditCard className="h-4 w-4" aria-hidden="true" />
                        Bayar Sekarang
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        Kirim ke WhatsApp
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
       *  SUCCESS MODAL
       * ══════════════════════════════════════════ */}
      <AnimatePresence>
        {orderSuccess && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => setOrderSuccess(null)}
            />
            {/* Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-sm rounded-2xl bg-[#172230] border border-border p-6 shadow-2xl text-center">
                {/* Green checkmark */}
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                  <Check className="h-8 w-8 text-emerald-400" aria-hidden="true" />
                </div>

                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  Pesanan Berhasil!
                </h3>

                <p className="text-sm text-muted-foreground mb-1">
                  Nomor pesanan Anda:
                </p>
                <p className="font-heading text-lg font-bold text-accent mb-4">
                  {orderSuccess}
                </p>

                <p className="text-xs leading-relaxed text-muted-foreground mb-6">
                  {checkoutMode === "midtrans"
                    ? "Pembayaran berhasil! Invoice akan dikirim via WhatsApp."
                    : "Pesanan sudah dikirim via WhatsApp. Silakan selesaikan pembayaran sesuai instruksi admin."}
                </p>

                <button
                  type="button"
                  onClick={() => setOrderSuccess(null)}
                  className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
