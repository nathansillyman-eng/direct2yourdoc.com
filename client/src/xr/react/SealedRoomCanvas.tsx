import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { XR, createXRStore, XROrigin } from "@react-three/xr";
import { Billboard, OrbitControls, Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { buildSealedRoom } from "@/xr/engine/SealedRoom";
import { buildPresence } from "@/xr/engine/presence";
import type { RoomSkin, RoomStage } from "@/xr/engine/RoomSkin";
import { advanceStage, FADE_MS } from "@/xr/locomotion";
import { devuiRequested } from "@/xr/devui";

// emulate:false keeps production and normal desktop visits clean (no IWER/DevUI
// auto-inject on localhost, no Meta+Alt+E hotkey). ?devui=1 opts in and forces
// injection on any hostname — @pmndrs/xr still yields to a real headset, since
// it never injects when native immersive-vr/ar is supported.
const store = createXRStore({
  emulate: devuiRequested() ? { type: "metaQuest3", inject: true } : false,
});
export { store as xrStore };

const HOTSPOT_PREFIX = "hotspot:";
// Info panel opens below its plaque (plaque rail is at y=2.1), pulled toward the
// viewer so it renders in front of the presence portrait (z=-2.0) and above the desk.
const PANEL_OFFSET: [number, number, number] = [0, -0.75, 0.5];
// Panel is 1.7 m wide in a 4 m room: clamp its centre so it never clips a side wall.
const PANEL_X_LIMIT = 1.05;

/** Walk up from a raycast hit to the interactive target (door or hotspot label). */
function hitTarget(object: THREE.Object3D): { door: boolean; label: string | null } {
  let o: THREE.Object3D | null = object;
  while (o) {
    if (o.name === "door-1") return { door: true, label: null };
    if (o.name.startsWith(HOTSPOT_PREFIX))
      return { door: false, label: o.name.slice(HOTSPOT_PREFIX.length) };
    o = o.parent;
  }
  return { door: false, label: null };
}

/**
 * Discoverability: hotspots idle-pulse (staggered emissive breathing) and flare
 * when the pointer/controller ray hovers them. Purely visual — engine stays pure.
 */
function HotspotGlow({ room, hovered }: { room: THREE.Group; hovered: string | null }) {
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    let i = 0;
    room.traverse((o) => {
      if (!(o instanceof THREE.Mesh) || !o.name.startsWith(HOTSPOT_PREFIX)) return;
      const mat = o.material as THREE.MeshStandardMaterial;
      const isHovered = o.name.slice(HOTSPOT_PREFIX.length) === hovered;
      mat.emissiveIntensity = isHovered
        ? 0.8
        : 0.18 + 0.22 * (0.5 + 0.5 * Math.sin(t * 2.2 + i * 0.9));
      i += 1;
    });
  });
  return null;
}

// Desktop walkthrough bounds: keep the eye inside the 4x5 m shell, off the walls.
const WALK_X = 1.75;
const WALK_Z_MIN = -0.7; // stop at the desk (desk front edge z=-1.05)
const WALK_Z_MAX = 2.25;
const WALK_SPEED = 2; // m/s
const EYE_HEIGHT = 1.6;

/**
 * First-person desktop mode: drag to look around from where you stand (negative
 * rotateSpeed + near-camera target turns OrbitControls into mouse-look), WASD or
 * arrow keys to walk. Clicking hotspots keeps working through normal R3F events.
 */
function DesktopWalkControls() {
  const controls = useRef<any>(null);
  const keys = useRef<Set<string>>(new Set());

  useEffect(() => {
    const down = (e: KeyboardEvent) => keys.current.add(e.code);
    const up = (e: KeyboardEvent) => keys.current.delete(e.code);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame(({ camera }, dt) => {
    const c = controls.current;
    if (!c) return;
    const k = keys.current;
    const fwd = Number(k.has("KeyW") || k.has("ArrowUp")) - Number(k.has("KeyS") || k.has("ArrowDown"));
    const strafe = Number(k.has("KeyD") || k.has("ArrowRight")) - Number(k.has("KeyA") || k.has("ArrowLeft"));
    if (fwd === 0 && strafe === 0) return;

    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    dir.y = 0;
    if (dir.lengthSq() < 1e-6) return;
    dir.normalize();
    const right = new THREE.Vector3(-dir.z, 0, dir.x); // forward x up

    const step = dir
      .multiplyScalar(fwd)
      .add(right.multiplyScalar(strafe))
      .multiplyScalar(WALK_SPEED * Math.min(dt, 0.05));

    const next = camera.position.clone().add(step);
    next.x = Math.max(-WALK_X, Math.min(WALK_X, next.x));
    next.z = Math.max(WALK_Z_MIN, Math.min(WALK_Z_MAX, next.z));
    next.y = EYE_HEIGHT;
    const delta = next.clone().sub(camera.position);
    camera.position.copy(next);
    c.target.add(delta); // carry the look pivot with us so the view direction holds
    c.update();
  });

  // Target 0.1 m in front of the starting camera (0, 1.6, 1.8): rotation = look.
  return (
    <OrbitControls
      ref={controls}
      target={[0, EYE_HEIGHT, 1.7]}
      enableZoom={false}
      enablePan={false}
      rotateSpeed={-0.4}
    />
  );
}

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
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

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

  // Raycast click/select on interactive meshes. Fires for mouse clicks on desktop
  // AND for controller/hand ray "select" (trigger pull) inside the immersive
  // session — @react-three/xr v6 routes XR pointers through the same R3F events.
  // door-1 is the ONLY stage-advance trigger; hotspot:* meshes toggle their panel.
  function onSelect(e: { object: THREE.Object3D; stopPropagation?: () => void }) {
    const hit = hitTarget(e.object);
    if (hit.door) {
      e.stopPropagation?.(); // consume: don't re-fire on meshes behind the door
      return trigger();
    }
    if (hit.label != null) {
      e.stopPropagation?.(); // consume: overlapping/behind meshes must not double-fire
      const label = hit.label;
      setActiveLabel((cur) => (cur === label ? null : label));
    }
    // Unhandled hits (walls, presence plane) do NOT stop propagation, so a ray
    // passing through the portrait still reaches a plaque behind it.
  }

  function onHover(e: { object: THREE.Object3D }) {
    setHoveredLabel(hitTarget(e.object).label);
  }

  const activeSpot =
    activeLabel != null ? skin.commandFile.find((o) => o.label === activeLabel) : undefined;
  const activeBody = activeLabel != null ? content?.[activeLabel] : undefined;

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 2.6, 0]} intensity={20} distance={10} />
      <primitive
        object={room}
        onClick={(e: any) => onSelect(e)}
        onPointerOver={(e: any) => onHover(e)}
        onPointerOut={() => setHoveredLabel(null)}
      />
      <HotspotGlow room={room} hovered={hoveredLabel} />
      {/* Plaque titles — in-world Text meshes so they're readable inside the headset. */}
      {stage === "office" &&
        skin.commandFile.map((spot) => (
          <Text
            key={spot.label}
            position={[spot.position[0], spot.position[1], spot.position[2] + 0.011]}
            fontSize={0.05}
            color={skin.palette.floor}
            anchorX="center"
            anchorY="middle"
            maxWidth={0.38}
            textAlign="center"
          >
            {spot.label}
          </Text>
        ))}
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
            Math.max(
              -PANEL_X_LIMIT,
              Math.min(PANEL_X_LIMIT, activeSpot.position[0] + PANEL_OFFSET[0]),
            ),
            activeSpot.position[1] + PANEL_OFFSET[1],
            activeSpot.position[2] + PANEL_OFFSET[2],
          ]}
        >
          <mesh
            onClick={(e: any) => {
              e.stopPropagation?.(); // closing must not re-toggle a plaque behind the panel
              setActiveLabel(null);
            }}
          >
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
      {enableOrbit && <DesktopWalkControls />}
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
