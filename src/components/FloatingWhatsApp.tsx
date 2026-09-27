"use client";

import { MessageCircle } from "lucide-react";

const WA_NUMBER = "6281234567890";
const WA_TEXT = encodeURIComponent(
  "Halo MediaVendor Pro, saya ingin konsultasi sewa alat multimedia / jasa produksi"
);
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`;

export default function FloatingWhatsApp() {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-emerald-500 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 animate-wa-pulse sm:px-5"
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span className="hidden sm:inline">Chat via WhatsApp</span>
    </a>
  );
}
