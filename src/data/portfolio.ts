/* ── Portfolio Data ── */

export interface PortfolioProject {
  id: string;
  title: string;
  client: string;
  category: "Video" | "Event" | "Commercial";
  image: string;
  scope: string[];
  year: number;
  description: string;
  details: string;
}

export const portfolioCategories = [
  "Semua",
  "Video",
  "Event",
  "Commercial",
] as const;

export type PortfolioCategory = (typeof portfolioCategories)[number];

export const projects: PortfolioProject[] = [
  {
    id: "pertamina-energy-forum",
    title: "Pertamina Energy Forum & Gala",
    client: "Pertamina",
    category: "Event",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop&q=80",
    // TODO: ganti ke /images/portfolio/pertamina-energy-forum.webp
    scope: [
      "Multi-cam broadcast (6 kamera sinema)",
      "Sistem LED indoor",
      "Live switching & highlight reel",
    ],
    year: 2024,
    description:
      "Multi-cam broadcast & sistem LED indoor untuk forum energi nasional.",
    details:
      "Setup broadcast multi-kamera lengkap dengan 6 kamera sinema, sistem LED wall indoor, live switching, dan highlight reel pasca-acara. Liputan mencakup sesi keynote, diskusi panel, dan gala dinner dengan 800+ peserta.",
  },
  {
    id: "bappenas-national-forum",
    title: "Forum Pembangunan Nasional Bappenas",
    client: "Bappenas RI",
    category: "Event",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=500&fit=crop&q=80",
    // TODO: ganti ke /images/portfolio/bappenas-forum.webp
    scope: [
      "Sistem audio konferensi 32 channel",
      "Live streaming 4 kamera",
      "Interpretasi simultan",
    ],
    year: 2024,
    description:
      "Sistem audio konferensi & live streaming untuk forum perencanaan nasional.",
    details:
      "Sistem audio konferensi lengkap dengan 32 channel wireless microphone, live streaming 4 kamera ke YouTube dan platform internal, overlay grafis real-time, serta dukungan interpretasi simultan untuk delegasi internasional.",
  },
  {
    id: "pocari-sweat-activation",
    title: "Pocari Sweat Sport Activation",
    client: "Pocari Sweat",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1461896836934-bbe910c4d466?w=800&h=500&fit=crop&q=80",
    // TODO: ganti ke /images/portfolio/pocari-sweat-activation.webp
    scope: [
      "Kamera high-speed Phantom 1000fps",
      "Dynamic tracking rig & gimbal",
      "Footage drone sinematik",
    ],
    year: 2023,
    description:
      "Kamera high-speed & dynamic tracking footage untuk kampanye olahraga.",
    details:
      "Pengambilan gambar high-speed dengan kamera Phantom pada 1000fps menangkap gerakan atletik untuk TVC dan kampanye digital. Dikombinasikan dengan dynamic camera tracking rig, sistem gimbal, dan footage drone untuk video aktivasi olahraga sinematik.",
  },
  {
    id: "golf-invitational",
    title: "Indonesian Golf Invitational",
    client: "Golf Open Tournament",
    category: "Video",
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&h=500&fit=crop&q=80",
    // TODO: ganti ke /images/portfolio/golf-invitational.webp
    scope: [
      "Sinematografi drone multi-hari",
      "Live video feed wireless",
      "Highlight package harian",
    ],
    year: 2023,
    description:
      "Sinematografi drone & live green feed untuk liputan turnamen golf.",
    details:
      "Sinematografi drone multi-hari meliputi 18 hole championship course. Live video feed dari setiap green dengan sistem transmisi wireless, tracking pemain multi-kamera, dan paket highlight harian untuk sponsor dan mitra media.",
  },
  {
    id: "bumn-synergy-showcase",
    title: "BUMN Synergy Showcase",
    client: "Kementerian BUMN",
    category: "Event",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=500&fit=crop&q=80",
    // TODO: ganti ke /images/portfolio/bumn-synergy-showcase.webp
    scope: [
      "Stage lighting programmable LED",
      "Projection video mapping 20m",
      "Produksi live 8 kamera",
    ],
    year: 2024,
    description:
      "Full stage lighting & video mapping untuk showcase nasional BUMN.",
    details:
      "Produksi panggung berskala besar dengan lighting LED programmable, projection video mapping pada backdrop panggung 20m, produksi live 8 kamera, dan integrasi grafis real-time. Acara dihadiri menteri dan 2000+ perwakilan BUMN.",
  },
  {
    id: "commercial-tvc-launch",
    title: "Peluncuran TVC Komersial",
    client: "Brand Fashion & Beverage",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1579965342575-16428a7c8881?w=800&h=500&fit=crop&q=80",
    // TODO: ganti ke /images/portfolio/commercial-tvc-launch.webp
    scope: [
      "Shooting sinema RED V-Raptor 8K",
      "Lensa anamorfik Cooke",
      "Post-produksi lengkap (color grading, VFX, sound design)",
    ],
    year: 2023,
    description:
      "Shooting sinema 4K & color grading untuk TVC televisi nasional.",
    details:
      "Produksi sinema lengkap dengan RED V-Raptor 8K, lensa anamorfik Cooke, shooting 3 hari di studio dan outdoor. Post-produksi lengkap termasuk color grading di DaVinci Resolve, compositing VFX, sound design, dan delivery dalam berbagai format untuk TV, digital, dan cinema pre-roll.",
  },
];

/* ── Client Logo Data ── */

export interface ClientLogo {
  name: string;
  subtitle: string;
  logo: string;
}

export const clients: ClientLogo[] = [
  { name: "Pertamina", subtitle: "Energy & Oil BUMN", logo: "/logos/pertamina.jpg" },
  { name: "Bappenas RI", subtitle: "Perencanaan Pembangunan Nasional", logo: "/logos/bappenas.png" },
  { name: "Kementerian BUMN", subtitle: "BUMN Untuk Indonesia", logo: "/logos/kemen-bumn.png" },
  { name: "Pocari Sweat", subtitle: "PT Amerta Indah Otsuka", logo: "/logos/pocari-sweat.svg" },
  { name: "Kementerian Keuangan", subtitle: "Republik Indonesia", logo: "/logos/kemenkeu.png" },
  { name: "Kementerian Pariwisata", subtitle: "Republik Indonesia", logo: "/logos/kemenpar.png" },
  { name: "BNI", subtitle: "Bank Negara Indonesia", logo: "/logos/bni.png" },
  { name: "Kemenpora", subtitle: "Pemuda dan Olahraga RI", logo: "/logos/kemenpora.png" },
];
