import { Component, Suspense, useEffect, useRef, type ReactNode } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { CastEntry } from "@/xr/engine/RoomSkin";

/** Loads a rigged GLB and plays its idle clip. Placed/scaled per the skin's CastEntry. */
function CastModel({ entry }: { entry: CastEntry }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(entry.model);
  const { actions, names } = useAnimations(animations, group);

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
      <primitive object={scene} />
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
