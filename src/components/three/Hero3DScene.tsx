"use client";

import { useRef, useMemo, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import * as THREE from "three";
import LazyCanvas from "./LazyCanvas";
import { use3DQuality } from "./use3DQuality";

/* ── Dragon Model — loaded from .glb file ── */
function DragonModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const { scene } = useGLTF("/models/dragon_character_3d_by_oscar_creativo.glb");

  // Clone scene so it can be reused safely
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Slow rotation
    groupRef.current.rotation.y += delta * 0.15;
    // Cursor parallax
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      pointer.x * 0.3,
      0.02
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      pointer.y * 0.15,
      0.02
    );
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={groupRef} position={[1.5, -0.5, 0]} scale={1.8}>
        <primitive object={clonedScene} />
      </group>
    </Float>
  );
}

/* ── Particle Field — sparse floating amber dots ── */
function ParticleField({ count = 100 }: { count?: number }) {
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

/* ── Main exported component ── */
export default function Hero3DScene() {
  const quality = use3DQuality();

  if (quality.skip3D) return null;

  return (
    <LazyCanvas
      cameraPosition={[0, 0.5, 5]}
      fov={45}
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
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, 2, 4]} intensity={0.3} color="#F59E0B" />
      <pointLight position={[2, 3, 3]} intensity={0.5} color="#F59E0B" />
      <pointLight position={[-4, -1, -3]} intensity={0.2} />

      {/* Dragon Model */}
      <Suspense fallback={null}>
        <DragonModel />
      </Suspense>

      {/* Particles */}
      <ParticleField count={Math.min(quality.particleCount, 100)} />
    </LazyCanvas>
  );
}
