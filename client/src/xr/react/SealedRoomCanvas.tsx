import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { XR, createXRStore, XROrigin } from "@react-three/xr";
import { OrbitControls, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { buildSealedRoom } from "@/xr/engine/SealedRoom";
import { buildPresence } from "@/xr/engine/presence";
import type { RoomSkin, RoomStage } from "@/xr/engine/RoomSkin";
import { advanceStage, FADE_MS } from "@/xr/locomotion";
import { RoomLighting } from "./RoomLighting";

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
  intro,
  onContinue,
}: {
  skin: RoomSkin;
  stage: RoomStage;
  fade: number;
  enableOrbit: boolean;
  onDoorSelect: () => void;
  intro: boolean;
  onContinue: () => void;
}) {
  const { camera } = useThree();

  // Load the skin's real presence (the seated doctor) as a texture. Until it
  // resolves — or if the asset is missing — we fall back to the silhouette, so the
  // office is never broken. A WebRTC VideoTexture can take this same slot later.
  const [presenceTex, setPresenceTex] = useState<THREE.Texture | null>(null);
  const [aspect, setAspect] = useState(0.7); // width / height of the loaded image
  useEffect(() => {
    if (stage !== "office" || !skin.presenceImage) {
      setPresenceTex(null);
      return;
    }
    let alive = true;
    new THREE.TextureLoader().load(
      skin.presenceImage,
      (tex) => {
        if (!alive) return;
        tex.colorSpace = THREE.SRGBColorSpace;
        const img = tex.image as { width?: number; height?: number } | undefined;
        if (img?.width && img?.height) setAspect(img.width / img.height);
        setPresenceTex(tex);
      },
      undefined,
      () => {
        if (alive) setPresenceTex(null); // missing/failed → silhouette fallback
      },
    );
    return () => {
      alive = false;
    };
  }, [stage, skin]);

  const room = useMemo(() => buildSealedRoom(stage, skin), [stage, skin]);

  // Let every mesh in the room cast + receive the key light's shadow.
  useEffect(() => {
    room.traverse((o) => {
      const m = o as THREE.Mesh;
      if ((m as { isMesh?: boolean }).isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
  }, [room]);
  const presence = useMemo(() => {
    if (stage !== "office") return null;
    if (!presenceTex) return buildPresence(skin); // silhouette until the image resolves
    const height = 1.2; // seated upper-body height in metres (tuned to the desk)
    return buildPresence(skin, presenceTex, { width: height * aspect, height, y: 1.05 });
  }, [stage, skin, presenceTex, aspect]);

  // Greeting skin: drive the waterfall (animated scrolling texture) and the KM
  // emblem (loaded image). Both are tagged by the engine via userData; the engine
  // itself loads/animates nothing.
  const waterTex = useRef<THREE.CanvasTexture | null>(null);
  useEffect(() => {
    const wf = room.getObjectByName("waterfall") as THREE.Mesh | null;
    if (wf) {
      const tex = makeWaterTexture(skin.palette.water ?? "#6fb6cf");
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1, 2);
      const m = wf.material as THREE.MeshStandardMaterial;
      m.map = tex;
      m.emissiveMap = tex;
      m.needsUpdate = true;
      waterTex.current = tex;
    }
    const emblem = room.getObjectByName("km-emblem") as THREE.Mesh | null;
    if (emblem && skin.logoImage) {
      new THREE.TextureLoader().load(skin.logoImage, (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        const m = emblem.material as THREE.MeshStandardMaterial;
        m.map = t;
        m.emissiveMap = t;
        m.color = new THREE.Color(0xffffff);
        m.needsUpdate = true;
      });
    }
    return () => {
      waterTex.current?.dispose();
      waterTex.current = null;
    };
  }, [room, skin]);

  // Billboard presence toward the camera + flow the waterfall downward each frame.
  useFrame((_, dt) => {
    presence?.traverse((o) => {
      if (o.userData.billboard) o.lookAt(camera.position.x, o.position.y, camera.position.z);
    });
    if (waterTex.current) waterTex.current.offset.y -= dt * 0.35;
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
      {/* Per-room light rig — warm key + soft shadows, cool fill, feature shimmer. */}
      <RoomLighting stage={stage} palette={skin.palette} />
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

      {/* Spatial host hand-off — renders INSIDE the 3D scene so it works in-headset
          (a 2D DOM overlay does not). The founder greets the visitor and the
          "Meet your doctor" control crosses into the office. */}
      {intro && stage === "waiting" && <HostBeat skin={skin} onContinue={onContinue} />}

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

export function SealedRoomCanvas({ skin, xr, initialStage = "waiting" }: { skin: RoomSkin; xr: boolean; initialStage?: RoomStage }) {
  const [stage, setStage] = useState<RoomStage>(initialStage);
  const [fade, setFade] = useState(0); // 0 = clear, 1 = black
  const [intro, setIntro] = useState(false); // host introduction beat is showing

  // Crossing the threshold is now a HOST HAND-OFF, not a bare door. Selecting Door 1
  // opens the founder's introduction beat first; the visitor only enters the office
  // once the host has connected them to their doctor.
  function beginIntro() {
    if (stage !== "waiting" || intro) return;
    setIntro(true);
  }

  // The actual crossing (fade → office). Mirrors the Swift Sanctum `walkThroughDoor()`:
  // an explicit, debounced state change — never a spatial aim.
  function advance() {
    if (stage !== "waiting") return;
    setIntro(false);
    setFade(1);
    window.setTimeout(() => {
      setStage((s) => advanceStage(s));
      setFade(0);
    }, FADE_MS);
  }

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 1.55, 1.5], fov: 66 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Procedural IBL (no network fetch) so gold trim has something to reflect. */}
        <Environment resolution={64} environmentIntensity={0.3}>
          <Lightformer intensity={1.2} color="#fff2df" position={[0, 3, -2]} scale={[6, 3, 1]} />
          <Lightformer intensity={0.6} color="#cfe0e6" position={[-3, 2, 2]} scale={[4, 3, 1]} />
        </Environment>
        {xr ? (
          <XR store={store}>
            <XROrigin position={[0, 0, 1.6]} />
            <RoomScene
              skin={skin}
              stage={stage}
              fade={fade}
              enableOrbit={false}
              onDoorSelect={beginIntro}
              intro={intro}
              onContinue={advance}
            />
          </XR>
        ) : (
          <RoomScene
            skin={skin}
            stage={stage}
            fade={fade}
            enableOrbit
            onDoorSelect={beginIntro}
            intro={intro}
            onContinue={advance}
          />
        )}
      </Canvas>

      {/* GUARANTEED threshold control. This is the fix for "stuck in the waiting
          room": there is now always a way across that does not depend on landing
          a raycast. Shown on the 2D overlay (desktop preview + the flat HUD that
          sits over the canvas). In-headset, the enlarged door collider above
          covers the controller ray. */}
      {stage === "waiting" && !intro && (
        <button
          onClick={beginIntro}
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

// ---- Spatial host beat (works in-headset; a 2D DOM overlay does not) -----------

/** Paint text onto an offscreen canvas → a crisp CanvasTexture. No font fetch:
 *  uses system fonts on whatever device renders. Returns a transparent-bg texture. */
function makeCanvasTexture(
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/** A tall canvas of vertical water streaks → a tiling, scrollable CanvasTexture.
 *  Cheap (no shader), Quest-friendly; the React layer scrolls offset.y to "flow". */
function makeWaterTexture(colorHex: string): THREE.CanvasTexture {
  const w = 128;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const base = new THREE.Color(colorHex);
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, `#${base.clone().lerp(new THREE.Color(0xffffff), 0.35).getHexString()}`);
  grad.addColorStop(1, `#${base.clone().lerp(new THREE.Color(0x000000), 0.35).getHexString()}`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 26; i++) {
    const x = (i / 26) * w + (((i * 53) % 7) - 3);
    ctx.globalAlpha = 0.1 + ((i * 37) % 22) / 100;
    ctx.fillStyle = i % 2 ? "#ffffff" : "#cfeefa";
    ctx.fillRect(x, 0, 1 + (i % 3), h);
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** The founder's introduction beat, rendered as real geometry in the room.
 *  Nate is the HOST / CONNECTOR who introduces the visitor to a network physician.
 *  Billboards toward the viewer (yaw only) and offers a gaze/ray-selectable control. */
function HostBeat({ skin, onContinue }: { skin: RoomSkin; onContinue: () => void }) {
  const { camera } = useThree();
  const group = useRef<THREE.Group>(null);
  const [hostTex, setHostTex] = useState<THREE.Texture | null>(null);
  const [hostAspect, setHostAspect] = useState(0.62);

  useEffect(() => {
    let alive = true;
    new THREE.TextureLoader().load("/manus-storage/nate-host.png", (tex) => {
      if (!alive) return;
      tex.colorSpace = THREE.SRGBColorSpace;
      const img = tex.image as { width?: number; height?: number } | undefined;
      if (img?.width && img?.height) setHostAspect(img.width / img.height);
      setHostTex(tex);
    });
    return () => {
      alive = false;
    };
  }, []);

  const gold = skin.palette.trim;
  const ink = "#f4e9c8";

  // Signed welcome card.
  const cardTex = useMemo(
    () =>
      makeCanvasTexture(1024, 600, (ctx, w, h) => {
        roundRect(ctx, 8, 8, w - 16, h - 16, 28);
        ctx.fillStyle = "rgba(9,22,27,0.82)";
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = gold;
        ctx.stroke();

        ctx.textBaseline = "top";
        ctx.fillStyle = gold;
        ctx.font = "700 26px Georgia, serif";
        ctx.letterSpacing = "7px";
        ctx.fillText("A WORD FROM YOUR HOST", 56, 58);
        ctx.letterSpacing = "0px";

        ctx.fillStyle = ink;
        ctx.font = "600 52px Georgia, serif";
        ctx.fillText("Welcome. Let me introduce", 56, 120);
        ctx.fillText("you to your doctor.", 56, 184);

        ctx.fillStyle = "rgba(244,233,200,0.85)";
        ctx.font = "300 28px Georgia, serif";
        ctx.fillText("I’ve personally connected you with a trusted", 56, 290);
        ctx.fillText("physician from our network. Step in when ready.", 56, 332);

        ctx.fillStyle = ink;
        ctx.font = "italic 600 60px 'Snell Roundhand', 'Brush Script MT', cursive";
        ctx.fillText("Nate Sillyman", 56, 430);
        ctx.fillStyle = gold;
        ctx.font = "700 22px Georgia, serif";
        ctx.letterSpacing = "6px";
        ctx.fillText("FOUNDER & HOST", 60, 520);
        ctx.letterSpacing = "0px";
      }),
    [gold],
  );

  // "Meet your doctor" pill.
  const btnTex = useMemo(
    () =>
      makeCanvasTexture(768, 192, (ctx, w, h) => {
        roundRect(ctx, 6, 6, w - 12, h - 12, (h - 12) / 2);
        ctx.fillStyle = gold;
        ctx.fill();
        ctx.fillStyle = "#0b1a20";
        ctx.font = "800 56px Georgia, serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Meet your doctor  →", w / 2, h / 2 + 4);
      }),
    [gold],
  );

  // Billboard the whole beat toward the viewer (yaw only — stays upright).
  useFrame(() => {
    const g = group.current;
    if (g) g.lookAt(camera.position.x, g.position.y, camera.position.z);
  });

  const hostH = 1.5;
  const hostW = hostH * hostAspect;

  return (
    <group ref={group} position={[0, 1.45, 0.0]}>
      {/* Cinematic dim behind the beat so it reads. */}
      <mesh position={[0, 0, -0.06]} renderOrder={10}>
        <planeGeometry args={[3.6, 2.6]} />
        <meshBasicMaterial color="#061216" transparent opacity={0.5} depthWrite={false} />
      </mesh>

      {/* Host likeness */}
      {hostTex && (
        <mesh position={[-0.62, -0.02, 0]} renderOrder={11}>
          <planeGeometry args={[hostW, hostH]} />
          <meshBasicMaterial map={hostTex} transparent alphaTest={0.5} toneMapped={false} depthWrite={false} />
        </mesh>
      )}

      {/* Signed welcome card */}
      <mesh position={[0.62, 0.2, 0]} renderOrder={11}>
        <planeGeometry args={[1.28, 0.75]} />
        <meshBasicMaterial map={cardTex} transparent toneMapped={false} depthWrite={false} />
      </mesh>

      {/* "Meet your doctor" — selectable by ray/gaze/click, with a generous collider */}
      <group
        position={[0.62, -0.42, 0.02]}
        onClick={(e: any) => {
          e.stopPropagation?.();
          onContinue();
        }}
      >
        <mesh renderOrder={12}>
          <planeGeometry args={[0.74, 0.185]} />
          <meshBasicMaterial map={btnTex} transparent toneMapped={false} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[0.95, 0.34]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}
