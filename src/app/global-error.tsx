"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#050506] px-4 text-center">
        <div className="rounded-2xl border border-white/[0.06] bg-[#172230] p-10">
          <h1 className="text-6xl font-bold text-[#F59E0B]">Oops</h1>
          <p className="mt-4 text-lg font-medium text-white">
            Terjadi Kesalahan
          </p>
          <p className="mt-2 max-w-md text-sm text-gray-500">
            Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau
            kembali ke beranda.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={reset}
              className="rounded-lg bg-[#F59E0B] px-6 py-2.5 text-sm font-semibold text-[#172230] transition-colors hover:bg-[#F59E0B]/90"
            >
              Coba Lagi
            </button>
            <a
              href="/"
              className="rounded-lg border border-white/10 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:border-[#F59E0B]/50 hover:text-[#F59E0B]"
            >
              Kembali ke Beranda
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
