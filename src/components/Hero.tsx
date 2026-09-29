"use client";

import { Play, ChevronDown, Star, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  staggerContainer,
  staggerChild,
  buttonPress,
  viewportOnce,
} from "@/lib/motion";
import { buildWaUrl } from "@/data/site-config";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background pt-16 scroll-mt-20"
    >
      {/* Cinematic Background */}
      <div className="pointer-events-none absolute inset-0">
        {/* Deep gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Primary amber glow — top right */}
        <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-accent/[0.07] blur-[150px]" />
        {/* Secondary amber glow — bottom left */}
        <div className="absolute -bottom-40 left-0 h-[500px] w-[500px] rounded-full bg-accent/[0.05] blur-[130px]" />
        {/* Subtle white radial — center for depth */}
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-white/[0.015] blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-8 animate-fade-in inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/[0.06] px-4 py-1.5 backdrop-blur-sm shadow-[0_0_20px_-4px_rgba(245,158,11,0.15)]">
            <Star className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            <span className="text-xs font-medium tracking-wide text-accent">
              DIPERCAYA 500+ KLIEN
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className="mb-6 max-w-4xl font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl animate-slide-up"
          >
            Sewa Peralatan{" "}
            <span className="relative">
              <span className="text-accent">Multimedia</span>
              <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-accent/30" />
            </span>
            <br />
            &amp; Jasa Produksi Profesional
          </h1>

          {/* Subheading */}
          <p
            className="mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg animate-slide-up"
            style={{ animationDelay: "0.15s" }}
          >
            Dari kamera, lighting, hingga kru produksi lengkap — kami
            menyediakan semua kebutuhan untuk mewujudkan visi kreatif Anda.
            Sewa peralatan profesional dengan harga kompetitif.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col items-center gap-4 sm:flex-row animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <motion.a
              href="#pricelist"
              {...buttonPress}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-8 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Lihat Daftar Harga
            </motion.a>
            <motion.a
              href={buildWaUrl("Halo MediaVendor Pro, saya ingin konsultasi tentang sewa alat / jasa produksi.")}
              target="_blank"
              rel="noopener noreferrer"
              {...buttonPress}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-600 px-8 text-sm font-semibold text-white transition-all hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Konsultasi WhatsApp
            </motion.a>
            <motion.a
              href="#portfolio"
              {...buttonPress}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-muted/50 px-8 text-sm font-medium text-foreground transition-all hover:border-accent/50 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Play className="h-4 w-4 text-accent" aria-hidden="true" />
              Portofolio Kami
            </motion.a>
          </div>

          {/* Stats */}
          <motion.div
            className="mt-16 grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {[
              { value: "500+", label: "Proyek" },
              { value: "150+", label: "Peralatan" },
              { value: "8+", label: "Tahun" },
              { value: "4.9", label: "Rating" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={staggerChild}
                className="glass glow-border flex flex-col items-center rounded-xl px-4 py-5"
              >
                <span className="font-heading text-2xl font-bold text-accent sm:text-3xl">
                  {stat.value}
                </span>
                <span className="mt-1 text-xs font-medium text-muted-foreground">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <a
        href="#services"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground transition-colors hover:text-accent"
        aria-label="Scroll to services"
      >
        <ChevronDown className="h-6 w-6" aria-hidden="true" />
      </a>
    </section>
  );
}
