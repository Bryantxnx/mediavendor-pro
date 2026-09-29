import {
  Camera,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { siteConfig, buildWaUrl } from "@/data/site-config";

const WA_URL = buildWaUrl(
  "Halo MediaVendor Pro, saya ingin konsultasi sewa alat multimedia / jasa produksi"
);

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

const footerLinks = [
  {
    title: "Layanan",
    links: [
      { label: "Sewa Kamera", href: "/#pricelist" },
      { label: "Peralatan Lighting", href: "/#pricelist" },
      { label: "Peralatan Audio", href: "/#pricelist" },
      { label: "Produksi Video", href: "/#pricelist" },
    ],
  },
  {
    title: "Perusahaan",
    links: [
      { label: "Tentang Kami", href: "/#services" },
      { label: "Portofolio", href: "/#portfolio" },
      { label: "Daftar Harga", href: "/#pricelist" },
      { label: "Kontak", href: "/#contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="/#home" className="mb-4 flex items-center gap-2">
              <Camera className="h-6 w-6 text-accent" aria-hidden="true" />
              <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                MediaVendor<span className="text-accent">Pro</span>
              </span>
            </a>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Mitra terpercaya Anda untuk sewa peralatan multimedia premium dan
              jasa produksi profesional. Dipercaya BUMN &amp; korporat besar.
            </p>
            <div className="flex gap-3">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ikuti MediaVendor Pro di Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Tonton konten MediaVendor Pro di YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <YoutubeIcon className="h-4 w-4" />
              </a>
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Hubungi MediaVendor Pro via WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground transition-colors hover:border-emerald-500 hover:text-emerald-500"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                aria-label="Kirim email ke MediaVendor Pro"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-accent"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
              Kontak
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={siteConfig.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-sm text-muted-foreground transition-colors hover:text-accent"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <span>{siteConfig.address.full}</span>
                </a>
              </li>
              <li>
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-accent"
                >
                  <Phone className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  {siteConfig.phoneFormatted}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-accent"
                >
                  <Mail className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} MediaVendor Pro. Hak cipta
            dilindungi.
          </p>
          <p className="text-xs text-muted-foreground">
            Sewa Peralatan Multimedia &amp; Jasa Produksi Premium
          </p>
        </div>
      </div>
    </footer>
  );
}
