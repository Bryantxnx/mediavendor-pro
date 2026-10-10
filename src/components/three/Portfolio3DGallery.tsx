"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Text } from "@react-three/drei";
import * as THREE from "three";
import type { PortfolioProject } from "@/data/portfolio";
import LazyCanvas from "./LazyCanvas";
import { use3DQuality } from "./use3DQuality";

/* ── Single photo card on a 3D plane ── */
interface PhotoCardProps {
  project: PortfolioProject;
  index: number;
  total: number;
  radius: number;
  onSelect: (project: PortfolioProject) => void;
}

function PhotoCard({ project, index, total, radius, onSelect }: PhotoCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  // Load texture
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      project.image,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        setTexture(tex);
      },
      undefined,
      () => {
        // Failed to load — leave texture null, show fallback color
      }
    );
    return () => {
      if (texture) texture.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.image]);

  // Arc position — spread cards along a semicircle
  const angle = useMemo(() => {
    const arcSpan = Math.PI * 0.8; // ~144 degrees
    const startAngle = -arcSpan / 2;
    return startAngle + (index / Math.max(total - 1, 1)) * arcSpan;
  }, [index, total]);

  const position = useMemo<[number, number, number]>(() => {
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius - radius;
    return [x, 0, z];
  }, [angle, radius]);

  // Card faces center
  const rotation = useMemo<[number, number, number]>(
    () => [0, angle, 0],
    [angle]
  );

  // Hover animation
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetScale = hovered ? 1.08 : 1.0;
    meshRef.current.scale.x = THREE.MathUtils.lerp(
      meshRef.current.scale.x,
      targetScale,
      delta * 5
    );
    meshRef.current.scale.y = THREE.MathUtils.lerp(
      meshRef.current.scale.y,
      targetScale,
      delta * 5
    );
    // Subtle float on Y
    const targetY = hovered ? 0.12 : 0;
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY,
      delta * 4
    );
  });

  // Card dimensions (16:9 aspect)
  const cardW = 2.2;
  const cardH = 1.24;

  return (
    <group position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(project);
        }}
      >
        <planeGeometry args={[cardW, cardH]} />
        {texture ? (
          <meshStandardMaterial
            map={texture}
            transparent
            opacity={hovered ? 1 : 0.88}
            side={THREE.FrontSide}
          />
        ) : (
          <meshStandardMaterial
            color="#172230"
            transparent
            opacity={0.7}
          />
        )}
      </mesh>

      {/* Amber border/frame */}
      <lineSegments position={[0, 0, 0.005]}>
        <edgesGeometry
          args={[new THREE.PlaneGeometry(cardW + 0.04, cardH + 0.04)]}
        />
        <lineBasicMaterial
          color="#F59E0B"
          transparent
          opacity={hovered ? 0.8 : 0.25}
        />
      </lineSegments>

      {/* Title label below card */}
      <Text
        position={[0, -(cardH / 2) - 0.14, 0.01]}
        fontSize={0.09}
        color={hovered ? "#F59E0B" : "#94a3b8"}
        anchorX="center"
        anchorY="top"
        maxWidth={cardW}
      >
        {project.title}
      </Text>

      {/* Category pill */}
      <Text
        position={[0, -(cardH / 2) - 0.28, 0.01]}
        fontSize={0.065}
        color="#F59E0B"
        anchorX="center"
        anchorY="top"
      >
        {project.client} · {project.year}
      </Text>
    </group>
  );
}

/* ── Rotating gallery group ── */
interface GalleryCarouselProps {
  projects: PortfolioProject[];
  onSelect: (project: PortfolioProject) => void;
}

function GalleryCarousel({ projects, onSelect }: GalleryCarouselProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const autoRotateRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Slow auto-rotate
    autoRotateRef.current += delta * 0.08;
    // Cursor offset adds parallax
    const targetY = autoRotateRef.current + pointer.x * 0.3;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      0.03
    );
    // Subtle vertical parallax
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      pointer.y * 0.08,
      0.03
    );
  });

  const radius = projects.length <= 3 ? 3.5 : 4.5;

  return (
    <group ref={groupRef}>
      {projects.map((project, i) => (
        <PhotoCard
          key={project.id}
          project={project}
          index={i}
          total={projects.length}
          radius={radius}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

/* ── Ambient particles ── */
function GalleryParticles({ count = 80 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#F59E0B"
        size={0.02}
        sizeAttenuation
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ══════════════════════════════════════════
 *  MAIN EXPORT
 * ══════════════════════════════════════════ */
interface Portfolio3DGalleryProps {
  projects: PortfolioProject[];
  onSelect: (project: PortfolioProject) => void;
}

export default function Portfolio3DGallery({
  projects,
  onSelect,
}: Portfolio3DGalleryProps) {
  const quality = use3DQuality();

  if (quality.skip3D || projects.length === 0) return null;

  return (
    <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[440px] rounded-2xl overflow-hidden bg-gradient-to-b from-accent/[0.02] to-transparent mb-10">
      <LazyCanvas
        cameraPosition={[0, 0.3, 4]}
        fov={45}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 3, 5]} intensity={0.6} />
        <directionalLight position={[-2, 1, 3]} intensity={0.2} color="#F59E0B" />
        <Environment preset="city" environmentIntensity={0.3} />

        <GalleryCarousel projects={projects} onSelect={onSelect} />
        <GalleryParticles count={quality.particleCount < 100 ? 40 : 80} />
      </LazyCanvas>

      {/* Drag hint */}
      <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
        <span className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-widest">
          Geser kursor untuk memutar · Klik foto untuk detail
        </span>
      </div>
    </div>
  );
}
