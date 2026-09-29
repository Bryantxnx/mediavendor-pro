"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Play, ExternalLink, X } from "lucide-react";
import {
  fadeUp,
  staggerContainer,
  staggerChild,
  scaleFade,
  backdropFade,
  hoverTap,
  viewportOnce,
} from "@/lib/motion";
import {
  projects,
  portfolioCategories,
  type PortfolioProject,
  type PortfolioCategory,
} from "@/data/portfolio";
import { buildWaUrl } from "@/data/site-config";

export default function Portfolio() {
  const [activeCategory, setActiveCategory] =
    useState<PortfolioCategory>("Semua");
  const [modalProject, setModalProject] = useState<PortfolioProject | null>(
    null
  );

  const filtered =
    activeCategory === "Semua"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const closeModal = useCallback(() => setModalProject(null), []);

  useEffect(() => {
    if (!modalProject) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modalProject, closeModal]);

  return (
    <section id="portfolio" className="scroll-mt-20 bg-card py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="mb-12 text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
            Karya Kami
          </p>
          <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Portofolio Unggulan
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
            Proyek nyata yang telah kami kerjakan untuk BUMN, instansi
            pemerintah, dan brand ternama di seluruh Indonesia.
          </p>
        </motion.div>

        {/* Filter Tabs with layoutId indicator */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {portfolioCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "relative rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring cursor-pointer",
                activeCategory === cat
                  ? "text-accent-foreground"
                  : "border border-border bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {activeCategory === cat && (
                <motion.span
                  layoutId="portfolio-tab"
                  className="absolute inset-0 rounded-md bg-accent"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  style={{ zIndex: -1 }}
                />
              )}
              {cat}
            </button>
          ))}
        </div>

        {/* Project Grid with stagger */}
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          key={activeCategory}
        >
          {filtered.map((project) => (
            <motion.button
              key={project.id}
              type="button"
              onClick={() => setModalProject(project)}
              variants={staggerChild}
              {...hoverTap}
              className="group relative cursor-pointer overflow-hidden rounded-xl text-left transition-all duration-300 glass glow-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <div className="relative w-full aspect-video overflow-hidden rounded-t-xl">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:bg-black/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    {project.category === "Video" ||
                    project.category === "Commercial" ? (
                      <Play className="h-5 w-5 text-white" aria-hidden="true" />
                    ) : (
                      <ExternalLink className="h-5 w-5 text-white" aria-hidden="true" />
                    )}
                  </div>
                </div>
                <span className="absolute right-3 top-3 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                  {project.category} &middot; {project.year}
                </span>
              </div>
              <div className="p-4">
                <h3 className="mb-1 font-heading text-sm font-semibold text-foreground">
                  {project.title}
                </h3>
                <p className="mb-2 text-xs font-medium text-accent">
                  {project.client}
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* ─── Modal with AnimatePresence ─── */}
      <AnimatePresence>
        {modalProject && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-label={modalProject.title}
            variants={backdropFade}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="relative w-full max-w-3xl overflow-hidden rounded-2xl glass shadow-2xl shadow-black/50"
              onClick={(e) => e.stopPropagation()}
              variants={scaleFade}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button
                type="button"
                onClick={closeModal}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 cursor-pointer"
                aria-label="Tutup pratinjau"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>

              <div className="relative w-full aspect-video overflow-hidden">
                <Image
                  src={modalProject.image}
                  alt={modalProject.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>

              <div className="p-6">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="inline-block rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                    {modalProject.category}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {modalProject.year}
                  </span>
                </div>
                <h3 className="mb-1 font-heading text-xl font-bold text-foreground">
                  {modalProject.title}
                </h3>
                <p className="mb-3 text-sm font-medium text-accent">
                  Klien: {modalProject.client}
                </p>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {modalProject.details}
                </p>

                <div className="mb-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Lingkup Pekerjaan
                  </p>
                  <ul className="space-y-1">
                    {modalProject.scope.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={buildWaUrl(`Halo MediaVendor Pro, saya tertarik dengan proyek seperti \"${modalProject.title}\". Bisa konsultasi lebih lanjut?`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground transition-all hover:brightness-110"
                  >
                    Diskusikan Proyek Serupa
                  </a>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-md border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
