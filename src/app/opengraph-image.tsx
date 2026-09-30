import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Media Vendor Pro — Sewa Alat Multimedia & Jasa Produksi Profesional";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0a0f1a 0%, #172230 50%, #0a0f1a 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Amber accent bar top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "#F59E0B",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0 60px",
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-1px",
              lineHeight: 1.1,
            }}
          >
            MEDIA VENDOR
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "#F59E0B",
              letterSpacing: "6px",
              marginTop: 4,
            }}
          >
            PRO ENTERPRISE
          </div>

          <div
            style={{
              width: 80,
              height: 3,
              background: "#F59E0B",
              borderRadius: 2,
              marginTop: 32,
              marginBottom: 32,
            }}
          />

          <div
            style={{
              fontSize: 24,
              color: "#94a3b8",
              textAlign: "center",
              lineHeight: 1.5,
              maxWidth: 700,
            }}
          >
            Sewa Peralatan Multimedia & Jasa Produksi Video Profesional
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: 48,
              marginTop: 40,
            }}
          >
            {[
              { num: "500+", label: "Proyek" },
              { num: "150+", label: "Peralatan" },
              { num: "8+", label: "Tahun" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: 36, fontWeight: 800, color: "#F59E0B" }}>
                  {s.num}
                </div>
                <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 48,
            background: "rgba(23,34,48,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 14, color: "#94a3b8" }}>
            mediavendorpro.my.id
          </div>
          <div style={{ fontSize: 14, color: "#475569" }}>•</div>
          <div style={{ fontSize: 14, color: "#94a3b8" }}>
            Jakarta, Indonesia
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
