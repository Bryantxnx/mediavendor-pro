"use client";

import { useRef, useMemo, Suspense, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import * as THREE from "three";
import LazyCanvas from "./LazyCanvas";
import { use3DQuality } from "./use3DQuality";

/* ── Category → GLB path + scale/position config ── */
const MODEL_CONFIG: Record<string, {
  path: string;
  scale: number;
  position: [number, number, number];
  rotation: [number, number, number];
}> = {
  Kamera: {
    path: "/models/yashica_tl-super_-_old_camera.glb",
    scale: 0.015,
    position: [0, -0.3, 0],
    rotation: [0.2, 0, 0],
  },
  Lensa: {
    path: "/models/yashica_tl-super_-_old_camera.glb",
    scale: 0.015,
    position: [0, -0.3, 0],
    rotation: [0.3, 0.5, 0],
  },
  Lighting: {
    path: "/models/simple_studio_light.glb",
    scale: 1.2,
    position: [0, -0.5, 0],
    rotation: [0, 0, 0],
  },
  Audio: {
    path: "/models/001_mic.glb",
    scale: 0.8,
    position: [0, -0.3, 0],
    rotation: [0, 0, 0],
  },
  Support: {
    path: "/models/drone_support.glb",
    scale: 0.4,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  },
  Kru: {
    path: "/models/human_welder.glb",
    scale: 0.6,
    position: [0, -0.8, 0],
    rotation: [0, 0, 0],
  },
  Paket: {
    path: "/models/dron.glb",
    scale: 0.25,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  },
};

/* ── GLB Model Loader with auto-rotate ── */
function GLBModel({ config }: {
  config: {
    path: string;
    scale: number;
    position: [number, number, number];
    rotation: [number, number, number];
  };
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const { scene } = useGLTF(config.path);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.4;
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      pointer.x * 0.1,
      0.03
    );
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group
        ref={groupRef}
        position={config.position}
        rotation={config.rotation}
        scale={config.scale}
      >
        <primitive object={clonedScene} />
      </group>
    </Float>
  );
}

/* ── Drone model with spinning propellers ── */
const PROPELLER_NAMES = [
  "Cylinder028_24",
  "Cylinder001_25",
  "Cylinder002_26",
  "Cylinder003_27",
  "Cylinder004_28",
];

function DroneGLBModel({ config }: {
  config: {
    path: string;
    scale: number;
    position: [number, number, number];
    rotation: [number, number, number];
  };
}) {
  const groupRef = useRef<THREE.Group>(null);
  const propellerRefs = useRef<THREE.Object3D[]>([]);
  const { pointer } = useThree();
  const { scene } = useGLTF(config.path);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    const props: THREE.Object3D[] = [];
    clonedScene.traverse((obj) => {
      if (PROPELLER_NAMES.includes(obj.name)) props.push(obj);
    });
    propellerRefs.current = props;
  }, [clonedScene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.4;
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      pointer.x * 0.1,
      0.03
    );
    propellerRefs.current.forEach((p) => {
      p.rotation.z += delta * 25;
    });
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group
        ref={groupRef}
        position={config.position}
        rotation={config.rotation}
        scale={config.scale}
      >
        <primitive object={clonedScene} />
      </group>
    </Float>
  );
}

/* ══════════════════════════════════════════
 *  MAIN EXPORT
 * ══════════════════════════════════════════ */
interface EquipmentPreview3DProps {
  category: string;
}

export default function EquipmentPreview3D({ category }: EquipmentPreview3DProps) {
  const quality = use3DQuality();

  if (quality.skip3D) return null;

  const config = MODEL_CONFIG[category] ?? MODEL_CONFIG.Kamera;
  const isDrone = category === "Paket";

  return (
    <div className="relative w-full aspect-[4/3] max-h-[220px] rounded-xl overflow-hidden bg-gradient-to-b from-accent/[0.03] to-transparent">
      <LazyCanvas
        cameraPosition={[0, 0.3, 3.2]}
        fov={40}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 5]} intensity={0.8} />
        <directionalLight position={[-2, -1, 3]} intensity={0.25} color="#F59E0B" />
        <pointLight position={[0, 2, 2]} intensity={0.3} color="#F59E0B" />
        <pointLight position={[-3, -1, -2]} intensity={0.2} />

        <Suspense fallback={null}>
          {isDrone ? (
            <DroneGLBModel config={config} />
          ) : (
            <GLBModel config={config} />
          )}
        </Suspense>
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
