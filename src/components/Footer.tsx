import {
  Camera,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
} from "lucide-react";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Jl.+Oscar+III+Bambu+Apus+Pamulang";

const WA_URL = `https://wa.me/6285122979535?text=${encodeURIComponent(
  "Halo MediaVendor Pro, saya ingin konsultasi sewa alat multimedia / jasa produksi"
)}`;

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
    title: "Services",
    links: [
      { label: "Camera Rental", href: "#pricelist-Cameras" },
      { label: "Lighting Setup", href: "#pricelist-Lighting" },
      { label: "Audio Equipment", href: "#pricelist-Audio" },
      { label: "Video Production", href: "#pricelist-Packages" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#services" },
      { label: "Portfolio", href: "#portfolio" },
      { label: "Pricing", href: "#pricelist" },
      { label: "Contact", href: "#contact" },
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
            <a href="#home" className="mb-4 flex items-center gap-2">
              <Camera className="h-6 w-6 text-accent" aria-hidden="true" />
              <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                MediaVendor<span className="text-accent">Pro</span>
              </span>
            </a>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Your trusted partner for premium multimedia equipment rental and
              professional production services. Dipercaya BUMN &amp; korporat besar.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/said88x_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com/@said88x_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <YoutubeIcon className="h-4 w-4" />
              </a>
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground transition-colors hover:border-emerald-500 hover:text-emerald-500"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="mailto:xiole3113@gmail.com"
                aria-label="Email"
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
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-sm text-muted-foreground transition-colors hover:text-accent"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <span>Jl. Oscar III, Bambu Apus, Pamulang</span>
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
                  +62 851-2297-9535
                </a>
              </li>
              <li>
                <a
                href="mailto:xiole3113@gmail.com"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-accent"
                >
                  <Mail className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  xiole3113@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} MediaVendor Pro. All rights
            reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Premium Multimedia Equipment &amp; Services
          </p>
        </div>
      </div>
    </footer>
  );
}
