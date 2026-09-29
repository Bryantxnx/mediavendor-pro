"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  ExternalLink,
  MessageCircle,
  Loader2,
  UserX,
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  whatsapp: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  created_at: string;
  order_count: number;
  total_spending: number;
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

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  /* ── Debounce search input ── */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  /* ── Fetch customers ── */
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      const res = await fetch(`/api/admin/customers?${params}`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-heading sm:text-3xl">
            Pelanggan
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {loading ? "Memuat…" : `${customers.length} pelanggan terdaftar`}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          placeholder="Cari nama, WhatsApp, atau email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-white/[0.06] bg-[#172230] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition focus:border-[#F59E0B]/40 focus:ring-1 focus:ring-[#F59E0B]/30 sm:max-w-sm"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-[#F59E0B]" />
        </div>
      )}

      {/* Empty state */}
      {!loading && customers.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-[#172230]/50 py-16">
          <UserX size={40} className="text-gray-600" />
          <p className="mt-3 text-sm text-gray-500">
            {debouncedSearch
              ? "Tidak ada pelanggan yang cocok"
              : "Belum ada pelanggan terdaftar"}
          </p>
        </div>
      )}

      {/* Table — desktop */}
      {!loading && customers.length > 0 && (
        <div className="hidden overflow-x-auto rounded-xl border border-white/[0.06] bg-[#172230] md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-5 py-3">Nama</th>
                <th className="px-5 py-3">WhatsApp</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3 text-center">Total Pesanan</th>
                <th className="px-5 py-3 text-right">Total Spending</th>
                <th className="px-5 py-3">Terdaftar</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {customers.map((c) => (
                <tr
                  key={c.id}
                  className="transition-colors hover:bg-white/[0.02]"
                >
                  <td className="whitespace-nowrap px-5 py-3 font-medium text-white">
                    {c.name}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    {c.whatsapp ? (
                      <a
                        href={waLink(c.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-emerald-400 hover:underline"
                      >
                        <MessageCircle size={14} />
                        {c.whatsapp}
                      </a>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-gray-400">
                    {c.email || <span className="text-gray-600">—</span>}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-center text-gray-300">
                    {c.order_count}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right font-medium text-[#F59E0B]">
                    {formatRp(c.total_spending)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-gray-500">
                    {formatDate(c.created_at)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-[#F59E0B] transition hover:bg-[#F59E0B]/10"
                    >
                      Detail
                      <ExternalLink size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cards — mobile */}
      {!loading && customers.length > 0 && (
        <div className="flex flex-col gap-3 md:hidden">
          {customers.map((c) => (
            <Link
              key={c.id}
              href={`/admin/customers/${c.id}`}
              className="group rounded-xl border border-white/[0.06] bg-[#172230] p-4 transition hover:shadow-lg hover:shadow-[#F59E0B]/5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-white">{c.name}</p>
                  {c.whatsapp && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-emerald-400">
                      <MessageCircle size={12} />
                      {c.whatsapp}
                    </p>
                  )}
                  {c.email && (
                    <p className="mt-0.5 text-xs text-gray-500">{c.email}</p>
                  )}
                </div>
                <ExternalLink
                  size={16}
                  className="shrink-0 text-gray-600 transition group-hover:text-[#F59E0B]"
                />
              </div>
              <div className="mt-3 flex items-center gap-4 border-t border-white/[0.04] pt-3 text-xs text-gray-400">
                <span>
                  {c.order_count} pesanan
                </span>
                <span className="font-medium text-[#F59E0B]">
                  {formatRp(c.total_spending)}
                </span>
                <span className="ml-auto text-gray-600">
                  {formatDate(c.created_at)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
