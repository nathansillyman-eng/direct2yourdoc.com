import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import type { RoomStage, RoomPalette } from "@/xr/engine/RoomSkin";
import { lightingForStage } from "./lighting-config";

/** The per-room light rig. Reads the pure config, animates the feature light
 *  (cool water shimmer / warm breathing), and eases from cool→warm on arrival. */
export function RoomLighting({ stage, palette }: { stage: RoomStage; palette: RoomPalette }) {
  const target = useMemo(() => lightingForStage(stage, palette), [stage, palette]);

  const feature = useRef<THREE.PointLight>(null);
  const key = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const t = useRef(0);
  // Current (eased) values so a stage change warms up smoothly rather than snapping.
  const cur = useRef({ keyI: target.key.intensity, hemiI: target.hemisphere.intensity });

  useFrame((_, dt) => {
    t.current += dt;

    // Ease key + hemisphere toward the target (~1.2s) and lerp the key colour.
    const k = Math.min(1, dt / 1.2);
    cur.current.keyI += (target.key.intensity - cur.current.keyI) * k;
    cur.current.hemiI += (target.hemisphere.intensity - cur.current.hemiI) * k;
    if (key.current) {
      key.current.intensity = cur.current.keyI;
      key.current.color.lerp(new THREE.Color(target.key.color), k);
    }
    if (hemi.current) hemi.current.intensity = cur.current.hemiI;

    // Feature light animation.
    const f = feature.current;
    if (f) {
      if (target.feature.flicker === "water") {
        const n = Math.sin(t.current * 6.8) * 0.6 + Math.sin(t.current * 11.5) * 0.3; // cool shimmer ~7Hz
        f.intensity = target.feature.base + n * target.feature.amp;
      } else {
        const n = Math.sin(t.current * 1.6) * 0.7 + Math.sin(t.current * 3.1) * 0.3; // slow warm breath
        f.intensity = target.feature.base + n * target.feature.amp;
      }
    }
  });

  return (
    <>
      <ambientLight intensity={target.ambient} />
      <hemisphereLight
        ref={hemi}
        args={[new THREE.Color(target.hemisphere.sky), new THREE.Color(target.hemisphere.ground), target.hemisphere.intensity]}
      />
      <directionalLight
        ref={key}
        position={target.key.position}
        color={target.key.color}
        intensity={target.key.intensity}
        castShadow={target.key.castShadow}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <directionalLight position={target.fill.position} color={target.fill.color} intensity={target.fill.intensity} />
      <directionalLight position={target.rim.position} color={target.rim.color} intensity={target.rim.intensity} />
      <pointLight
        ref={feature}
        position={target.feature.position}
        color={target.feature.color}
        intensity={target.feature.base}
        distance={target.feature.distance}
        decay={target.feature.decay}
      />
      <ContactShadows position={[0, 0.02, -1.2]} scale={6} resolution={512} opacity={0.5} blur={2.4} far={1.4} frames={1} />
    </>
  );
}
