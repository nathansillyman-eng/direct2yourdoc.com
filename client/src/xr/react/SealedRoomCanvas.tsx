import { useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { XR, createXRStore, XROrigin } from "@react-three/xr";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { buildSealedRoom } from "@/xr/engine/SealedRoom";
import { buildPresence } from "@/xr/engine/presence";
import type { RoomSkin, RoomStage } from "@/xr/engine/RoomSkin";
import { advanceStage, FADE_MS } from "@/xr/locomotion";

const store = createXRStore();
export { store as xrStore };

/** Renders the current engine group + (in office) the presence, with comfort fades.
 *  Stage + the advance action are now OWNED BY THE PARENT so a guaranteed,
 *  always-reachable affordance can cross the threshold — never an aim alone. */
function RoomScene({
  skin,
  stage,
  fade,
  enableOrbit,
  onDoorSelect,
}: {
  skin: RoomSkin;
  stage: RoomStage;
  fade: number;
  enableOrbit: boolean;
  onDoorSelect: () => void;
}) {
  const { camera } = useThree();

  const room = useMemo(() => buildSealedRoom(stage, skin), [stage, skin]);
  const presence = useMemo(
    () => (stage === "office" ? buildPresence(skin) : null),
    [stage, skin],
  );

  // Billboard any presence-plane toward the camera each frame.
  useFrame(() => {
    presence?.traverse((o) => {
      if (o.userData.billboard) o.lookAt(camera.position.x, o.position.y, camera.position.z);
    });
  });

  // Raycast click/select on interactive meshes (Door 1 advances the stage).
  function onSelect(e: { object: THREE.Object3D; stopPropagation?: () => void }) {
    let o: THREE.Object3D | null = e.object;
    while (o) {
      if (o.name === "door-1" || o.name === "door-1-collider") {
        e.stopPropagation?.();
        return onDoorSelect();
      }
      o = o.parent;
    }
  }

  return (
    <>
      {/* Lighting rig: low ambient + a soft sky/ground tint, a warm key from the
          ceiling fixture, a cool fill toward the visitor so furniture faces aren't
          black, and a focused emerald glow at the hearth. */}
      <ambientLight intensity={0.5} />
      <hemisphereLight args={[0xcfe6df, 0x0b1a20, 0.65]} />
      <pointLight position={[0, 2.7, -0.4]} intensity={13} distance={10} decay={2} color={0xfff1d4} />
      <pointLight position={[0, 1.8, 1.6]} intensity={7} distance={9} decay={2} color={0xcfe6e0} />
      <pointLight position={[-0.95, 0.6, -2.1]} intensity={4} distance={3.5} decay={2} color={0x2fae89} />
      <primitive object={room} onClick={(e: any) => onSelect(e)} />

      {/* Oversized INVISIBLE collider over Door 1. The visible door is a 1 m panel
          ~4 m away — a fragile target for a Quest controller ray or a desktop
          click. This widens the hit area without changing the look. Only present
          while there is somewhere to go. */}
      {stage === "waiting" && (
        <mesh
          name="door-1-collider"
          position={[1.0, 1.2, -2.3]}
          onClick={(e: any) => { e.stopPropagation?.(); onDoorSelect(); }}
        >
          <planeGeometry args={[1.8, 2.4]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}

      {presence && <primitive object={presence} />}
      {enableOrbit && (
        <OrbitControls
          makeDefault
          target={[0, 1.15, -1.7]}
          minPolarAngle={Math.PI * 0.28}
          maxPolarAngle={Math.PI * 0.6}
        />
      )}

      {/* Comfort fade overlay. */}
      <mesh position={[0, 1.4, -0.3]} visible={fade > 0} renderOrder={999}>
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial color="black" transparent opacity={fade} depthTest={false} />
      </mesh>
    </>
  );
}

export function SealedRoomCanvas({ skin, xr }: { skin: RoomSkin; xr: boolean }) {
  const [stage, setStage] = useState<RoomStage>("waiting");
  const [fade, setFade] = useState(0); // 0 = clear, 1 = black

  // The single threshold-crossing action. Mirrors the Swift Sanctum reference's
  // `walkThroughDoor()`: crossing is an explicit, debounced state change — not a
  // spatial aim. Door click, door collider, and the overlay button all call this.
  function advance() {
    if (stage !== "waiting") return;
    setFade(1);
    window.setTimeout(() => {
      setStage((s) => advanceStage(s));
      setFade(0);
    }, FADE_MS);
  }

  return (
    <>
      <Canvas
        camera={{ position: [0, 1.55, 1.5], fov: 66 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
        style={{ width: "100%", height: "100%" }}
      >
        {xr ? (
          <XR store={store}>
            <XROrigin position={[0, 0, 1.6]} />
            <RoomScene skin={skin} stage={stage} fade={fade} enableOrbit={false} onDoorSelect={advance} />
          </XR>
        ) : (
          <RoomScene skin={skin} stage={stage} fade={fade} enableOrbit onDoorSelect={advance} />
        )}
      </Canvas>

      {/* GUARANTEED threshold control. This is the fix for "stuck in the waiting
          room": there is now always a way across that does not depend on landing
          a raycast. Shown on the 2D overlay (desktop preview + the flat HUD that
          sits over the canvas). In-headset, the enlarged door collider above
          covers the controller ray. */}
      {stage === "waiting" && (
        <button
          onClick={advance}
          style={{
            position: "absolute",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "14px 26px",
            borderRadius: 9999,
            border: "1px solid #c9a24b",
            background: "#0f2a33",
            color: "#f4e9c8",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 6px 24px rgba(0,0,0,0.45)",
          }}
        >
          Step through Door 1 → the office
        </button>
      )}
    </>
  );
}
