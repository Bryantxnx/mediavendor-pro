import { Play, ChevronDown, Star } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background pt-16 scroll-mt-20"
    >
      {/* Cinematic Background Grid */}
      <div className="pointer-events-none absolute inset-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Amber glow - top right */}
        <div className="absolute -top-32 right-0 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />
        {/* Amber glow - bottom left */}
        <div className="absolute -bottom-32 left-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-8 animate-fade-in inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5">
            <Star className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            <span className="text-xs font-medium tracking-wide text-accent">
              TRUSTED BY 500+ CLIENTS
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className="mb-6 max-w-4xl font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl animate-slide-up"
          >
            Premium Multimedia{" "}
            <span className="relative">
              <span className="text-accent">Equipment</span>
              <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-accent/30" />
            </span>
            <br />
            &amp; Production Services
          </h1>

          {/* Subheading */}
          <p
            className="mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg animate-slide-up"
            style={{ animationDelay: "0.15s" }}
          >
            From cameras and lighting to full production crews - we provide
            everything you need to bring your creative vision to life. Rent
            professional gear at competitive prices.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col items-center gap-4 sm:flex-row animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <a
              href="#pricelist"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-8 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              View Pricelist
            </a>
            <a
              href="#portfolio"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-muted/50 px-8 text-sm font-medium text-foreground transition-all hover:border-accent/50 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Play className="h-4 w-4 text-accent" aria-hidden="true" />
              Our Work
            </a>
          </div>

          {/* Stats */}
          <div
            className="mt-16 grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4 animate-slide-up"
            style={{ animationDelay: "0.45s" }}
          >
            {[
              { value: "500+", label: "Projects" },
              { value: "150+", label: "Equipment" },
              { value: "8+", label: "Years" },
              { value: "4.9", label: "Rating" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center rounded-lg border border-border/50 bg-card/50 px-4 py-4 backdrop-blur-sm"
              >
                <span className="font-heading text-2xl font-bold text-accent sm:text-3xl">
                  {stat.value}
                </span>
                <span className="mt-1 text-xs font-medium text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
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
