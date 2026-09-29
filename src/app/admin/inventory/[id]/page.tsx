"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";

const CATEGORIES = [
  "Kamera",
  "Lensa",
  "Lighting",
  "Audio",
  "Support",
  "Kru",
  "Paket",
] as const;

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price_per_day: "",
    price_per_week: "",
    specs: "",
    stock: "1",
    popular: false,
    is_active: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);

  /* ── Fetch existing product ────────────────────────────── */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        const product = data.product ?? data;
        setForm({
          name: product.name ?? "",
          category: product.category ?? "",
          price_per_day: String(product.price_per_day ?? ""),
          price_per_week: String(product.price_per_week ?? ""),
          specs: Array.isArray(product.specs)
            ? product.specs.join(", ")
            : product.specs ?? "",
          stock: String(product.stock ?? 1),
          popular: Boolean(product.popular),
          is_active: product.is_active !== false,
        });
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  /* ── Validation ────────────────────────────────────────── */
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Nama alat wajib diisi";
    if (!form.category) errs.category = "Kategori wajib dipilih";
    if (!form.price_per_day || Number(form.price_per_day) <= 0)
      errs.price_per_day = "Harga per hari harus lebih dari 0";
    if (!form.price_per_week || Number(form.price_per_week) <= 0)
      errs.price_per_week = "Harga per minggu harus lebih dari 0";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── Submit ────────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        price_per_day: Number(form.price_per_day),
        price_per_week: Number(form.price_per_week),
        specs: form.specs
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        stock: Number(form.stock) || 1,
        popular: form.popular,
        is_active: form.is_active,
      };

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Update failed");

      router.push("/admin/inventory");
    } catch {
      setToast("Gagal menyimpan perubahan. Silakan coba lagi.");
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Helpers ───────────────────────────────────────────── */
  const inputClass = (field?: string) =>
    `w-full rounded-lg border ${
      field && errors[field]
        ? "border-red-500/60 focus:border-red-500"
        : "border-white/[0.06] focus:border-[#F59E0B]/50"
    } bg-[#0f1724] px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:ring-1 ${
      field && errors[field]
        ? "focus:ring-red-500/30"
        : "focus:ring-[#F59E0B]/30"
    }`;

  const labelClass = "mb-1.5 block text-sm font-medium text-gray-300";

  /* ── Loading / Not Found States ────────────────────────── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={32} className="animate-spin text-[#F59E0B]" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <p className="text-lg font-semibold text-white">Produk tidak ditemukan</p>
        <p className="mt-1 text-sm text-gray-500">
          Produk dengan ID tersebut tidak ada atau telah dihapus.
        </p>
        <Link
          href="/admin/inventory"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#F59E0B] px-4 py-2 text-sm font-semibold text-[#172230]"
        >
          <ArrowLeft size={16} />
          Kembali ke Inventory
        </Link>
      </div>
    );
  }

  /* ── Form UI ───────────────────────────────────────────── */
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/inventory"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Kembali ke Inventory
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-white font-heading sm:text-3xl">
          Edit Alat
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Perbarui informasi peralatan
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl rounded-xl border border-white/[0.06] bg-[#172230] p-6 sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Name — full width */}
          <div className="sm:col-span-2">
            <label className={labelClass}>
              Nama Alat <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="cth. Sony A7 III"
              className={inputClass("name")}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>
              Kategori <span className="text-red-400">*</span>
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={inputClass("category")}
            >
              <option value="">Pilih kategori</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-400">{errors.category}</p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label className={labelClass}>Stok</label>
            <input
              type="number"
              min={0}
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className={inputClass()}
            />
          </div>

          {/* Price per Day */}
          <div>
            <label className={labelClass}>
              Harga per Hari (Rp) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              min={0}
              value={form.price_per_day}
              onChange={(e) =>
                setForm({ ...form, price_per_day: e.target.value })
              }
              placeholder="0"
              className={inputClass("price_per_day")}
            />
            {errors.price_per_day && (
              <p className="mt-1 text-xs text-red-400">
                {errors.price_per_day}
              </p>
            )}
          </div>

          {/* Price per Week */}
          <div>
            <label className={labelClass}>
              Harga per Minggu (Rp) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              min={0}
              value={form.price_per_week}
              onChange={(e) =>
                setForm({ ...form, price_per_week: e.target.value })
              }
              placeholder="0"
              className={inputClass("price_per_week")}
            />
            {errors.price_per_week && (
              <p className="mt-1 text-xs text-red-400">
                {errors.price_per_week}
              </p>
            )}
          </div>

          {/* Specs — full width */}
          <div className="sm:col-span-2">
            <label className={labelClass}>Spesifikasi</label>
            <input
              type="text"
              value={form.specs}
              onChange={(e) => setForm({ ...form, specs: e.target.value })}
              placeholder="Pisahkan dengan koma, cth: 24.2 MP, Full Frame, 4K 30fps"
              className={inputClass()}
            />
            <p className="mt-1 text-xs text-gray-500">
              Pisahkan setiap spesifikasi dengan koma
            </p>
          </div>

          {/* Popular toggle */}
          <div>
            <label className="flex cursor-pointer items-center gap-3">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.popular}
                  onChange={(e) =>
                    setForm({ ...form, popular: e.target.checked })
                  }
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-white/[0.08] transition-colors peer-checked:bg-[#F59E0B]" />
                <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-gray-300 transition-transform peer-checked:translate-x-5 peer-checked:bg-white" />
              </div>
              <span className="text-sm font-medium text-gray-300">
                Populer
              </span>
            </label>
          </div>

          {/* Active toggle */}
          <div>
            <label className="flex cursor-pointer items-center gap-3">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-white/[0.08] transition-colors peer-checked:bg-emerald-500" />
                <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-gray-300 transition-transform peer-checked:translate-x-5 peer-checked:bg-white" />
              </div>
              <span className="text-sm font-medium text-gray-300">
                Aktif
              </span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-end gap-3 border-t border-white/[0.06] pt-6">
          <Link
            href="/admin/inventory"
            className="rounded-lg border border-white/[0.06] px-5 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/[0.04]"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-[#F59E0B] px-5 py-2.5 text-sm font-semibold text-[#172230] transition-colors hover:bg-[#F59E0B]/90 disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Simpan Perubahan
          </button>
        </div>
      </form>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-pulse rounded-lg border border-red-500/20 bg-[#172230] px-5 py-3 text-sm font-medium text-red-400 shadow-xl">
          {toast}
        </div>
      )}
    </>
  );
}
