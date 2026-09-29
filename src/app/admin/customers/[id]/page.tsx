"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MessageCircle,
  Mail,
  Calendar,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Loader2,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";

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
  status: string;
  payment_method: string | null;
  payment_status: string | null;
  total_amount: number;
  created_at: string;
  order_items: OrderItem[];
}

interface CustomerDetail {
  id: string;
  name: string;
  whatsapp: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  created_at: string;
  orders: Order[];
}

function formatRp(n: number) {
  return "Rp " + new Intl.NumberFormat("id-ID").format(n);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function waLink(wa: string) {
  const digits = wa.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  confirmed: "bg-blue-500/10 text-blue-400",
  processing: "bg-cyan-500/10 text-cyan-400",
  completed: "bg-emerald-500/10 text-emerald-400",
  cancelled: "bg-red-500/10 text-red-400",
  delivered: "bg-emerald-500/10 text-emerald-400",
  shipped: "bg-indigo-500/10 text-indigo-400",
};

const paymentColors: Record<string, string> = {
  transfer: "bg-blue-500/10 text-blue-400",
  cash: "bg-emerald-500/10 text-emerald-400",
  qris: "bg-purple-500/10 text-purple-400",
  dp: "bg-amber-500/10 text-amber-400",
};

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/customers/${id}`);
        if (!res.ok) {
          setError("Pelanggan tidak ditemukan");
          return;
        }
        const data = await res.json();
        setCustomer(data);
      } catch {
        setError("Gagal memuat data pelanggan");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={28} className="animate-spin text-[#F59E0B]" />
      </div>
    );
  }

  /* ── Error / not found ── */
  if (error || !customer) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <AlertTriangle size={36} className="text-red-400" />
        <p className="mt-3 text-sm text-gray-400">{error || "Tidak ditemukan"}</p>
        <Link
          href="/admin/customers"
          className="mt-4 text-sm text-[#F59E0B] hover:underline"
        >
          &larr; Kembali ke daftar pelanggan
        </Link>
      </div>
    );
  }

  /* ── Stats ── */
  const totalOrders = customer.orders.length;
  const totalSpending = customer.orders.reduce(
    (sum, o) => sum + (Number(o.total_amount) || 0),
    0,
  );
  const avgOrder = totalOrders > 0 ? totalSpending / totalOrders : 0;

  return (
    <>
      {/* Back link */}
      <Link
        href="/admin/customers"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-[#F59E0B]"
      >
        <ArrowLeft size={16} />
        Kembali
      </Link>

      {/* Title */}
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-white font-heading sm:text-3xl">
        {customer.name}
      </h1>

      {/* Customer info card + stats */}
      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        {/* Info card */}
        <div className="rounded-xl border border-white/[0.06] bg-[#172230] p-5 lg:col-span-1">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-500">
            Informasi Pelanggan
          </h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Nama</dt>
              <dd className="mt-0.5 font-medium text-white">{customer.name}</dd>
            </div>
            {customer.whatsapp && (
              <div>
                <dt className="text-gray-500">WhatsApp</dt>
                <dd className="mt-0.5">
                  <a
                    href={waLink(customer.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-emerald-400 hover:underline"
                  >
                    <MessageCircle size={14} />
                    {customer.whatsapp}
                  </a>
                </dd>
              </div>
            )}
            {customer.email && (
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="mt-0.5 flex items-center gap-1.5 text-gray-300">
                  <Mail size={14} className="text-gray-500" />
                  {customer.email}
                </dd>
              </div>
            )}
            {customer.company && (
              <div>
                <dt className="text-gray-500">Perusahaan</dt>
                <dd className="mt-0.5 text-gray-300">{customer.company}</dd>
              </div>
            )}
            <div>
              <dt className="text-gray-500">Tanggal Terdaftar</dt>
              <dd className="mt-0.5 flex items-center gap-1.5 text-gray-300">
                <Calendar size={14} className="text-gray-500" />
                {formatDate(customer.created_at)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-2">
          {[
            {
              label: "Total Pesanan",
              value: String(totalOrders),
              icon: ShoppingCart,
            },
            {
              label: "Total Spending",
              value: formatRp(totalSpending),
              icon: DollarSign,
            },
            {
              label: "Rata-rata Pesanan",
              value: formatRp(Math.round(avgOrder)),
              icon: TrendingUp,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#172230] p-5 transition-shadow hover:shadow-lg hover:shadow-[#F59E0B]/5"
            >
              <span className="absolute left-0 top-0 h-full w-1 bg-[#F59E0B]/60 transition-all group-hover:w-1.5 group-hover:bg-[#F59E0B]" />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    {label}
                  </p>
                  <p className="mt-2 text-xl font-bold tracking-tight text-white font-heading">
                    {value}
                  </p>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F59E0B]/10">
                  <Icon size={18} className="text-[#F59E0B]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order history */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white font-heading">
          Riwayat Pesanan
        </h2>

        {customer.orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-[#172230]/50 py-12">
            <ShoppingCart size={32} className="text-gray-600" />
            <p className="mt-2 text-sm text-gray-500">Belum ada pesanan</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto rounded-xl border border-white/[0.06] bg-[#172230] md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    <th className="px-5 py-3">No. Pesanan</th>
                    <th className="px-5 py-3">Tanggal</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Pembayaran</th>
                    <th className="px-5 py-3 text-right">Total</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {customer.orders.map((o) => (
                    <tr
                      key={o.id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="whitespace-nowrap px-5 py-3 font-mono text-xs font-medium text-white">
                        {o.order_number}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-gray-400">
                        {formatDate(o.created_at)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[o.status] ?? "bg-gray-500/10 text-gray-400"}`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3">
                        {o.payment_method ? (
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${paymentColors[o.payment_method] ?? "bg-gray-500/10 text-gray-400"}`}
                          >
                            {o.payment_method}
                          </span>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-right font-medium text-[#F59E0B]">
                        {formatRp(o.total_amount)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-right">
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-[#F59E0B] transition hover:bg-[#F59E0B]/10"
                        >
                          Lihat
                          <ExternalLink size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {customer.orders.map((o) => (
                <Link
                  key={o.id}
                  href={`/admin/orders/${o.id}`}
                  className="group rounded-xl border border-white/[0.06] bg-[#172230] p-4 transition hover:shadow-lg hover:shadow-[#F59E0B]/5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-xs font-medium text-white">
                        {o.order_number}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {formatDate(o.created_at)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[o.status] ?? "bg-gray-500/10 text-gray-400"}`}
                    >
                      {o.status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-white/[0.04] pt-3">
                    <span className="text-sm font-medium text-[#F59E0B]">
                      {formatRp(o.total_amount)}
                    </span>
                    <ExternalLink
                      size={14}
                      className="text-gray-600 transition group-hover:text-[#F59E0B]"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
