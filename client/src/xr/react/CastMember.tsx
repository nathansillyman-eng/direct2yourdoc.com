import { Component, Suspense, useEffect, useRef, type ReactNode } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { CastEntry } from "@/xr/engine/RoomSkin";

/** Loads a rigged GLB and plays its idle clip. Placed/scaled per the skin's CastEntry. */
function CastModel({ entry }: { entry: CastEntry }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(entry.model);
  const { actions, names } = useAnimations(animations, group);

  // De-wax: the auto-generated GLB materials come back glossy/plasticky. Matte them
  // (high roughness, no metalness, low env reflection) so the cast reads less "wax".
  useEffect(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      const mats = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
      for (const m of mats as THREE.MeshStandardMaterial[]) {
        if ("roughness" in m) {
          m.roughness = 1;
          m.metalness = 0;
          m.envMapIntensity = 0.25;
          m.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  useEffect(() => {
    const name = entry.clip && names.includes(entry.clip) ? entry.clip : names[0];
    const action = name ? actions[name] : null;
    action?.reset().fadeIn(0.4).play();
    return () => {
      action?.fadeOut(0.2);
    };
  }, [actions, names, entry.clip]);

  return (
    <group
      ref={group}
      position={entry.position}
      rotation={[0, entry.rotationY ?? 0, 0]}
      scale={entry.scale ?? 1}
    >
      {/* dispose={null}: the GLTF scene is CACHED by useGLTF and shared across stage
          swaps. Without this, unmounting (waiting→office) destroys its GPU buffers and
          the return trip re-uploads ~20 MB of humans in one frame — a context-loss
          spike on Quest (the "exit to black darkness" report). */}
      <primitive object={scene} dispose={null} />
    </group>
  );
}

/** If the GLB fails to load, render the fallback (the billboard presence) instead of crashing. */
class CastErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** A rigged cast member that degrades gracefully: shows `fallback` while loading or on error. */
export function CastMember({ entry, fallback }: { entry: CastEntry; fallback?: ReactNode }) {
  return (
    <CastErrorBoundary fallback={fallback ?? null}>
      <Suspense fallback={fallback ?? null}>
        <CastModel entry={entry} />
      </Suspense>
    </CastErrorBoundary>
  );
}
