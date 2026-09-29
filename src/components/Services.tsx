"use client";

import {
  Camera,
  Video,
  Lightbulb,
  Mic,
  Film,
  Users,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  fadeUp,
  staggerContainer,
  staggerChild,
  hoverTap,
  viewportOnce,
} from "@/lib/motion";

/* ── Service data — unchanged ── */
const services = [
  {
    icon: Camera,
    title: "Sewa Kamera",
    pricelistTab: "Kamera",
    description:
      "Kamera profesional DSLR, mirrorless, dan cinema dari brand ternama seperti Sony, Canon, RED, dan Blackmagic.",
    features: ["4K/6K/8K Ready", "Full Frame", "Termasuk Lensa"],
    /* Bento layout: hero card */
    grid: "md:col-span-2 md:row-span-2",
    hero: true,
  },
  {
    icon: Lightbulb,
    title: "Peralatan Lighting",
    pricelistTab: "Lighting",
    description:
      "Solusi pencahayaan lengkap dari LED panel, softbox, studio strobe, hingga setup HMI outdoor.",
    features: ["LED Panel", "Softbox Kit", "RGB Efek"],
    grid: "",
    hero: false,
  },
  {
    icon: Mic,
    title: "Peralatan Audio",
    pricelistTab: "Audio",
    description:
      "Sistem mikrofon wireless, boom kit, field recorder, dan peralatan monitoring audio profesional.",
    features: ["Wireless Lav", "Boom Kit", "Field Recorder"],
    grid: "",
    hero: false,
  },
  {
    icon: Video,
    title: "Produksi Video",
    pricelistTab: "Paket",
    description:
      "Layanan produksi video end-to-end termasuk shooting, editing, color grading, dan delivery.",
    features: ["Multi-Kamera", "Color Grading", "Delivery 4K"],
    grid: "md:col-span-2",
    hero: false,
  },
  {
    icon: Film,
    title: "Pasca Produksi",
    pricelistTab: "Paket",
    description:
      "Editing profesional, motion graphics, VFX, sound design, dan mastering final untuk semua format.",
    features: ["Motion Graphics", "VFX", "Sound Design"],
    grid: "",
    hero: false,
  },
  {
    icon: Users,
    title: "Sewa Kru",
    pricelistTab: "Kru",
    description:
      "Kameraman, sutradara, gaffer, sound engineer, dan asisten produksi berpengalaman siap sedia.",
    features: ["Sutradara", "Kameraman", "Gaffer"],
    /* Bento layout: hero card */
    grid: "md:col-span-3",
    hero: true,
  },
];

export default function Services() {
  return (
    <section id="services" className="scroll-mt-20 bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="mb-16 text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
            Layanan Kami
          </p>
          <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Apa yang Kami Tawarkan
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
            Dari sewa peralatan satuan hingga manajemen produksi skala besar,
            kami menangani setiap aspek kebutuhan multimedia Anda.
          </p>
        </motion.div>

        {/* ── Bento Grid ── */}
        <motion.div
          className="grid gap-4 sm:grid-cols-2 md:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={staggerChild}
                {...hoverTap}
                className={cn(
                  "group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 transition-all duration-300",
                  "glass glow-border",
                  service.grid,
                  service.hero
                    ? "min-h-[280px] md:min-h-[340px] md:p-8"
                    : "min-h-[200px]"
                )}
              >
                {/* Ambient glow — hero cards only */}
                {service.hero && (
                  <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/[0.07] blur-3xl" />
                )}

                {/* Top section */}
                <div>
                  {/* Icon */}
                  <div
                    className={cn(
                      "mb-4 flex items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent/20",
                      service.hero ? "h-14 w-14" : "h-11 w-11"
                    )}
                  >
                    <Icon
                      className={cn(
                        service.hero ? "h-7 w-7" : "h-5 w-5"
                      )}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className={cn(
                      "mb-2 font-heading font-semibold text-foreground",
                      service.hero ? "text-xl md:text-2xl" : "text-base"
                    )}
                  >
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={cn(
                      "leading-relaxed text-muted-foreground",
                      service.hero ? "mb-5 text-sm md:text-base" : "mb-4 text-xs"
                    )}
                  >
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="mb-4 flex flex-wrap gap-2">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className={cn(
                          "rounded-md bg-muted font-medium text-muted-foreground",
                          service.hero
                            ? "px-3 py-1 text-xs"
                            : "px-2 py-0.5 text-[11px]"
                        )}
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom — CTA link */}
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("pricelist");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                    setTimeout(() => {
                      window.location.hash = `pricelist-${service.pricelistTab}`;
                    }, 100);
                  }}
                  className={cn(
                    "inline-flex items-center gap-1 font-medium text-accent transition-colors hover:text-accent/80 cursor-pointer",
                    service.hero ? "text-sm" : "text-xs"
                  )}
                >
                  Lihat Harga
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>

                {/* Subtle bottom border glow on hover */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
