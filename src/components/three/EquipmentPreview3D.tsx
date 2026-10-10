"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import LazyCanvas from "./LazyCanvas";
import { use3DQuality } from "./use3DQuality";

/* ── Shared amber material ── */
function useAmberMaterial(opts?: { emissiveIntensity?: number }) {
  return useMemo(
    () => ({
      color: "#F59E0B",
      metalness: 0.75,
      roughness: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      emissive: "#F59E0B",
      emissiveIntensity: opts?.emissiveIntensity ?? 0.06,
      envMapIntensity: 1.0,
    }),
    [opts?.emissiveIntensity]
  );
}

function useDarkMaterial() {
  return useMemo(
    () => ({
      color: "#1a1a2e",
      metalness: 0.9,
      roughness: 0.25,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
    }),
    []
  );
}

/* ── Auto-rotate + cursor parallax wrapper ── */
function EquipmentWrapper({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.3;
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      pointer.x * 0.15,
      0.04
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      pointer.y * 0.1,
      0.04
    );
  });

  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={0.3}>
      <group ref={groupRef}>{children}</group>
    </Float>
  );
}

/* ══════════════════════════════════════════
 *  PROCEDURAL MODELS — 7 categories
 * ══════════════════════════════════════════ */

/* ── Kamera: DSLR body + lens barrel ── */
function CameraModel() {
  const amber = useAmberMaterial();
  const dark = useDarkMaterial();
  return (
    <EquipmentWrapper>
      <group position={[0, 0, 0]}>
        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 0.85, 0.7]} />
          <meshPhysicalMaterial {...dark} />
        </mesh>
        {/* Prism hump */}
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[0.5, 0.3, 0.5]} />
          <meshPhysicalMaterial {...dark} />
        </mesh>
        {/* Lens barrel */}
        <mesh position={[0, -0.05, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 0.6, 32]} />
          <meshPhysicalMaterial {...amber} />
        </mesh>
        {/* Front glass element */}
        <mesh position={[0, -0.05, 0.92]}>
          <circleGeometry args={[0.28, 32]} />
          <meshPhysicalMaterial
            color="#0a0a1a"
            metalness={1}
            roughness={0}
            clearcoat={1}
            transparent
            opacity={0.7}
          />
        </mesh>
        {/* Grip texture line */}
        <mesh position={[0.62, -0.05, 0]}>
          <boxGeometry args={[0.04, 0.6, 0.55]} />
          <meshPhysicalMaterial {...amber} emissiveIntensity={0.12} />
        </mesh>
      </group>
    </EquipmentWrapper>
  );
}

/* ── Lensa: Prime lens with focus ring ── */
function LensModel() {
  const amber = useAmberMaterial();
  const dark = useDarkMaterial();
  return (
    <EquipmentWrapper>
      <group rotation={[Math.PI / 2, 0, 0]}>
        {/* Main barrel */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.45, 0.4, 1.2, 32]} />
          <meshPhysicalMaterial {...dark} />
        </mesh>
        {/* Focus ring */}
        <mesh position={[0, 0.15, 0]}>
          <torusGeometry args={[0.46, 0.04, 16, 48]} />
          <meshPhysicalMaterial {...amber} />
        </mesh>
        {/* Secondary ring */}
        <mesh position={[0, -0.2, 0]}>
          <torusGeometry args={[0.44, 0.025, 16, 48]} />
          <meshPhysicalMaterial {...amber} emissiveIntensity={0.1} />
        </mesh>
        {/* Front element */}
        <mesh position={[0, 0.61, 0]} rotation={[0, 0, 0]}>
          <circleGeometry args={[0.38, 32]} />
          <meshPhysicalMaterial
            color="#0a0a2a"
            metalness={1}
            roughness={0}
            clearcoat={1}
            transparent
            opacity={0.6}
          />
        </mesh>
        {/* Hood */}
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.5, 0.47, 0.25, 32, 1, true]} />
          <meshPhysicalMaterial {...dark} side={THREE.DoubleSide} />
        </mesh>
        {/* Mount ring */}
        <mesh position={[0, -0.61, 0]}>
          <torusGeometry args={[0.35, 0.03, 16, 48]} />
          <meshPhysicalMaterial color="#888" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </EquipmentWrapper>
  );
}

/* ── Lighting: LED Panel on bracket ── */
function LightingModel() {
  const amber = useAmberMaterial({ emissiveIntensity: 0.15 });
  const dark = useDarkMaterial();
  return (
    <EquipmentWrapper>
      <group>
        {/* Panel face */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[1.3, 0.9, 0.08]} />
          <meshPhysicalMaterial {...amber} />
        </mesh>
        {/* Panel back housing */}
        <mesh position={[0, 0.3, -0.08]}>
          <boxGeometry args={[1.25, 0.85, 0.06]} />
          <meshPhysicalMaterial {...dark} />
        </mesh>
        {/* Diffusion grid (front) */}
        {Array.from({ length: 3 }).map((_, row) =>
          Array.from({ length: 4 }).map((_, col) => (
            <mesh
              key={`${row}-${col}`}
              position={[
                -0.45 + col * 0.3,
                0.1 + row * 0.25,
                0.045,
              ]}
            >
              <boxGeometry args={[0.2, 0.16, 0.01]} />
              <meshPhysicalMaterial
                color="#FCD34D"
                emissive="#F59E0B"
                emissiveIntensity={0.4}
                transparent
                opacity={0.8}
              />
            </mesh>
          ))
        )}
        {/* Bracket arm */}
        <mesh position={[0, -0.2, -0.05]}>
          <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
          <meshPhysicalMaterial color="#555" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Yoke */}
        <mesh position={[0, -0.4, -0.05]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
          <meshPhysicalMaterial color="#555" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Spigot */}
        <mesh position={[0, -0.55, -0.05]}>
          <cylinderGeometry args={[0.035, 0.035, 0.3, 8]} />
          <meshPhysicalMaterial color="#444" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>
    </EquipmentWrapper>
  );
}

/* ── Audio: Condenser mic on mount ── */
function AudioModel() {
  const amber = useAmberMaterial();
  const dark = useDarkMaterial();
  return (
    <EquipmentWrapper>
      <group>
        {/* Mic body */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 1.0, 32]} />
          <meshPhysicalMaterial {...dark} />
        </mesh>
        {/* Gold grille (top capsule) */}
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial {...amber} />
        </mesh>
        <mesh position={[0, 0.75, 0]}>
          <cylinderGeometry args={[0.2, 0.15, 0.15, 32]} />
          <meshPhysicalMaterial {...amber} />
        </mesh>
        {/* Ring accent */}
        <mesh position={[0, 0.5, 0]}>
          <torusGeometry args={[0.16, 0.015, 16, 32]} />
          <meshPhysicalMaterial {...amber} emissiveIntensity={0.12} />
        </mesh>
        {/* Shock mount ring */}
        <mesh position={[0, -0.15, 0]}>
          <torusGeometry args={[0.28, 0.025, 16, 32]} />
          <meshPhysicalMaterial color="#555" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Mount cradle bands */}
        {[-0.08, 0.08].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <torusGeometry args={[0.25, 0.012, 16, 32]} />
            <meshPhysicalMaterial color="#666" metalness={0.7} roughness={0.35} />
          </mesh>
        ))}
        {/* Stand connector */}
        <mesh position={[0, -0.45, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.35, 16]} />
          <meshPhysicalMaterial color="#444" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>
    </EquipmentWrapper>
  );
}

/* ── Support: Tripod ── */
function SupportModel() {
  const amber = useAmberMaterial();
  const dark = useDarkMaterial();
  const legAngle = (Math.PI * 2) / 3;
  return (
    <EquipmentWrapper>
      <group>
        {/* Head plate */}
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.2, 0.18, 0.1, 32]} />
          <meshPhysicalMaterial {...amber} />
        </mesh>
        {/* Ball head */}
        <mesh position={[0, 0.82, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshPhysicalMaterial {...amber} emissiveIntensity={0.1} />
        </mesh>
        {/* Center column */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.9, 12]} />
          <meshPhysicalMaterial {...dark} />
        </mesh>
        {/* Collar */}
        <mesh position={[0, 0.0, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 0.12, 16]} />
          <meshPhysicalMaterial {...dark} />
        </mesh>
        {/* 3 Legs */}
        {[0, 1, 2].map((i) => {
          const angle = i * legAngle;
          const legLen = 1.1;
          const spread = 0.45;
          return (
            <group key={i} rotation={[0, angle, 0]}>
              {/* Upper leg */}
              <mesh
                position={[spread * 0.5, -0.25, 0]}
                rotation={[0, 0, -0.42]}
              >
                <cylinderGeometry args={[0.03, 0.025, legLen * 0.55, 8]} />
                <meshPhysicalMaterial {...dark} />
              </mesh>
              {/* Lower leg */}
              <mesh
                position={[spread * 0.85, -0.6, 0]}
                rotation={[0, 0, -0.42]}
              >
                <cylinderGeometry args={[0.025, 0.02, legLen * 0.5, 8]} />
                <meshPhysicalMaterial color="#555" metalness={0.8} roughness={0.3} />
              </mesh>
              {/* Foot */}
              <mesh position={[spread * 1.05, -0.82, 0]}>
                <sphereGeometry args={[0.04, 12, 12]} />
                <meshPhysicalMaterial {...amber} />
              </mesh>
            </group>
          );
        })}
      </group>
    </EquipmentWrapper>
  );
}

/* ── Kru: Stylized person silhouette (headset + badge) ── */
function KruModel() {
  const amber = useAmberMaterial();
  const dark = useDarkMaterial();
  return (
    <EquipmentWrapper>
      <group>
        {/* Head */}
        <mesh position={[0, 0.65, 0]}>
          <sphereGeometry args={[0.25, 24, 24]} />
          <meshPhysicalMaterial {...dark} />
        </mesh>
        {/* Torso */}
        <mesh position={[0, 0.05, 0]}>
          <capsuleGeometry args={[0.3, 0.4, 8, 16]} />
          <meshPhysicalMaterial {...dark} />
        </mesh>
        {/* Headset band */}
        <mesh position={[0, 0.75, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.27, 0.02, 8, 32, Math.PI]} />
          <meshPhysicalMaterial {...amber} />
        </mesh>
        {/* Headset earpiece */}
        <mesh position={[-0.27, 0.63, 0]}>
          <boxGeometry args={[0.08, 0.14, 0.1]} />
          <meshPhysicalMaterial {...amber} />
        </mesh>
        {/* Mic boom */}
        <mesh position={[-0.15, 0.5, 0.12]} rotation={[0.3, 0, 0.5]}>
          <cylinderGeometry args={[0.012, 0.012, 0.3, 8]} />
          <meshPhysicalMaterial {...amber} />
        </mesh>
        {/* Badge / ID */}
        <mesh position={[0.15, 0.1, 0.32]}>
          <boxGeometry args={[0.18, 0.22, 0.02]} />
          <meshPhysicalMaterial {...amber} emissiveIntensity={0.1} />
        </mesh>
        {/* Lanyard */}
        <mesh position={[0.15, 0.35, 0.2]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.5, 6]} />
          <meshPhysicalMaterial {...amber} />
        </mesh>
      </group>
    </EquipmentWrapper>
  );
}

/* ── Paket: Camera + Softbox combo ── */
function PaketModel() {
  const amber = useAmberMaterial();
  const dark = useDarkMaterial();
  return (
    <EquipmentWrapper>
      <group>
        {/* Mini camera (left) */}
        <group position={[-0.5, 0, 0]} scale={0.65}>
          <mesh>
            <boxGeometry args={[0.9, 0.65, 0.55]} />
            <meshPhysicalMaterial {...dark} />
          </mesh>
          <mesh position={[0, 0, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.25, 0.4, 24]} />
            <meshPhysicalMaterial {...amber} />
          </mesh>
        </group>
        {/* Plus sign (center) */}
        <group position={[0, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.25, 0.06, 0.06]} />
            <meshPhysicalMaterial {...amber} emissiveIntensity={0.2} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.06, 0.25, 0.06]} />
            <meshPhysicalMaterial {...amber} emissiveIntensity={0.2} />
          </mesh>
        </group>
        {/* Mini light panel (right) */}
        <group position={[0.55, 0, 0]} scale={0.55}>
          <mesh>
            <boxGeometry args={[0.8, 0.6, 0.06]} />
            <meshPhysicalMaterial {...amber} />
          </mesh>
          <mesh position={[0, 0, -0.05]}>
            <boxGeometry args={[0.75, 0.55, 0.04]} />
            <meshPhysicalMaterial {...dark} />
          </mesh>
          {/* Stand */}
          <mesh position={[0, -0.45, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.35, 8]} />
            <meshPhysicalMaterial color="#555" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      </group>
    </EquipmentWrapper>
  );
}

/* ── Category → Model mapping ── */
const CATEGORY_MODELS: Record<string, React.ComponentType> = {
  Kamera: CameraModel,
  Lensa: LensModel,
  Lighting: LightingModel,
  Audio: AudioModel,
  Support: SupportModel,
  Kru: KruModel,
  Paket: PaketModel,
};

/* ══════════════════════════════════════════
 *  MAIN EXPORT
 * ══════════════════════════════════════════ */
interface EquipmentPreview3DProps {
  category: string;
}

export default function EquipmentPreview3D({ category }: EquipmentPreview3DProps) {
  const quality = use3DQuality();
  const ModelComponent = CATEGORY_MODELS[category] ?? CameraModel;

  if (quality.skip3D) return null;

  return (
    <div className="relative w-full aspect-[4/3] max-h-[220px] rounded-xl overflow-hidden bg-gradient-to-b from-accent/[0.03] to-transparent">
      <LazyCanvas
        cameraPosition={[0, 0.3, 3.2]}
        fov={40}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 5]} intensity={0.7} />
        <directionalLight position={[-2, -1, 3]} intensity={0.25} color="#F59E0B" />
        <pointLight position={[0, 2, 2]} intensity={0.3} color="#F59E0B" />
        <Environment preset="city" environmentIntensity={0.35} />
        <ModelComponent />
      </LazyCanvas>
      {/* Subtle label */}
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <span className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-widest">
          {category}
        </span>
      </div>
    </div>
  );
}
