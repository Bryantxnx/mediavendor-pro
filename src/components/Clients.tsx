"use client";

import { clients } from "@/data/portfolio";
import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "@/lib/motion";

/* ── Component ── */

export default function Clients() {
  return (
    <section className="border-y border-border/30 bg-card/50 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Label */}
        <motion.p
          className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          Dipercaya oleh Korporat &amp; Instansi Pemerintah
        </motion.p>

        {/* Marquee container */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-card/50 to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-card/50 to-transparent sm:w-24" />

          {/* Scrolling track — two copies for seamless loop */}
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {[...clients, ...clients].map((client, idx) => (
              <div
                key={`${client.name}-${idx}`}
                className="group mx-3 flex w-56 shrink-0 flex-col items-center justify-center rounded-lg border border-transparent bg-transparent px-4 py-5 transition-all duration-300 hover:border-accent/20 hover:bg-accent/[0.04] sm:mx-5 sm:w-60"
              >
                {/* Logo image — dim & monochrome at rest, full color on hover */}
                <div className="mb-2 flex h-12 w-full items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="h-10 w-auto max-w-[160px] opacity-40 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground/40 transition-colors duration-300 group-hover:text-muted-foreground">
                  {client.subtitle}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
