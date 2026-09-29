/* ── Pricelist Data ── */

export const rentalCategories = [
  "Kamera",
  "Lensa",
  "Lighting",
  "Audio",
  "Support",
  "Kru",
  "Paket",
] as const;

export type RentalCategory = (typeof rentalCategories)[number];

export interface PriceItem {
  name: string;
  category: RentalCategory;
  pricePerDay: number;
  pricePerWeek: number;
  specs: string[];
  popular?: boolean;
}

/**
 * Maps each rental category to the contact-form service value
 * so the "Pesan via Form" button can auto-select the correct dropdown.
 */
export const categoryToServiceValue: Record<RentalCategory, string> = {
  Kamera: "camera-rental",
  Lensa: "camera-rental",
  Lighting: "lighting",
  Audio: "audio",
  Support: "camera-rental",
  Kru: "crew",
  Paket: "package",
};

export const priceItems: PriceItem[] = [
  // ── Kamera ──
  {
    name: "Sony A7S III",
    category: "Kamera",
    pricePerDay: 500_000,
    pricePerWeek: 2_800_000,
    specs: ["4K 120fps", "Full Frame", "Dual Card Slots"],
  },
  {
    name: "Canon EOS R5",
    category: "Kamera",
    pricePerDay: 600_000,
    pricePerWeek: 3_400_000,
    specs: ["8K RAW", "45MP", "IBIS"],
    popular: true,
  },
  {
    name: "RED Komodo 6K",
    category: "Kamera",
    pricePerDay: 1_500_000,
    pricePerWeek: 8_500_000,
    specs: ["6K Super 35", "R3D RAW", "Global Shutter"],
  },
  {
    name: "Blackmagic Pocket 6K Pro",
    category: "Kamera",
    pricePerDay: 450_000,
    pricePerWeek: 2_500_000,
    specs: ["6K Super 35", "BRAW", "Built-in ND"],
  },
  {
    name: "Sony FX6",
    category: "Kamera",
    pricePerDay: 900_000,
    pricePerWeek: 5_000_000,
    specs: ["4K 120fps", "Full Frame", "Dual Base ISO"],
    popular: true,
  },

  // ── Lensa ──
  {
    name: "Sony 24-70mm f/2.8 GM II",
    category: "Lensa",
    pricePerDay: 200_000,
    pricePerWeek: 1_100_000,
    specs: ["E-Mount", "f/2.8", "Weather Sealed"],
  },
  {
    name: "Canon RF 70-200mm f/2.8",
    category: "Lensa",
    pricePerDay: 250_000,
    pricePerWeek: 1_400_000,
    specs: ["RF Mount", "f/2.8", "IS"],
    popular: true,
  },
  {
    name: "Sigma 35mm f/1.4 Art",
    category: "Lensa",
    pricePerDay: 150_000,
    pricePerWeek: 800_000,
    specs: ["Multi-Mount", "f/1.4", "Art Series"],
  },
  {
    name: "Sony 85mm f/1.4 GM",
    category: "Lensa",
    pricePerDay: 200_000,
    pricePerWeek: 1_100_000,
    specs: ["E-Mount", "f/1.4", "Nano AR II"],
  },

  // ── Lighting ──
  {
    name: "Aputure 600d Pro",
    category: "Lighting",
    pricePerDay: 350_000,
    pricePerWeek: 2_000_000,
    specs: ["600W Daylight", "Bowens Mount", "App Control"],
    popular: true,
  },
  {
    name: "Nanlite Forza 300B",
    category: "Lighting",
    pricePerDay: 250_000,
    pricePerWeek: 1_400_000,
    specs: ["300W Bi-Color", "Bowens Mount", "Bluetooth"],
  },
  {
    name: "Godox SL200 II",
    category: "Lighting",
    pricePerDay: 150_000,
    pricePerWeek: 800_000,
    specs: ["200W Daylight", "Bowens Mount", "Silent Fan"],
  },
  {
    name: "Aputure MC Pro (4-set)",
    category: "Lighting",
    pricePerDay: 300_000,
    pricePerWeek: 1_700_000,
    specs: ["RGBWW", "Magnetic", "App Control"],
  },

  // ── Audio ──
  {
    name: "Rode Wireless PRO",
    category: "Audio",
    pricePerDay: 200_000,
    pricePerWeek: 1_100_000,
    specs: ["Dual Channel", "32-bit Float", "2 Transmitters"],
    popular: true,
  },
  {
    name: "Sennheiser MKH 416",
    category: "Audio",
    pricePerDay: 150_000,
    pricePerWeek: 800_000,
    specs: ["Shotgun Mic", "Super-Cardioid", "Industry Standard"],
  },
  {
    name: "Zoom F6 Recorder",
    category: "Audio",
    pricePerDay: 200_000,
    pricePerWeek: 1_100_000,
    specs: ["6-Channel", "32-bit Float", "Timecode"],
  },
  {
    name: "DPA 4060 Lav (pair)",
    category: "Audio",
    pricePerDay: 250_000,
    pricePerWeek: 1_400_000,
    specs: ["Omnidirectional", "Low Noise", "Miniature"],
  },

  // ── Support ──
  {
    name: "DJI RS 3 Pro",
    category: "Support",
    pricePerDay: 300_000,
    pricePerWeek: 1_700_000,
    specs: ["3-Axis Gimbal", "4.5kg Payload", "LiDAR Focus"],
    popular: true,
  },
  {
    name: "Sachtler Ace XL Tripod",
    category: "Support",
    pricePerDay: 100_000,
    pricePerWeek: 550_000,
    specs: ["Fluid Head", "75mm Bowl", "8kg Payload"],
  },
  {
    name: "DJI Mavic 3 Pro Drone",
    category: "Support",
    pricePerDay: 500_000,
    pricePerWeek: 2_800_000,
    specs: ["Hasselblad Cam", "4/3 CMOS", "43min Flight"],
  },
  {
    name: "Slider 120cm Motorized",
    category: "Support",
    pricePerDay: 200_000,
    pricePerWeek: 1_100_000,
    specs: ["Carbon Fiber", "App Control", "Time-Lapse"],
  },

  // ── Kru (per orang / per hari) ──
  {
    name: "Kameraman",
    category: "Kru",
    pricePerDay: 500_000,
    pricePerWeek: 2_800_000,
    specs: ["Operator Kamera", "5+ Tahun Pengalaman", "Per Orang"],
    popular: true,
  },
  {
    name: "Sutradara / Director",
    category: "Kru",
    pricePerDay: 1_500_000,
    pricePerWeek: 8_000_000,
    specs: ["Konsep Kreatif", "Directing Talent", "Shot List"],
  },
  {
    name: "Gaffer (Lighting Director)",
    category: "Kru",
    pricePerDay: 500_000,
    pricePerWeek: 2_800_000,
    specs: ["Setup Lighting", "Grip Equipment", "Per Orang"],
  },
  {
    name: "Sound Engineer",
    category: "Kru",
    pricePerDay: 500_000,
    pricePerWeek: 2_800_000,
    specs: ["Boom Operator", "Mixing On-Set", "Per Orang"],
  },
  {
    name: "Asisten Produksi",
    category: "Kru",
    pricePerDay: 350_000,
    pricePerWeek: 1_800_000,
    specs: ["Runner", "Setup & Breakdown", "Per Orang"],
  },
  {
    name: "Editor Video",
    category: "Kru",
    pricePerDay: 1_000_000,
    pricePerWeek: 5_500_000,
    specs: ["Premiere / DaVinci", "Revisi 2x", "Delivery H.264 + ProRes"],
    popular: true,
  },
  {
    name: "Colorist",
    category: "Kru",
    pricePerDay: 750_000,
    pricePerWeek: 4_000_000,
    specs: ["DaVinci Resolve", "LUT Custom", "Per Project"],
  },
  {
    name: "Motion Grapher / VFX",
    category: "Kru",
    pricePerDay: 1_200_000,
    pricePerWeek: 6_500_000,
    specs: ["After Effects", "3D Element", "Green Screen"],
  },

  // ── Paket (bundling alat + opsional crew) ──
  {
    name: "Paket Interview (Tanpa Crew)",
    category: "Paket",
    pricePerDay: 1_200_000,
    pricePerWeek: 6_500_000,
    specs: ["1 Sony A7S III", "2 LED Panel", "1 Wireless Mic"],
  },
  {
    name: "Paket Interview + 1 Crew",
    category: "Paket",
    pricePerDay: 1_700_000,
    pricePerWeek: 9_000_000,
    specs: ["1 Sony A7S III", "2 LED Panel", "1 Wireless Mic", "1 Kameraman"],
    popular: true,
  },
  {
    name: "Paket Video Pro (Tanpa Crew)",
    category: "Paket",
    pricePerDay: 3_500_000,
    pricePerWeek: 18_000_000,
    specs: ["2 Kamera + Lensa", "3-Point Lighting", "Full Audio Kit"],
  },
  {
    name: "Paket Video Pro + 2 Crew",
    category: "Paket",
    pricePerDay: 4_500_000,
    pricePerWeek: 24_000_000,
    specs: ["2 Kamera + Lensa", "3-Point Lighting", "Full Audio Kit", "2 Kameraman"],
    popular: true,
  },
  {
    name: "Paket Liputan Event (Tanpa Crew)",
    category: "Paket",
    pricePerDay: 2_500_000,
    pricePerWeek: 13_000_000,
    specs: ["2 Kamera", "On-Camera Light", "Wireless Audio"],
  },
  {
    name: "Paket Liputan Event + 2 Crew",
    category: "Paket",
    pricePerDay: 3_500_000,
    pricePerWeek: 18_000_000,
    specs: ["2 Kamera", "On-Camera Light", "Wireless Audio", "2 Kameraman"],
  },
  {
    name: "Paket Cinema Full Crew",
    category: "Paket",
    pricePerDay: 12_000_000,
    pricePerWeek: 65_000_000,
    specs: ["RED/ARRI Camera", "Cinema Lenses", "Full Grip & Electric", "Sutradara + 3 Crew"],
    popular: true,
  },
];
