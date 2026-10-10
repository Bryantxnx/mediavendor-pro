"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import LazyCanvas from "./LazyCanvas";
import { use3DQuality } from "./use3DQuality";

/* ══════════════════════════════════════════
 *  PROCEDURAL CINEMA LENS — hero centerpiece
 *  Elegant camera lens with barrel, rings,
 *  glass element, and aperture blades
 * ══════════════════════════════════════════ */
function CinemaLens() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Slow rotation on Y axis
    groupRef.current.rotation.y += delta * 0.12;
    // Gentle tilt toward cursor
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointer.y * 0.08,
      0.02
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -pointer.x * 0.05,
      0.02
    );
    // Subtle parallax position
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      pointer.x * 0.2,
      0.02
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      pointer.y * 0.1,
      0.02
    );
  });

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} position={[1.8, 0, 0]} rotation={[Math.PI / 2 + 0.3, 0, 0]}>
        {/* Main barrel — dark body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.75, 0.7, 1.8, 48]} />
          <meshPhysicalMaterial
            color="#0f1520"
            metalness={0.85}
            roughness={0.3}
            clearcoat={0.4}
            clearcoatRoughness={0.2}
          />
        </mesh>

        {/* Focus ring — amber accent */}
        <mesh position={[0, 0.35, 0]}>
          <torusGeometry args={[0.77, 0.05, 16, 64]} />
          <meshPhysicalMaterial
            color="#F59E0B"
            metalness={0.7}
            roughness={0.2}
            emissive="#F59E0B"
            emissiveIntensity={0.15}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Zoom ring — thinner amber */}
        <mesh position={[0, -0.15, 0]}>
          <torusGeometry args={[0.73, 0.03, 16, 64]} />
          <meshPhysicalMaterial
            color="#F59E0B"
            metalness={0.7}
            roughness={0.25}
            emissive="#F59E0B"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Aperture ring — subtle */}
        <mesh position={[0, -0.5, 0]}>
          <torusGeometry args={[0.72, 0.02, 16, 64]} />
          <meshPhysicalMaterial
            color="#D97706"
            metalness={0.8}
            roughness={0.2}
            emissive="#F59E0B"
            emissiveIntensity={0.05}
          />
        </mesh>

        {/* Front element hood */}
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.82, 0.78, 0.2, 48, 1, true]} />
          <meshPhysicalMaterial
            color="#0a0e18"
            metalness={0.9}
            roughness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Front glass element — reflective dark */}
        <mesh position={[0, 0.92, 0]}>
          <circleGeometry args={[0.68, 48]} />
          <meshPhysicalMaterial
            color="#0a1628"
            metalness={1}
            roughness={0}
            clearcoat={1}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Inner glass — subtle blue-purple reflection */}
        <mesh position={[0, 0.91, 0]}>
          <circleGeometry args={[0.55, 48]} />
          <meshPhysicalMaterial
            color="#1a1040"
            metalness={1}
            roughness={0.05}
            clearcoat={1}
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* Center dot — amber glow (simulates lens flare center) */}
        <mesh position={[0, 0.915, 0]}>
          <circleGeometry args={[0.08, 24]} />
          <meshBasicMaterial
            color="#F59E0B"
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Aperture blades (6 blades) */}
        {Array.from({ length: 6 }).map((_, i) => {
          const bladeAngle = (i / 6) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(bladeAngle) * 0.35,
                0.88,
                Math.sin(bladeAngle) * 0.35,
              ]}
              rotation={[Math.PI / 2, bladeAngle, 0]}
            >
              <planeGeometry args={[0.22, 0.06]} />
              <meshPhysicalMaterial
                color="#1a1a2e"
                metalness={0.9}
                roughness={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}

        {/* Rear mount ring — metallic */}
        <mesh position={[0, -0.92, 0]}>
          <torusGeometry args={[0.6, 0.04, 16, 48]} />
          <meshPhysicalMaterial
            color="#888"
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>

        {/* Rear element */}
        <mesh position={[0, -0.9, 0]} rotation={[Math.PI, 0, 0]}>
          <circleGeometry args={[0.5, 32]} />
          <meshPhysicalMaterial
            color="#080c14"
            metalness={1}
            roughness={0.1}
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Grip texture lines on barrel */}
        {Array.from({ length: 24 }).map((_, i) => {
          const lineAngle = (i / 24) * Math.PI * 2;
          return (
            <mesh
              key={`grip-${i}`}
              position={[
                Math.cos(lineAngle) * 0.76,
                0.0,
                Math.sin(lineAngle) * 0.76,
              ]}
              rotation={[0, -lineAngle, 0]}
            >
              <boxGeometry args={[0.008, 0.5, 0.008]} />
              <meshPhysicalMaterial
                color="#1a2030"
                metalness={0.7}
                roughness={0.4}
              />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
}

/* ── Particle Field — sparse floating amber dots ── */
function ParticleField({ count = 120 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = 5 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
      sz[i] = 0.3 + Math.random() * 1.0;
    }
    return { positions: pos, sizes: sz };
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.015;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        color="#F59E0B"
        size={0.025}
        sizeAttenuation
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Subtle orbiting ring ── */
function OrbitRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z += delta * 0.06;
    ringRef.current.rotation.x += delta * 0.02;
  });

  return (
    <mesh ref={ringRef} position={[1.8, 0, -1]}>
      <torusGeometry args={[2.2, 0.008, 16, 120]} />
      <meshBasicMaterial
        color="#F59E0B"
        transparent
        opacity={0.1}
      />
    </mesh>
  );
}

/* ── Main exported component ── */
export default function Hero3DScene() {
  const quality = use3DQuality();

  if (quality.skip3D) return null;

  return (
    <LazyCanvas
      cameraPosition={[0, 0, 5]}
      fov={50}
      rootMargin="0px"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 5, 5]} intensity={0.7} />
      <directionalLight position={[-3, -2, 4]} intensity={0.25} color="#F59E0B" />
      <pointLight position={[2, 2, 3]} intensity={0.4} color="#F59E0B" />
      <pointLight position={[-4, -1, -3]} intensity={0.15} />

      {/* Objects */}
      <CinemaLens />
      <ParticleField count={Math.min(quality.particleCount, 120)} />
      <OrbitRing />
    </LazyCanvas>
  );
}
