"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  PackageOpen,
  Star,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price_per_day: number;
  price_per_week: number;
  specs: string[];
  popular: boolean;
  stock: number;
  is_active: boolean;
}

const CATEGORIES = [
  "All",
  "Kamera",
  "Lensa",
  "Lighting",
  "Audio",
  "Support",
  "Kru",
  "Paket",
] as const;

function formatRupiah(value: number) {
  return `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  /* ── Fetch products ────────────────────────────────────── */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.products ?? []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ── Filtered list ─────────────────────────────────────── */
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory =
        activeCategory === "All" || p.category === activeCategory;
      const matchSearch = p.name
        .toLowerCase()
        .includes(search.toLowerCase().trim());
      return matchCategory && matchSearch;
    });
  }, [products, activeCategory, search]);

  /* ── Soft-delete ───────────────────────────────────────── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setToast(`"${deleteTarget.name}" berhasil dihapus`);
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast("Gagal menghapus produk");
      setTimeout(() => setToast(null), 3000);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  /* ── UI ────────────────────────────────────────────────── */
  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-heading sm:text-3xl">
            Inventory Alat
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola semua peralatan yang tersedia untuk disewa
          </p>
        </div>

        <Link
          href="/admin/inventory/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#F59E0B] px-4 py-2.5 text-sm font-semibold text-[#172230] transition-colors hover:bg-[#F59E0B]/90 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50"
        >
          <Plus size={18} />
          Tambah Alat
        </Link>
      </div>

      {/* Category Filter Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-[#F59E0B] text-[#172230]"
                : "bg-[#172230] text-gray-400 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            {cat}
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
          placeholder="Cari alat berdasarkan nama..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-white/[0.06] bg-[#172230] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#F59E0B]/50 focus:ring-1 focus:ring-[#F59E0B]/30 sm:max-w-sm"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={32} className="animate-spin text-[#F59E0B]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-[#172230]/50 py-20">
          <PackageOpen size={48} className="text-gray-600" />
          <p className="mt-4 text-sm text-gray-500">
            {products.length === 0
              ? "Belum ada alat terdaftar."
              : "Tidak ada alat yang cocok dengan filter."}
          </p>
          {products.length === 0 && (
            <Link
              href="/admin/inventory/new"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#F59E0B] px-4 py-2 text-sm font-semibold text-[#172230]"
            >
              <Plus size={16} />
              Tambah Alat Pertama
            </Link>
          )}
        </div>
      ) : (
        /* ── Products Table ────────────────────────────────── */
        <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] bg-[#172230]">
                <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400">
                  Nama
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400">
                  Kategori
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400">
                  Harga/Hari
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400">
                  Harga/Minggu
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400 text-center">
                  Stok
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400 text-center">
                  Status
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="bg-[#0f1724] transition-colors hover:bg-[#172230]/60"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-white">
                    <span className="flex items-center gap-2">
                      {product.name}
                      {product.popular && (
                        <Star
                          size={14}
                          className="fill-[#F59E0B] text-[#F59E0B]"
                        />
                      )}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-xs font-medium text-gray-300">
                      {product.category}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-300">
                    {formatRupiah(product.price_per_day)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-300">
                    {formatRupiah(product.price_per_week)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center text-gray-300">
                    {product.stock}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        product.is_active
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {product.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        href={`/admin/inventory/${product.id}`}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-[#F59E0B]"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(product)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Result count */}
      {!loading && filtered.length > 0 && (
        <p className="mt-3 text-xs text-gray-500">
          Menampilkan {filtered.length} dari {products.length} alat
        </p>
      )}

      {/* ── Delete Confirmation Dialog ────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-xl border border-white/[0.06] bg-[#172230] p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white">Hapus Alat?</h2>
            <p className="mt-2 text-sm text-gray-400">
              Apakah Anda yakin ingin menghapus{" "}
              <span className="font-semibold text-white">
                {deleteTarget.name}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-lg border border-white/[0.06] px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/[0.04] disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {deleting && <Loader2 size={16} className="animate-spin" />}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ─────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-pulse rounded-lg border border-white/[0.06] bg-[#172230] px-5 py-3 text-sm font-medium text-white shadow-xl">
          {toast}
        </div>
      )}
    </>
  );
}
