"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ClipboardList,
  ShieldCheck,
  Truck,
  SearchCheck,
  ChevronDown,
  MessageCircle,
} from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Pilih Alat & Booking",
    description:
      "Konsultasikan kebutuhan produksi Anda via WhatsApp atau form kontak. Tim kami akan membantu menentukan paket yang tepat sesuai scope proyek dan budget.",
  },
  {
    icon: ShieldCheck,
    step: "02",
    title: "Verifikasi & DP",
    description:
      "Siapkan jaminan identitas resmi (KTP untuk personal, NPWP/PO Perusahaan untuk korporat/BUMN). Pembayaran DP untuk konfirmasi booking.",
  },
  {
    icon: Truck,
    step: "03",
    title: "Pickup / Delivery",
    description:
      "Unit dapat diambil langsung di studio kami (Jl. Sudirman No. 123, Jakarta Selatan) atau dikirim ke lokasi produksi via kurir khusus dengan biaya tambahan.",
  },
  {
    icon: SearchCheck,
    step: "04",
    title: "Return & Quality Check",
    description:
      "Setelah masa sewa selesai, unit dikembalikan dan kami lakukan pengecekan kondisi fisik barang. Deposit dikembalikan jika tidak ada kerusakan.",
  },
];

const faqs = [
  {
    question: "Apa syarat jaminan untuk sewa personal vs korporat?",
    answer:
      "Untuk personal: KTP + deposit sesuai nilai unit. Untuk korporat/BUMN: cukup PO (Purchase Order) resmi perusahaan atau surat jaminan dari instansi. Klien korporat repeat-order bisa menggunakan sistem invoice NET-30.",
  },
  {
    question: "Bagaimana ketentuan durasi sewa?",
    answer:
      "Sistem sewa kami berbasis 24 jam. Sewa dimulai saat unit diambil/diterima dan berakhir 24 jam berikutnya. Keterlambatan pengembalian dikenakan biaya pro-rata per 6 jam. Sewa mingguan dihitung 7x24 jam dengan diskon signifikan.",
  },
  {
    question: "Apakah tersedia operator / kru asisten kamera?",
    answer:
      "Ya, kami menyediakan operator profesional untuk semua jenis equipment (cameraman, gaffer, sound engineer, drone pilot). Tarif operator terpisah dari sewa alat dan bervariasi tergantung scope pekerjaan. Hubungi kami untuk custom quotation.",
  },
  {
    question: "Bagaimana jika alat mengalami kerusakan saat disewa?",
    answer:
      "Kerusakan akibat kelalaian penyewa menjadi tanggung jawab penyewa sesuai nilai klaim asuransi. Kami menyediakan opsi asuransi tambahan (insurance add-on) saat booking untuk perlindungan penuh selama masa sewa.",
  },
];

export default function RentalGuide() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="rental-guide" className="scroll-mt-20 bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
            How It Works
          </p>
          <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Alur Sewa Equipment
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
            Proses sewa yang transparan dan mudah. Dari konsultasi hingga pengembalian, kami pastikan pengalaman rental Anda lancar dan profesional.
          </p>
        </div>

        {/* 4-Step Process */}
        <div className="mb-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
              >
                {/* Step number */}
                <span className="absolute -top-3 right-4 rounded-md bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
                  Step {item.step}
                </span>

                {/* Icon */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>

                {/* Title */}
                <h3 className="mb-2 font-heading text-base font-semibold text-foreground">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>

                {/* Connector line (not on last) */}
                {i < steps.length - 1 && (
                  <div className="pointer-events-none absolute -right-3 top-1/2 hidden h-px w-6 bg-border/50 lg:block" />
                )}
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mx-auto max-w-3xl">
          <h3 className="mb-8 text-center font-heading text-2xl font-bold text-foreground">
            Pertanyaan Umum (FAQ)
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-border/50 bg-card transition-colors hover:border-accent/20"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-foreground">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                        isOpen && "rotate-180 text-accent"
                      )}
                      aria-hidden="true"
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-out",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA below FAQ */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={`https://wa.me/6281234567890?text=${encodeURIComponent("Halo MediaVendor Pro, saya ingin bertanya tentang proses sewa alat multimedia.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Tanya via WhatsApp
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Isi Form Kontak
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
