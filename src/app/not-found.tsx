import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050506] px-4 text-center">
      <h1 className="text-8xl font-bold text-[#F59E0B] font-heading">404</h1>
      <p className="mt-4 text-xl font-medium text-white">
        Halaman Tidak Ditemukan
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Halaman yang Anda cari tidak ada atau sudah dipindahkan.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-lg bg-[#F59E0B] px-6 py-2.5 text-sm font-semibold text-[#172230] transition-colors hover:bg-[#F59E0B]/90"
        >
          Kembali ke Beranda
        </Link>
        <Link
          href="/#pricelist"
          className="rounded-lg border border-white/10 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:border-[#F59E0B]/50 hover:text-[#F59E0B]"
        >
          Lihat Pricelist
        </Link>
      </div>
    </div>
  );
}
