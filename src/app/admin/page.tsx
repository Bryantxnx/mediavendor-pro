"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  ExternalLink,
  AlertTriangle,
  Loader2,
} from "lucide-react";

/* ── Types ── */
interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  customer_name?: string | null;
  customers: { id: string; name: string } | null;
}

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  is_active: boolean;
}

interface DashboardData {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  pipelineRevenue: number;
  recentOrders: Order[];
  lowStockProducts: Product[];
  loading: boolean;
}

/* ── Helpers ── */
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

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  confirmed: "bg-blue-500/10 text-blue-400",
  processing: "bg-cyan-500/10 text-cyan-400",
  completed: "bg-emerald-500/10 text-emerald-400",
  cancelled: "bg-red-500/10 text-red-400",
  delivered: "bg-emerald-500/10 text-emerald-400",
  shipped: "bg-indigo-500/10 text-indigo-400",
};

/* ── Skeleton Pulse ── */
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-white/[0.06] ${className}`}
    />
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData>({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pipelineRevenue: 0,
    recentOrders: [],
    lowStockProducts: [],
    loading: true,
  });

  useEffect(() => {
    async function fetchAll() {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (!res.ok) throw new Error("Failed to fetch dashboard");
        const d = await res.json();

        setData({
          totalProducts: d.totalProducts ?? 0,
          totalOrders: d.totalOrders ?? 0,
          totalCustomers: d.totalCustomers ?? 0,
          totalRevenue: d.totalRevenue ?? 0,
          pipelineRevenue: d.pipelineRevenue ?? 0,
          recentOrders: d.recentOrders ?? [],
          lowStockProducts: d.lowStockProducts ?? [],
          loading: false,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setData((prev) => ({ ...prev, loading: false }));
      }
    }

    fetchAll();
  }, []);

  const stats = [
    {
      label: "Total Produk",
      value: String(data.totalProducts),
      subtitle: "item aktif",
      icon: Package,
    },
    {
      label: "Total Pesanan",
      value: String(data.totalOrders),
      subtitle: "semua pesanan",
      icon: ShoppingCart,
    },
    {
      label: "Total Pelanggan",
      value: String(data.totalCustomers),
      subtitle: "terdaftar",
      icon: Users,
    },
    {
      label: "Pendapatan Lunas",
      value: formatRp(data.totalRevenue),
      subtitle: data.pipelineRevenue > 0
        ? `+ ${formatRp(data.pipelineRevenue)} belum lunas`
        : "pesanan lunas",
      icon: DollarSign,
    },
  ];

  return (
    <>
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white font-heading sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Ringkasan data MediaVendor Pro
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, subtitle, icon: Icon }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#172230] p-5 transition-shadow hover:shadow-lg hover:shadow-[#F59E0B]/5"
          >
            {/* Accent bar */}
            <span className="absolute left-0 top-0 h-full w-1 bg-[#F59E0B]/60 transition-all group-hover:w-1.5 group-hover:bg-[#F59E0B]" />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  {label}
                </p>
                {data.loading ? (
                  <Skeleton className="mt-2 h-7 w-20" />
                ) : (
                  <p className="mt-2 text-2xl font-bold tracking-tight text-white font-heading">
                    {value}
                  </p>
                )}
                <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F59E0B]/10">
                <Icon size={20} className="text-[#F59E0B]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom two-column grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* ── Pesanan Terbaru ── */}
        <div className="rounded-xl border border-white/[0.06] bg-[#172230] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">
              Pesanan Terbaru
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs text-[#F59E0B] hover:underline"
            >
              Lihat semua
            </Link>
          </div>

          {data.loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : data.recentOrders.length === 0 ? (
            <div className="flex flex-col items-center py-8">
              <ShoppingCart size={28} className="text-gray-600" />
              <p className="mt-2 text-xs text-gray-500">Belum ada pesanan</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {data.recentOrders.map((o) => (
                <Link
                  key={o.id}
                  href={`/admin/orders/${o.id}`}
                  className="group flex items-center justify-between gap-3 py-3 transition hover:bg-white/[0.02] -mx-2 px-2 rounded-lg"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-medium text-white">
                        {o.order_number}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${statusColors[o.status] ?? "bg-gray-500/10 text-gray-400"}`}
                      >
                        {o.status}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {o.customer_name ?? o.customers?.name ?? "—"} &middot;{" "}
                      {formatDate(o.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-medium text-[#F59E0B]">
                      {formatRp(o.total_amount)}
                    </span>
                    <ExternalLink
                      size={12}
                      className="text-gray-600 transition group-hover:text-[#F59E0B]"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── Stok Rendah ── */}
        <div className="rounded-xl border border-white/[0.06] bg-[#172230] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">
              <span className="inline-flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-amber-400" />
                Stok Rendah
              </span>
            </h2>
            <Link
              href="/admin/inventory"
              className="text-xs text-[#F59E0B] hover:underline"
            >
              Lihat semua
            </Link>
          </div>

          {data.loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : data.lowStockProducts.length === 0 ? (
            <div className="flex flex-col items-center py-8">
              <Package size={28} className="text-gray-600" />
              <p className="mt-2 text-xs text-gray-500">
                Semua stok aman
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {data.lowStockProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/inventory/${p.id}`}
                  className="group flex items-center justify-between gap-3 py-3 transition hover:bg-white/[0.02] -mx-2 px-2 rounded-lg"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {p.name}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {p.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        p.stock === 0
                          ? "bg-red-500/10 text-red-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {p.stock === 0 ? "Habis" : `Sisa ${p.stock}`}
                    </span>
                    <ExternalLink
                      size={12}
                      className="text-gray-600 transition group-hover:text-[#F59E0B]"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
