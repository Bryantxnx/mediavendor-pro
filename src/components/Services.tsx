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

const services = [
  {
    icon: Camera,
    title: "Camera Rental",
    pricelistTab: "Cameras",
    description:
      "Professional DSLR, mirrorless, and cinema cameras from top brands like Sony, Canon, RED, and Blackmagic.",
    features: ["4K/6K/8K Ready", "Full Frame Sensors", "Lens Kits Included"],
  },
  {
    icon: Lightbulb,
    title: "Lighting Setup",
    pricelistTab: "Lighting",
    description:
      "Complete lighting solutions from LED panels, softboxes, and studio strobes to outdoor HMI setups.",
    features: ["LED Panels", "Softbox Kits", "RGB Effects"],
  },
  {
    icon: Mic,
    title: "Audio Equipment",
    pricelistTab: "Audio",
    description:
      "Wireless microphone systems, boom kits, field recorders, and professional audio monitoring gear.",
    features: ["Wireless Lavs", "Boom Kits", "Field Recorders"],
  },
  {
    icon: Video,
    title: "Video Production",
    pricelistTab: "Packages",
    description:
      "End-to-end video production services including shooting, editing, color grading, and delivery.",
    features: ["Multi-Camera", "Color Grading", "4K Delivery"],
  },
  {
    icon: Film,
    title: "Post Production",
    pricelistTab: "Packages",
    description:
      "Professional editing, motion graphics, VFX, sound design, and final mastering for all formats.",
    features: ["Motion Graphics", "VFX", "Sound Design"],
  },
  {
    icon: Users,
    title: "Crew Hiring",
    pricelistTab: "Packages",
    description:
      "Experienced cameramen, directors, gaffers, sound engineers, and production assistants on demand.",
    features: ["Directors", "Cameramen", "Gaffers"],
  },
];

export default function Services() {
  return (
    <section id="services" className="scroll-mt-20 bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
            What We Offer
          </p>
          <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Services
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
            From single equipment rental to full-scale production management, we
            cover every aspect of your multimedia needs.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group relative rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
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
                  View Pricing
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
