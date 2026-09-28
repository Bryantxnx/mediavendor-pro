import type { Metadata } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import "./globals.css";

const SITE_URL = "https://mediavendor-pro.vercel.app";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MediaVendor Pro | Sewa Alat Multimedia & Jasa Produksi Profesional",
  description:
    "Vendor multimedia profesional untuk sewa kamera, lighting, audio dan jasa produksi video. Dipercaya Pertamina, BNI, Kementerian. Harga kompetitif, peralatan premium.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MediaVendor Pro | Sewa Alat Multimedia & Jasa Produksi Profesional",
    description:
      "Vendor multimedia profesional untuk sewa kamera, lighting, audio dan jasa produksi video. Dipercaya Pertamina, BNI, Kementerian.",
    url: SITE_URL,
    siteName: "MediaVendor Pro",
    locale: "id_ID",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "MediaVendor Pro",
  description:
    "Vendor multimedia profesional untuk sewa kamera, lighting, audio dan jasa produksi video di Jakarta.",
  url: SITE_URL,
  telephone: "+6285122979535",
  email: "halo@mediavendorpro.id",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Oscar III, Bambu Apus",
    addressLocality: "Pamulang",
    addressRegion: "Tangerang Selatan",
    addressCountry: "ID",
  },
  openingHours: "Mo-Sa 09:00-20:00",
  sameAs: [
    "https://instagram.com/said88x_",
    "https://youtube.com/@said88x_",
  ],
  priceRange: "$$",
  image: `${SITE_URL}/icon.svg`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${archivo.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
