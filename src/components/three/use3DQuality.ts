"use client";

import { useMemo } from "react";

/* ══════════════════════════════════════════
 *  GPU Tier Detection & Quality Settings
 *
 *  Detects device capability and returns
 *  appropriate quality settings for R3F Canvas.
 * ══════════════════════════════════════════ */

export type QualityTier = "low" | "medium" | "high";

export interface QualitySettings {
  tier: QualityTier;
  dpr: [number, number];
  antialias: boolean;
  particleCount: number;
  /** Whether to skip 3D entirely (very weak GPU / no WebGL) */
  skip3D: boolean;
}

function detectTier(): QualityTier {
  if (typeof window === "undefined") return "medium";

  // Check for WebGL support first
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    if (!gl) return "low";
  } catch {
    return "low";
  }

  // Mobile / tablet detection (touch + small screen → lower tier)
  const isMobile =
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 0 && window.innerWidth < 1024);

  if (isMobile) {
    // Small phones → low, tablets → medium
    return window.innerWidth < 768 ? "low" : "medium";
  }

  // Desktop — check GPU via WebGL renderer string
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;
        const rendererLower = renderer.toLowerCase();

        // Known weak GPUs
        if (
          rendererLower.includes("intel hd") ||
          rendererLower.includes("intel(r) hd") ||
          rendererLower.includes("mesa") ||
          rendererLower.includes("swiftshader") ||
          rendererLower.includes("llvmpipe")
        ) {
          return "low";
        }

        // Known strong GPUs
        if (
          rendererLower.includes("rtx") ||
          rendererLower.includes("radeon rx") ||
          rendererLower.includes("apple m") ||
          rendererLower.includes("geforce gtx 1") ||
          rendererLower.includes("geforce gtx 2")
        ) {
          return "high";
        }
      }
    }
  } catch {
    // Silently fall through
  }

  // Default desktop → medium
  return "medium";
}

const QUALITY_MAP: Record<QualityTier, QualitySettings> = {
  low: {
    tier: "low",
    dpr: [1, 1],
    antialias: false,
    particleCount: 60,
    skip3D: false,
  },
  medium: {
    tier: "medium",
    dpr: [1, 1.5],
    antialias: true,
    particleCount: 150,
    skip3D: false,
  },
  high: {
    tier: "high",
    dpr: [1, 2],
    antialias: true,
    particleCount: 300,
    skip3D: false,
  },
};

/**
 * Hook: returns quality settings based on detected GPU tier.
 * Memoized — only runs detection once per mount.
 */
export function use3DQuality(): QualitySettings {
  return useMemo(() => {
    const tier = detectTier();
    const settings = QUALITY_MAP[tier];

    // Check reduced motion preference
    if (typeof window !== "undefined") {
      try {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          return { ...settings, skip3D: true };
        }
      } catch {
        // ignore
      }
    }

    return settings;
  }, []);
}
