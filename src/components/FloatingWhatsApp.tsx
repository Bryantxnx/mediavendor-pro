"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { buildWaUrl } from "@/data/site-config";

const WA_URL = buildWaUrl(
  "Halo MediaVendor Pro, saya ingin konsultasi sewa alat multimedia / jasa produksi"
);

export default function FloatingWhatsApp() {
  return (
    <motion.a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi MediaVendor Pro via WhatsApp"
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-20 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 animate-wa-pulse sm:px-5 lg:bottom-6"
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span className="hidden sm:inline">Chat via WhatsApp</span>
    </motion.a>
  );
}
