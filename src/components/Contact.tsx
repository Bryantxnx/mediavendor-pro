"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageCircle,
} from "lucide-react";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Jl.+Sudirman+No.+123+Jakarta+Selatan";

const contactInfo = [
  {
    icon: Phone,
    label: "Phone / WhatsApp",
    value: "+62 812-3456-7890",
    href: "tel:+6281234567890",
    external: false,
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@mediavendorpro.com",
    href: "mailto:hello@mediavendorpro.com",
    external: false,
  },
  {
    icon: MapPin,
    label: "Studio",
    value: "Jl. Sudirman No. 123, Jakarta Selatan",
    href: GOOGLE_MAPS_URL,
    external: true,
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon - Sat: 09:00 - 20:00",
    href: "",
    external: false,
  },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // Listen for prefill events from Pricelist component
  useEffect(() => {
    function onPrefill(e: Event) {
      const detail = (e as CustomEvent<{ item: string }>).detail;
      if (detail?.item && messageRef.current) {
        messageRef.current.value = `Saya ingin booking: ${detail.item}.\n\nDetail kebutuhan:\n- Tanggal sewa: \n- Durasi: \n- Lokasi: `;
        messageRef.current.focus();
      }
    }
    window.addEventListener("prefill-contact", onPrefill);
    return () => window.removeEventListener("prefill-contact", onPrefill);
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="contact" className="scroll-mt-20 bg-card py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
            Get In Touch
          </p>
          <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to Start Your Project?
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
            Tell us about your project requirements and we&apos;ll get back to you
            with a custom quote within 24 hours.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Contact Info */}
          <div className="lg:col-span-2">
            <h3 className="mb-6 font-heading text-lg font-semibold text-foreground">
              Contact Information
            </h3>

            <div className="space-y-5">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                const isLink = info.href !== "";
                const linkProps = isLink
                  ? {
                      href: info.href,
                      ...(info.external
                        ? { target: "_blank" as const, rel: "noopener noreferrer" }
                        : {}),
                    }
                  : {};

                if (isLink) {
                  return (
                    <a
                      key={info.label}
                      {...linkProps}
                      className="flex items-start gap-4 rounded-lg border border-border/50 bg-background p-4 transition-colors hover:border-accent/30"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                        <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {info.label}
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-foreground">
                          {info.value}
                        </p>
                      </div>
                    </a>
                  );
                }

                return (
                  <div
                    key={info.label}
                    className="flex items-start gap-4 rounded-lg border border-border/50 bg-background p-4 transition-colors hover:border-accent/30"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                      <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {info.label}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-foreground">
                        {info.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick CTA */}
            <div className="mt-8 rounded-xl border border-accent/20 bg-accent/5 p-6">
              <h4 className="mb-2 font-heading text-sm font-semibold text-foreground">
                Need Equipment Today?
              </h4>
              <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                Chat langsung via WhatsApp untuk same-day rentals dan cek
                ketersediaan unit. Kami siap membantu kebutuhan produksi
                mendadak Anda.
              </p>
              <a
                href={`https://wa.me/6281234567890?text=${encodeURIComponent("Halo MediaVendor Pro, saya ingin cek ketersediaan alat untuk hari ini.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-500"
              >
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Chat WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-border/50 bg-background p-6 sm:p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                    <CheckCircle className="h-8 w-8 text-accent" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 font-heading text-xl font-semibold text-foreground">
                    Message Sent!
                  </h3>
                  <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                    Thank you for reaching out. Our team will review your request
                    and get back to you within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-1.5 block text-xs font-medium text-foreground"
                      >
                        Full Name <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="John Doe"
                        className="w-full rounded-md border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-1.5 block text-xs font-medium text-foreground"
                      >
                        Email <span className="text-accent">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="john@company.com"
                        className="w-full rounded-md border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-1.5 block text-xs font-medium text-foreground"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="+62 812-xxxx-xxxx"
                        className="w-full rounded-md border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="service"
                        className="mb-1.5 block text-xs font-medium text-foreground"
                      >
                        Service Type <span className="text-accent">*</span>
                      </label>
                      <select
                        id="service"
                        name="service"
                        required
                        defaultValue=""
                        className="w-full rounded-md border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
                      >
                        <option value="" disabled>
                          Select a service
                        </option>
                        <option value="camera-rental">Camera Rental</option>
                        <option value="lighting">Lighting Setup</option>
                        <option value="audio">Audio Equipment</option>
                        <option value="video-production">Video Production</option>
                        <option value="post-production">Post Production</option>
                        <option value="crew">Crew Hiring</option>
                        <option value="package">Full Package</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="date"
                      className="mb-1.5 block text-xs font-medium text-foreground"
                    >
                      Project Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      className="w-full rounded-md border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-1.5 block text-xs font-medium text-foreground"
                    >
                      Project Details <span className="text-accent">*</span>
                    </label>
                    <textarea
                      ref={messageRef}
                      id="message"
                      name="message"
                      required
                      rows={4}
                      placeholder="Tell us about your project - location, duration, equipment needs, etc."
                      className="w-full resize-none rounded-md border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring cursor-pointer sm:w-auto"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
