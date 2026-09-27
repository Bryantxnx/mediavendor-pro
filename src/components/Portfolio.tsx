"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Play, ExternalLink, X } from "lucide-react";

const categories = ["All", "Video", "Event", "Commercial"] as const;
type Category = (typeof categories)[number];

interface Project {
  title: string;
  category: Exclude<Category, "All">;
  client: string;
  description: string;
  image: string;
  details: string;
}

const projects: Project[] = [
  {
    title: "Pertamina Energy Forum & Gala",
    category: "Event",
    client: "Pertamina",
    description: "Multi-cam broadcast & indoor LED system for national energy forum.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop&q=80",
    details:
      "Full multi-camera broadcast setup with 6 cinema cameras, indoor LED wall system, live switching, and post-event highlight reel. Coverage included keynote sessions, panel discussions, and gala dinner with 800+ attendees.",
  },
  {
    title: "Bappenas National Development Forum",
    category: "Event",
    client: "Bappenas RI",
    description: "Audio conference & live streaming setup for national planning forum.",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=500&fit=crop&q=80",
    details:
      "Complete audio conference system with 32-channel wireless microphones, 4-camera live streaming to YouTube and internal platforms, real-time graphics overlay, and simultaneous interpretation support for international delegates.",
  },
  {
    title: "Pocari Sweat Sport Activation",
    category: "Commercial",
    client: "Pocari Sweat",
    description: "High-speed camera & dynamic tracking footage for sport campaign.",
    image: "https://images.unsplash.com/photo-1461896836934-bbe910c4d466?w=800&h=500&fit=crop&q=80",
    details:
      "High-speed Phantom camera shoot at 1000fps capturing athletic movements for TVC and digital campaign. Combined with dynamic camera tracking rigs, gimbal systems, and drone footage for a cinematic sport activation video.",
  },
  {
    title: "Indonesian Golf Invitational",
    category: "Video",
    client: "Golf Open Tournament",
    description: "Drone cinematography & live green feed for golf tournament coverage.",
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&h=500&fit=crop&q=80",
    details:
      "Multi-day drone cinematography covering 18-hole championship course. Live video feed from every green with wireless transmission system, multi-camera player tracking, and same-day highlight packages for sponsors and media partners.",
  },
  {
    title: "BUMN Synergy Showcase",
    category: "Event",
    client: "Kementerian BUMN",
    description: "Full stage lighting & video mapping for BUMN national showcase.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=500&fit=crop&q=80",
    details:
      "Large-scale stage production with programmable LED lighting, projection video mapping on 20m stage backdrop, 8-camera live production, and real-time graphics integration. Event attended by ministers and 2000+ BUMN representatives.",
  },
  {
    title: "Commercial TVC Launch",
    category: "Commercial",
    client: "Fashion & Beverage Brand",
    description: "4K Cinema shooting & color grading for national TV commercial.",
    image: "https://images.unsplash.com/photo-1579965342575-16428a7c8881?w=800&h=500&fit=crop&q=80",
    details:
      "Full cinema production with RED V-Raptor 8K, Cooke anamorphic lenses, 3-day studio and outdoor shoot. Complete post-production including color grading in DaVinci Resolve, VFX compositing, sound design, and delivery in multiple formats for TV, digital, and cinema pre-roll.",
  },
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [modalProject, setModalProject] = useState<Project | null>(null);

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const closeModal = useCallback(() => setModalProject(null), []);

  // Close on ESC
  useEffect(() => {
    if (!modalProject) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    document.addEventListener("keydown", onKey);
    // Prevent body scroll
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
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
            Karya Kami
          </p>
          <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Portofolio Unggulan
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
            Proyek nyata yang telah kami kerjakan untuk BUMN, instansi pemerintah,
            dan brand ternama di seluruh Indonesia.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring cursor-pointer",
                activeCategory === cat
                  ? "bg-accent text-accent-foreground"
                  : "border border-border bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <button
              key={project.title}
              type="button"
              onClick={() => setModalProject(project)}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-border/50 bg-background text-left transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:bg-black/10" />
                {/* Play / View button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    {project.category === "Video" ||
                    project.category === "Commercial" ? (
                      <Play
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    ) : (
                      <ExternalLink
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </div>
                {/* Category badge */}
                <span className="absolute right-3 top-3 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                  {project.category}
                </span>
              </div>

              {/* Content */}
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
            </button>
          ))}
        </div>
      </div>

      {/* ─── Modal / Lightbox ─── */}
      {modalProject && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label={modalProject.title}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 cursor-pointer"
              aria-label="Close preview"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            {/* Image */}
            <div className="relative aspect-video w-full">
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

            {/* Content */}
            <div className="p-6">
              <span className="mb-2 inline-block rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                {modalProject.category}
              </span>
              <h3 className="mb-1 font-heading text-xl font-bold text-foreground">
                {modalProject.title}
              </h3>
              <p className="mb-3 text-sm font-medium text-accent">
                Klien: {modalProject.client}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {modalProject.details}
              </p>

              {/* CTA */}
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/6285122979535?text=${encodeURIComponent(`Halo MediaVendor Pro, saya tertarik dengan proyek seperti \"${modalProject.title}\". Bisa konsultasi lebih lanjut?`)}`}
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
          </div>
        </div>
      )}
    </section>
  );
}
