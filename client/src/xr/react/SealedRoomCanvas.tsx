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

/** Renders the current engine group + (in office) the presence, with comfort fades. */
function RoomScene({ skin, enableOrbit }: { skin: RoomSkin; enableOrbit: boolean }) {
  const [stage, setStage] = useState<RoomStage>("waiting");
  const [fade, setFade] = useState(0); // 0 = clear, 1 = black
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

  function trigger() {
    if (stage !== "waiting") return;
    setFade(1);
    window.setTimeout(() => {
      setStage((s) => advanceStage(s));
      setFade(0);
    }, FADE_MS);
  }

  // Raycast click/select on interactive meshes (Door 1 advances the stage).
  function onSelect(e: { object: THREE.Object3D }) {
    let o: THREE.Object3D | null = e.object;
    while (o) {
      if (o.name === "door-1") return trigger();
      o = o.parent;
    }
  }

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 2.6, 0]} intensity={20} distance={10} />
      <primitive object={room} onClick={(e: any) => onSelect(e)} />
      {presence && <primitive object={presence} />}
      {enableOrbit && <OrbitControls target={[0, 1.4, -1.5]} />}
      {/* Comfort fade overlay. */}
      <mesh position={[0, 1.4, -0.3]} visible={fade > 0} renderOrder={999}>
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial color="black" transparent opacity={fade} depthTest={false} />
      </mesh>
    </>
  );
}

export function SealedRoomCanvas({ skin, xr }: { skin: RoomSkin; xr: boolean }) {
  return (
    <Canvas camera={{ position: [0, 1.6, 1.8], fov: 70 }} style={{ width: "100%", height: "100%" }}>
      {xr ? (
        <XR store={store}>
          <XROrigin position={[0, 0, 1.6]} />
          <RoomScene skin={skin} enableOrbit={false} />
        </XR>
      ) : (
        <RoomScene skin={skin} enableOrbit={true} />
      )}
    </Canvas>
  );
}
