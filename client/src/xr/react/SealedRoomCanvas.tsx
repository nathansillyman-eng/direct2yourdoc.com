import { Suspense, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { XR, createXRStore, XROrigin } from "@react-three/xr";
import { Billboard, OrbitControls, Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { buildSealedRoom } from "@/xr/engine/SealedRoom";
import { buildPresence } from "@/xr/engine/presence";
import type { RoomSkin, RoomStage } from "@/xr/engine/RoomSkin";
import { advanceStage, FADE_MS } from "@/xr/locomotion";

const store = createXRStore();
export { store as xrStore };

const HOTSPOT_PREFIX = "hotspot:";
// Info panel sits offset from its hotspot, toward the viewer.
const PANEL_OFFSET: [number, number, number] = [0, -0.55, 0.4];

/** Renders a presence group and keeps any billboard-flagged plane facing the camera. */
function BillboardedPresence({ group }: { group: THREE.Group }) {
  const { camera } = useThree();
  useFrame(() => {
    group.traverse((o) => {
      if (o.userData.billboard) o.lookAt(camera.position.x, o.position.y, camera.position.z);
    });
  });
  return <primitive object={group} />;
}

/** Loads skin.presenceImage (suspends) and feeds it through the engine's texture seam. */
function TexturedPresence({ skin }: { skin: RoomSkin }) {
  const texture = useTexture(skin.presenceImage!);
  const group = useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    return buildPresence(skin, texture);
  }, [skin, texture]);
  return <BillboardedPresence group={group} />;
}

/** Renders the current engine group + (in office) the presence, with comfort fades. */
function RoomScene({
  skin,
  enableOrbit,
  content,
}: {
  skin: RoomSkin;
  enableOrbit: boolean;
  content?: Record<string, string>;
}) {
  const [stage, setStage] = useState<RoomStage>("waiting");
  const [fade, setFade] = useState(0); // 0 = clear, 1 = black
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const room = useMemo(() => buildSealedRoom(stage, skin), [stage, skin]);
  const fallbackPresence = useMemo(
    () => (stage === "office" ? buildPresence(skin) : null),
    [stage, skin],
  );

  function trigger() {
    if (stage !== "waiting") return;
    setFade(1);
    window.setTimeout(() => {
      setStage((s) => advanceStage(s));
      setFade(0);
    }, FADE_MS);
  }

  // Raycast click/select on interactive meshes. door-1 is the ONLY stage-advance
  // trigger; hotspot:* meshes only toggle their info panel.
  function onSelect(e: { object: THREE.Object3D }) {
    let o: THREE.Object3D | null = e.object;
    while (o) {
      if (o.name === "door-1") return trigger();
      if (o.name.startsWith(HOTSPOT_PREFIX)) {
        const label = o.name.slice(HOTSPOT_PREFIX.length);
        setActiveLabel((cur) => (cur === label ? null : label));
        return;
      }
      o = o.parent;
    }
  }

  const activeSpot =
    activeLabel != null ? skin.commandFile.find((o) => o.label === activeLabel) : undefined;
  const activeBody = activeLabel != null ? content?.[activeLabel] : undefined;

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 2.6, 0]} intensity={20} distance={10} />
      <primitive object={room} onClick={(e: any) => onSelect(e)} />
      {stage === "office" &&
        (skin.presenceImage ? (
          <Suspense fallback={fallbackPresence && <BillboardedPresence group={fallbackPresence} />}>
            <TexturedPresence skin={skin} />
          </Suspense>
        ) : (
          fallbackPresence && <BillboardedPresence group={fallbackPresence} />
        ))}
      {activeSpot && activeBody && (
        <Billboard
          position={[
            activeSpot.position[0] + PANEL_OFFSET[0],
            activeSpot.position[1] + PANEL_OFFSET[1],
            activeSpot.position[2] + PANEL_OFFSET[2],
          ]}
        >
          <mesh onClick={() => setActiveLabel(null)}>
            <planeGeometry args={[1.7, 1.05]} />
            <meshBasicMaterial color={skin.palette.floor} transparent opacity={0.92} />
          </mesh>
          <Text
            position={[0, 0.38, 0.01]}
            fontSize={0.09}
            color={skin.palette.trim}
            anchorX="center"
            anchorY="middle"
            maxWidth={1.5}
          >
            {activeSpot.label}
          </Text>
          <Text
            position={[0, -0.06, 0.01]}
            fontSize={0.045}
            color="white"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.5}
            lineHeight={1.5}
            textAlign="left"
          >
            {activeBody}
          </Text>
        </Billboard>
      )}
      {enableOrbit && <OrbitControls target={[0, 1.4, -1.5]} />}
      {/* Comfort fade overlay. */}
      <mesh position={[0, 1.4, -0.3]} visible={fade > 0} renderOrder={999}>
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial color="black" transparent opacity={fade} depthTest={false} />
      </mesh>
    </>
  );
}

export function SealedRoomCanvas({
  skin,
  xr,
  content,
}: {
  skin: RoomSkin;
  xr: boolean;
  content?: Record<string, string>;
}) {
  return (
    <Canvas camera={{ position: [0, 1.6, 1.8], fov: 70 }} style={{ width: "100%", height: "100%" }}>
      {xr ? (
        <XR store={store}>
          <XROrigin position={[0, 0, 1.6]} />
          <RoomScene skin={skin} enableOrbit={false} content={content} />
        </XR>
      ) : (
        <RoomScene skin={skin} enableOrbit={true} content={content} />
      )}
    </Canvas>
  );
}
