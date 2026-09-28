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
import {
  fadeUp,
  staggerContainer,
  staggerChild,
  hoverTap,
  viewportOnce,
} from "@/lib/motion";

const services = [
  {
    icon: Camera,
    title: "Sewa Kamera",
    pricelistTab: "Cameras",
    description:
      "Kamera profesional DSLR, mirrorless, dan cinema dari brand ternama seperti Sony, Canon, RED, dan Blackmagic.",
    features: ["4K/6K/8K Ready", "Full Frame", "Termasuk Lensa"],
  },
  {
    icon: Lightbulb,
    title: "Peralatan Lighting",
    pricelistTab: "Lighting",
    description:
      "Solusi pencahayaan lengkap dari LED panel, softbox, studio strobe, hingga setup HMI outdoor.",
    features: ["LED Panel", "Softbox Kit", "RGB Efek"],
  },
  {
    icon: Mic,
    title: "Peralatan Audio",
    pricelistTab: "Audio",
    description:
      "Sistem mikrofon wireless, boom kit, field recorder, dan peralatan monitoring audio profesional.",
    features: ["Wireless Lav", "Boom Kit", "Field Recorder"],
  },
  {
    icon: Video,
    title: "Produksi Video",
    pricelistTab: "Packages",
    description:
      "Layanan produksi video end-to-end termasuk shooting, editing, color grading, dan delivery.",
    features: ["Multi-Kamera", "Color Grading", "Delivery 4K"],
  },
  {
    icon: Film,
    title: "Pasca Produksi",
    pricelistTab: "Packages",
    description:
      "Editing profesional, motion graphics, VFX, sound design, dan mastering final untuk semua format.",
    features: ["Motion Graphics", "VFX", "Sound Design"],
  },
  {
    icon: Users,
    title: "Sewa Kru",
    pricelistTab: "Packages",
    description:
      "Kameraman, sutradara, gaffer, sound engineer, dan asisten produksi berpengalaman siap sedia.",
    features: ["Sutradara", "Kameraman", "Gaffer"],
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

        {/* Service Cards */}
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
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
                className="group relative rounded-xl border border-border/50 bg-card p-6 transition-colors duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
              >
                {/* Icon */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>

                {/* Title */}
                <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="mb-4 flex flex-wrap gap-2">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Link — navigates to #pricelist-{tab} which Pricelist listens to */}
                <a
                  href={`#pricelist-${service.pricelistTab}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/80"
                >
                  Lihat Harga
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
