"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import LazyCanvas from "./LazyCanvas";
import { use3DQuality } from "./use3DQuality";

/* ── Amber Torus Knot — slowly rotating, cursor parallax ── */
function AmberKnot() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.15;
    meshRef.current.rotation.x += delta * 0.05;
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      pointer.x * 0.4,
      0.03
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      pointer.y * 0.25,
      0.03
    );
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <torusKnotGeometry args={[1, 0.35, 128, 32, 2, 3]} />
        <meshPhysicalMaterial
          color="#F59E0B"
          metalness={0.8}
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive="#F59E0B"
          emissiveIntensity={0.08}
          envMapIntensity={1.2}
        />
      </mesh>
    </Float>
  );
}

/* ── Particle Field — floating amber dots ── */
function ParticleField({ count = 300 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
      sz[i] = 0.5 + Math.random() * 1.5;
    }
    return { positions: pos, sizes: sz };
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.02;
    pointsRef.current.rotation.x += delta * 0.005;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#F59E0B"
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Subtle ambient ring glow ── */
function GlowRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z += delta * 0.08;
  });

  return (
    <mesh ref={ringRef} position={[0, 0, -2]}>
      <torusGeometry args={[2.8, 0.015, 16, 100]} />
      <meshBasicMaterial
        color="#F59E0B"
        transparent
        opacity={0.15}
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
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, -2, 4]} intensity={0.3} color="#F59E0B" />
      <pointLight position={[-5, 3, -5]} intensity={0.4} color="#F59E0B" />
      <pointLight position={[5, -2, 3]} intensity={0.2} />

      {/* Objects */}
      <AmberKnot />
      <ParticleField count={quality.particleCount} />
      <GlowRing />
    </LazyCanvas>
  );
}
