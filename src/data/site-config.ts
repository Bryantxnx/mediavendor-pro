/* ── Site-wide Business Constants ──
 *  Satu tempat untuk semua data bisnis.
 *  Mau ganti nomor WA? Cukup edit di sini, semua file ikut berubah.
 */

export const siteConfig = {
  name: "MediaVendor Pro",
  legalName: "PT Media Vendor Pro Indonesia",
  url: "https://mediavendor-pro.vercel.app",
  description:
    "Vendor multimedia profesional untuk sewa kamera, lighting, audio dan jasa produksi video. Dipercaya Pertamina, BNI, Kementerian. Harga kompetitif, peralatan premium.",

  phone: "+6285122979535",
  phoneFormatted: "+62 851-2297-9535",
  waNumber: "6285122979535",
  email: "halo@mediavendorpro.id",

  address: {
    street: "Jl. Oscar III, Bambu Apus",
    locality: "Pamulang",
    region: "Tangerang Selatan",
    country: "ID",
    full: "Jl. Oscar III, Bambu Apus, Pamulang",
  },

  maps: "https://www.google.com/maps/search/?api=1&query=Jl.+Oscar+III+Bambu+Apus+Pamulang",

  social: {
    instagram: "https://instagram.com/said88x_",
    youtube: "https://youtube.com/@said88x_",
  },

  bank: {
    name: "BCA KCU Jakarta",
    accountName: "Media Vendor Pro",
    accountNumber: "8830 9900 1122",
  },

  hours: "Senin – Sabtu: 09.00 – 20.00",
  hoursSchema: "Mo-Sa 09:00-20:00",
} as const;

/* ── WA Helper ── */
export function buildWaUrl(text: string): string {
  return `https://wa.me/${siteConfig.waNumber}?text=${encodeURIComponent(text)}`;
}
