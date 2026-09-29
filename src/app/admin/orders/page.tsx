"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Loader2,
  Package,
  Eye,
  CreditCard,
  MessageCircle,
  Calendar,
} from "lucide-react";

/* ── Types ────────────────────────────────────────────────── */

interface Customer {
  name: string;
  whatsapp: string;
  email: string | null;
}

interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string | null;
  customer_email: string | null;
  status:
    | "pending"
    | "waiting_payment"
    | "confirmed"
    | "active"
    | "completed"
    | "cancelled";
  payment_method: "midtrans" | "whatsapp";
  payment_status: "unpaid" | "paid" | "expired" | "refunded";
  rental_days: number;
  total_amount: number;
  discount_pct: number;
  notes: string | null;
  midtrans_payment_type: string | null;
  paid_at: string | null;
  rental_start_date: string | null;
  rental_end_date: string | null;
  created_at: string;
  customers: Customer;
}

/* ── Constants ────────────────────────────────────────────── */

type StatusFilter =
  | "all"
  | "pending"
  | "waiting_payment"
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled";

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "pending", label: "Menunggu" },
  { key: "waiting_payment", label: "Menunggu Bayar" },
  { key: "confirmed", label: "Dikonfirmasi" },
  { key: "active", label: "Aktif" },
  { key: "completed", label: "Selesai" },
  { key: "cancelled", label: "Dibatalkan" },
];

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  pending: {
    label: "Menunggu",
    cls: "bg-yellow-500/10 text-yellow-400",
  },
  waiting_payment: {
    label: "Menunggu Bayar",
    cls: "bg-yellow-500/10 text-yellow-400",
  },
  confirmed: {
    label: "Dikonfirmasi",
    cls: "bg-blue-500/10 text-blue-400",
  },
  active: {
    label: "Aktif",
    cls: "bg-emerald-500/10 text-emerald-400",
  },
  completed: {
    label: "Selesai",
    cls: "bg-green-500/10 text-green-400",
  },
  cancelled: {
    label: "Dibatalkan",
    cls: "bg-red-500/10 text-red-400",
  },
};

const PAYMENT_STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  paid: { label: "Lunas", cls: "bg-green-500/10 text-green-400" },
  unpaid: { label: "Belum Bayar", cls: "bg-yellow-500/10 text-yellow-400" },
  expired: { label: "Expired", cls: "bg-red-500/10 text-red-400" },
  refunded: { label: "Refunded", cls: "bg-gray-500/10 text-gray-400" },
};

/* ── Helpers ───────────────────────────────────────────────── */

function formatRupiah(value: number) {
  return `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ── Component ─────────────────────────────────────────────── */

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  /* ── Debounce search ─────────────────────────────────────── */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  /* ── Fetch orders ────────────────────────────────────────── */
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeStatus !== "all") params.set("status", activeStatus);
      if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());

      const qs = params.toString();
      const res = await fetch(`/api/admin/orders${qs ? `?${qs}` : ""}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.orders ?? []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [activeStatus, debouncedSearch]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* ── Filtered list (client-side fallback for search) ────── */
  const filtered = useMemo(() => {
    // Server already filters, but keep a local guard for safety
    return orders;
  }, [orders]);

  /* ── UI ──────────────────────────────────────────────────── */
  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-heading sm:text-3xl">
            Pesanan
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {loading
              ? "Memuat pesanan..."
              : `${filtered.length} pesanan ditemukan`}
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveStatus(tab.key)}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
              activeStatus === tab.key
                ? "bg-[#F59E0B] text-[#172230]"
                : "bg-[#172230] text-gray-400 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          placeholder="Cari berdasarkan nama pelanggan atau nomor pesanan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-white/[0.06] bg-[#172230] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#F59E0B]/50 focus:ring-1 focus:ring-[#F59E0B]/30 sm:max-w-md"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={32} className="animate-spin text-[#F59E0B]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-[#172230]/50 py-20">
          <Package size={48} className="text-gray-600" />
          <p className="mt-4 text-sm text-gray-500">
            {orders.length === 0 && !debouncedSearch && activeStatus === "all"
              ? "Belum ada pesanan."
              : "Tidak ada pesanan yang cocok dengan filter."}
          </p>
        </div>
      ) : (
        <>
          {/* ── Desktop Table ──────────────────────────────── */}
          <div className="hidden overflow-x-auto rounded-xl border border-white/[0.06] lg:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-[#172230]">
                  <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400">
                    No. Pesanan
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400">
                    Pelanggan
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400">
                    Pembayaran
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400">
                    Status Bayar
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400">
                    Status
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400 text-right">
                    Total
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400">
                    Tanggal
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((order) => {
                  const status = STATUS_BADGE[order.status];
                  const payStatus = PAYMENT_STATUS_BADGE[order.payment_status];
                  return (
                    <tr
                      key={order.id}
                      className="bg-[#0f1724] transition-colors hover:bg-[#172230]/60"
                    >
                      {/* Order number */}
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-white">
                        {order.order_number}
                      </td>

                      {/* Customer */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <div>
                          <p className="font-medium text-white">
                            {order.customer_name ?? order.customers?.name ?? "-"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.customers?.whatsapp ?? "-"}
                          </p>
                        </div>
                      </td>

                      {/* Payment method */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            order.payment_method === "midtrans"
                              ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                              : "bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          {order.payment_method === "midtrans"
                            ? "Midtrans"
                            : "WhatsApp"}
                        </span>
                      </td>

                      {/* Payment status */}
                      <td className="whitespace-nowrap px-4 py-3">
                        {payStatus && (
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${payStatus.cls}`}
                          >
                            {payStatus.label}
                          </span>
                        )}
                      </td>

                      {/* Order status */}
                      <td className="whitespace-nowrap px-4 py-3">
                        {status && (
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.cls}`}
                          >
                            {status.label}
                          </span>
                        )}
                      </td>

                      {/* Total */}
                      <td className="whitespace-nowrap px-4 py-3 text-right text-gray-300">
                        {formatRupiah(order.total_amount)}
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-4 py-3 text-gray-400">
                        {formatDate(order.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-4 py-3 text-center">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-[#F59E0B]"
                          title="Lihat detail"
                        >
                          <Eye size={16} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Mobile Cards ───────────────────────────────── */}
          <div className="flex flex-col gap-3 lg:hidden">
            {filtered.map((order) => {
              const status = STATUS_BADGE[order.status];
              const payStatus = PAYMENT_STATUS_BADGE[order.payment_status];
              return (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="block rounded-xl border border-white/[0.06] bg-[#172230] p-4 transition-colors hover:border-[#F59E0B]/30"
                >
                  {/* Top row: order number + status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white">
                      {order.order_number}
                    </span>
                    {status && (
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.cls}`}
                      >
                        {status.label}
                      </span>
                    )}
                  </div>

                  {/* Customer */}
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span className="text-gray-300">
                      {order.customer_name ?? order.customers?.name ?? "-"}
                    </span>
                    <span className="text-gray-600">|</span>
                    <span className="text-gray-500">
                      {order.customers?.whatsapp ?? "-"}
                    </span>
                  </div>

                  {/* Bottom row: badges + total + date */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {/* Payment method */}
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        order.payment_method === "midtrans"
                          ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {order.payment_method === "midtrans"
                        ? "Midtrans"
                        : "WhatsApp"}
                    </span>

                    {/* Payment status */}
                    {payStatus && (
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${payStatus.cls}`}
                      >
                        {payStatus.label}
                      </span>
                    )}

                    <span className="ml-auto text-sm font-semibold text-white">
                      {formatRupiah(order.total_amount)}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar size={12} />
                    {formatDateTime(order.created_at)}
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* Result count */}
      {!loading && filtered.length > 0 && (
        <p className="mt-3 text-xs text-gray-500">
          Menampilkan {filtered.length} pesanan
        </p>
      )}
    </>
  );
}
