"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Save,
  User,
  CreditCard,
  MessageCircle,
  Calendar,
  Package,
  FileText,
  Hash,
  CheckCircle,
  Download,
} from "lucide-react";
import { generateInvoicePDF } from "@/lib/generate-invoice";

/* ── Types ────────────────────────────────────────────────── */

interface Customer {
  id: string;
  name: string;
  whatsapp: string;
  email: string | null;
  phone: string | null;
  company: string | null;
}

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
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
  order_items: OrderItem[];
}

/* ── Constants ────────────────────────────────────────────── */

const ALL_STATUSES = [
  { value: "pending", label: "Menunggu" },
  { value: "waiting_payment", label: "Menunggu Bayar" },
  { value: "confirmed", label: "Dikonfirmasi" },
  { value: "active", label: "Aktif" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
] as const;

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  pending: { label: "Menunggu", cls: "bg-yellow-500/10 text-yellow-400" },
  waiting_payment: {
    label: "Menunggu Bayar",
    cls: "bg-yellow-500/10 text-yellow-400",
  },
  confirmed: { label: "Dikonfirmasi", cls: "bg-blue-500/10 text-blue-400" },
  active: { label: "Aktif", cls: "bg-emerald-500/10 text-emerald-400" },
  completed: { label: "Selesai", cls: "bg-green-500/10 text-green-400" },
  cancelled: { label: "Dibatalkan", cls: "bg-red-500/10 text-red-400" },
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

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ── Component ─────────────────────────────────────────────── */

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  /* ── Editable fields ─────────────────────────────────────── */
  const [status, setStatus] = useState("");
  const [rentalStart, setRentalStart] = useState("");
  const [rentalEnd, setRentalEnd] = useState("");
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  /* ── Fetch order ─────────────────────────────────────────── */
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/admin/orders/${id}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data: Order = await res.json();
        setOrder(data);
        setStatus(data.status);
        setRentalStart(data.rental_start_date ?? "");
        setRentalEnd(data.rental_end_date ?? "");
        setNotes(data.notes ?? "");
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  /* ── Save handler ────────────────────────────────────────── */
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        status,
        notes: notes.trim() || null,
        rental_start_date: rentalStart || null,
        rental_end_date: rentalEnd || null,
      };

      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();

      // Refresh local state with returned data
      setOrder((prev) => (prev ? { ...prev, ...updated } : prev));
      setToast({ message: "Pesanan berhasil diperbarui", type: "success" });
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast({
        message: "Gagal menyimpan perubahan. Silakan coba lagi.",
        type: "error",
      });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  /* ── Mark as Paid handler ───────────────────────────────── */
  const handleMarkPaid = async () => {
    setMarkingPaid(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_status: "paid",
          status: "confirmed",
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      setOrder((prev) => (prev ? { ...prev, ...updated, payment_status: "paid", status: "confirmed" } : prev));
      setStatus("confirmed");
      setToast({ message: "Pesanan ditandai LUNAS!", type: "success" });
      setTimeout(() => setToast(null), 3000);

      // Auto-download invoice lunas
      await downloadInvoicePDF(true);
    } catch {
      setToast({
        message: "Gagal mengupdate status pembayaran.",
        type: "error",
      });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setMarkingPaid(false);
    }
  };

  /* ── Download Invoice PDF handler ───────────────────────── */
  const downloadInvoicePDF = async (isPaid?: boolean) => {
    if (!order) return;
    setDownloadingInvoice(true);
    try {
      await generateInvoicePDF({
        items: items.map((it) => ({
          item: {
            name: it.product_name,
            category: "Kamera",
            pricePerDay: it.unit_price,
            pricePerWeek: it.unit_price,
            specs: [],
          },
          qty: it.quantity,
        })),
        days: order.rental_days,
        totalBeforeDiscount: subtotal,
        totalAfterDiscount: order.total_amount,
        discountPct: order.discount_pct,
        discountLabel: order.discount_pct > 0 ? `Diskon ${order.discount_pct}%` : "",
        customerName: order.customer_name ?? order.customers?.name,
        customerPhone: order.customers?.whatsapp,
        customerEmail: (order.customer_email ?? order.customers?.email) || undefined,
        orderNumber: order.order_number,
        isPaid: isPaid ?? order.payment_status === "paid",
        orderDate: order.created_at,
      });
    } catch (err) {
      console.error("Invoice PDF error:", err);
      setToast({ message: "Gagal generate invoice PDF.", type: "error" });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setDownloadingInvoice(false);
    }
  };

  /* ── Computed values ─────────────────────────────────────── */
  const items = order?.order_items ?? [];
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const discountAmount =
    order && order.discount_pct > 0
      ? Math.round(subtotal * (order.discount_pct / 100))
      : 0;

  /* ── Style helpers ───────────────────────────────────────── */
  const inputClass =
    "w-full rounded-lg border border-white/[0.06] bg-[#0f1724] px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#F59E0B]/50 focus:ring-1 focus:ring-[#F59E0B]/30";
  const labelClass = "mb-1.5 block text-sm font-medium text-gray-300";

  /* ── Loading / Not Found ─────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={32} className="animate-spin text-[#F59E0B]" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <p className="text-lg font-semibold text-white">
          Pesanan tidak ditemukan
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Pesanan dengan ID tersebut tidak ada atau telah dihapus.
        </p>
        <Link
          href="/admin/orders"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#F59E0B] px-4 py-2 text-sm font-semibold text-[#172230]"
        >
          <ArrowLeft size={16} />
          Kembali ke Pesanan
        </Link>
      </div>
    );
  }

  const orderStatus = STATUS_BADGE[order.status];
  const payStatus = PAYMENT_STATUS_BADGE[order.payment_status];

  /* ── UI ──────────────────────────────────────────────────── */
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/orders"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Kembali ke Pesanan
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-white font-heading sm:text-3xl">
            {order.order_number}
          </h1>
          {orderStatus && (
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${orderStatus.cls}`}
            >
              {orderStatus.label}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Dibuat pada {formatDateTime(order.created_at)}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Left Column (2/3) ─────────────────────────────── */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Details Card */}
          <div className="rounded-xl border border-white/[0.06] bg-[#172230] p-6">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
              <FileText size={20} className="text-[#F59E0B]" />
              Detail Pesanan
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Status */}
              <div>
                <label className={labelClass}>Status Pesanan</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={inputClass}
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment info (read-only) */}
              <div>
                <label className={labelClass}>Pembayaran</label>
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-white/[0.06] bg-[#0f1724] px-4 py-2.5">
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
                  {payStatus && (
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${payStatus.cls}`}
                    >
                      {payStatus.label}
                    </span>
                  )}
                  {order.midtrans_payment_type && (
                    <span className="text-xs text-gray-500">
                      ({order.midtrans_payment_type})
                    </span>
                  )}
                </div>
                {order.paid_at && (
                  <p className="mt-1 text-xs text-gray-500">
                    Dibayar pada {formatDateTime(order.paid_at)}
                  </p>
                )}
              </div>

              {/* Rental start date */}
              <div>
                <label className={labelClass}>
                  <Calendar size={14} className="mb-0.5 mr-1 inline" />
                  Tanggal Mulai Sewa
                </label>
                <input
                  type="date"
                  value={rentalStart}
                  onChange={(e) => setRentalStart(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Rental end date */}
              <div>
                <label className={labelClass}>
                  <Calendar size={14} className="mb-0.5 mr-1 inline" />
                  Tanggal Selesai Sewa
                </label>
                <input
                  type="date"
                  value={rentalEnd}
                  onChange={(e) => setRentalEnd(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Duration (read-only) */}
              <div>
                <label className={labelClass}>Durasi Sewa</label>
                <div className="rounded-lg border border-white/[0.06] bg-[#0f1724] px-4 py-2.5 text-sm text-gray-300">
                  {order.rental_days} hari
                </div>
              </div>

              {/* Notes */}
              <div className="sm:col-span-2">
                <label className={labelClass}>Catatan</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Tambahkan catatan..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            {/* Save button */}
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-5">
              {/* Tandai Lunas — only show if unpaid */}
              {order.payment_status === "unpaid" && (
                <button
                  onClick={handleMarkPaid}
                  disabled={markingPaid}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
                >
                  {markingPaid ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CheckCircle size={16} />
                  )}
                  Tandai Lunas
                </button>
              )}

              {/* Download Invoice */}
              <button
                onClick={() => downloadInvoicePDF()}
                disabled={downloadingInvoice}
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-gray-300 transition-colors hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
              >
                {downloadingInvoice ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Download size={16} />
                )}
                Download Invoice
              </button>

              {/* Simpan Perubahan */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="ml-auto inline-flex items-center gap-2 rounded-lg bg-[#F59E0B] px-5 py-2.5 text-sm font-semibold text-[#172230] transition-colors hover:bg-[#F59E0B]/90 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Simpan Perubahan
              </button>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="rounded-xl border border-white/[0.06] bg-[#172230] p-6">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
              <Package size={20} className="text-[#F59E0B]" />
              Item Pesanan
            </h2>

            {items.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                Tidak ada item dalam pesanan ini.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="whitespace-nowrap pb-3 pr-4 font-medium text-gray-400">
                        Produk
                      </th>
                      <th className="whitespace-nowrap pb-3 px-4 font-medium text-gray-400 text-center">
                        Qty
                      </th>
                      <th className="whitespace-nowrap pb-3 px-4 font-medium text-gray-400 text-right">
                        Harga Satuan
                      </th>
                      <th className="whitespace-nowrap pb-3 pl-4 font-medium text-gray-400 text-right">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="whitespace-nowrap py-3 pr-4 font-medium text-white">
                          {item.product_name}
                        </td>
                        <td className="whitespace-nowrap py-3 px-4 text-center text-gray-300">
                          {item.quantity}
                        </td>
                        <td className="whitespace-nowrap py-3 px-4 text-right text-gray-300">
                          {formatRupiah(item.unit_price)}
                        </td>
                        <td className="whitespace-nowrap py-3 pl-4 text-right text-white">
                          {formatRupiah(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column (1/3) ────────────────────────────── */}
        <div className="space-y-6">
          {/* Customer Info Card */}
          <div className="rounded-xl border border-white/[0.06] bg-[#172230] p-6">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
              <User size={20} className="text-[#F59E0B]" />
              Pelanggan
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <p className="text-xs font-medium text-gray-500">Nama</p>
                <p className="mt-0.5 text-sm font-medium text-white">
                  {order.customer_name ?? order.customers?.name ?? "-"}
                </p>
              </div>

              {/* WhatsApp */}
              <div>
                <p className="text-xs font-medium text-gray-500">WhatsApp</p>
                <a
                  href={`https://wa.me/${(order.customers?.whatsapp ?? "").replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300"
                >
                  <MessageCircle size={14} />
                  {order.customers?.whatsapp ?? "-"}
                </a>
              </div>

              {/* Email */}
              {order.customers?.email && (
                <div>
                  <p className="text-xs font-medium text-gray-500">Email</p>
                  <p className="mt-0.5 text-sm text-gray-300">
                    {order.customers.email}
                  </p>
                </div>
              )}

              {/* Company */}
              {order.customers?.company && (
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Perusahaan
                  </p>
                  <p className="mt-0.5 text-sm text-gray-300">
                    {order.customers.company}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Totals Card */}
          <div className="rounded-xl border border-white/[0.06] bg-[#172230] p-6">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
              <CreditCard size={20} className="text-[#F59E0B]" />
              Ringkasan
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-gray-300">{formatRupiah(subtotal)}</span>
              </div>

              {order.discount_pct > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    Diskon ({order.discount_pct}%)
                  </span>
                  <span className="text-red-400">
                    - {formatRupiah(discountAmount)}
                  </span>
                </div>
              )}

              <div className="border-t border-white/[0.06] pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    Total
                  </span>
                  <span className="text-lg font-bold text-[#F59E0B]">
                    {formatRupiah(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Meta Card */}
          <div className="rounded-xl border border-white/[0.06] bg-[#172230] p-6">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
              <Hash size={20} className="text-[#F59E0B]" />
              Info Lainnya
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">ID Pesanan</span>
                <span className="font-mono text-xs text-gray-500">
                  {order.id.slice(0, 8)}...
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Dibuat</span>
                <span className="text-gray-300">
                  {formatDateTime(order.created_at)}
                </span>
              </div>
              {order.rental_start_date && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Mulai Sewa</span>
                  <span className="text-gray-300">
                    {formatDateTime(order.rental_start_date)}
                  </span>
                </div>
              )}
              {order.rental_end_date && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Selesai Sewa</span>
                  <span className="text-gray-300">
                    {formatDateTime(order.rental_end_date)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 animate-pulse rounded-lg border px-5 py-3 text-sm font-medium shadow-xl ${
            toast.type === "success"
              ? "border-emerald-500/20 bg-[#172230] text-emerald-400"
              : "border-red-500/20 bg-[#172230] text-red-400"
          }`}
        >
          {toast.message}
        </div>
      )}
    </>
  );
}
