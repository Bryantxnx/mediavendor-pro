"use client";

import React, { useRef, useState, useEffect, Suspense, Component } from "react";
import { Canvas } from "@react-three/fiber";
import { use3DQuality } from "./use3DQuality";
import * as THREE from "three";

/* ══════════════════════════════════════════
 *  Error Boundary — catches 3D crashes silently
 *  so the rest of the page keeps working
 * ══════════════════════════════════════════ */
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}

class Canvas3DErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    // Log silently — don't crash the page
    console.warn("[3D] Canvas error caught:", error.message);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

/* ══════════════════════════════════════════
 *  LazyCanvas — performance-aware R3F Canvas
 *
 *  1. Only renders when visible (IntersectionObserver)
 *  2. Auto-adapts DPR + antialias based on GPU tier
 *  3. Skips entirely if prefers-reduced-motion or no WebGL
 *  4. Error boundary — 3D crash won't kill the page
 *  5. Transparent background, alpha enabled
 * ══════════════════════════════════════════ */

interface LazyCanvasProps {
  children: React.ReactNode;
  /** CSS class for the wrapper div */
  className?: string;
  /** Inline style for the wrapper div */
  style?: React.CSSProperties;
  /** Camera position [x, y, z] */
  cameraPosition?: [number, number, number];
  /** Camera FOV */
  fov?: number;
  /** Fallback while loading / offscreen */
  fallback?: React.ReactNode;
  /** Root margin for IntersectionObserver (default "200px") */
  rootMargin?: string;
}

export default function LazyCanvas({
  children,
  className,
  style,
  cameraPosition = [0, 0, 5],
  fov = 50,
  fallback = null,
  rootMargin = "200px",
}: LazyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const quality = use3DQuality();

  // IntersectionObserver — only mount Canvas when in/near viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  // Skip 3D entirely if reduced motion or no WebGL
  if (quality.skip3D) {
    return (
      <div ref={containerRef} className={className} style={style}>
        {fallback}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className} style={style}>
      {isVisible ? (
        <Canvas3DErrorBoundary fallback={fallback}>
          <Suspense fallback={fallback}>
            <Canvas
              dpr={quality.dpr}
              camera={{ position: cameraPosition, fov }}
              gl={{
                alpha: true,
                antialias: quality.antialias,
                powerPreference: "high-performance",
              }}
              onCreated={(state) => {
                state.gl.setClearColor(new THREE.Color(0x000000), 0);
              }}
              style={{ width: "100%", height: "100%" }}
              frameloop={isVisible ? "always" : "never"}
            >
              {children}
            </Canvas>
          </Suspense>
        </Canvas3DErrorBoundary>
      ) : (
        fallback
      )}
    </div>
  );
}
