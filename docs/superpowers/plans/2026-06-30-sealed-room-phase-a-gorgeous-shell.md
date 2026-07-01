# Sealed Room — Phase A (Gorgeous Room Shell) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current flat-lit red-oak greybox into a gorgeous, correctly-structured waiting room + doctor's office (no cast yet) in WebXR, verified on desktop preview and unit tests.

**Architecture:** The pure engine (`engine/SealedRoom.ts`, returns a `THREE.Group`, loads nothing) owns geometry and is unit-tested. The React/R3F layer (`react/SealedRoomCanvas.tsx` + new focused files `react/lighting-config.ts`, `react/RoomLighting.tsx`, `react/materials.ts`) owns lighting, textures, and shadows, and is verified visually via screenshots. Brand identity stays in `skins/direct2yourdoc-greeting.ts`.

**Tech Stack:** React 19, `@react-three/fiber@9`, `@react-three/drei@10`, `@react-three/xr@6`, `three`, Vite, Vitest. Preview: `medassurance-webxr-doorfix` on port 5183. Run tests: `corepack pnpm@10.4.1 exec vitest run client/src/xr`.

**Canonical constants:** room 4W×5D×3H, `FRONT = z −2.5`; Door-1 `(1.0,1.05,−2.43)`; waterfall centre x −0.7 (waiting only); office desk group `(0,0,−1.3)`, doctor chair `(0,0,−2.15)`; palette red-oak (wall `#7a4a2c`, floor `#6b3f26`, trim `#c9a24b`, water `#5fb6cf`, accent `#6c4f93`). Full detail: `docs/superpowers/specs/2026-06-30-sealed-room-greeting-gorgeous-design.md`.

**Guardrails:** Work only in `~/medassurance-webxr-doorfix` on `fix/webxr-door-threshold`. Commit after every task. Never merge to `main` (Tower/C5 sequences merges). Never force-push.

---

## Test skin used by new tests

All new engine tests reuse one greeting-shaped skin. Add this constant near the top of `client/src/xr/engine/SealedRoom.test.ts` (below the existing `skin`):

```ts
const greeting: RoomSkin = {
  ...neutralSkin,
  id: "greeting-test",
  feature: "waterfall",
  logoImage: "/brand/km-emblem.png",
  palette: { wall: "#7a4a2c", floor: "#6b3f26", trim: "#c9a24b", fire: "#3aa0b5", accent: "#6c4f93", water: "#5fb6cf" },
  commandFile: [
    { label: "Records", position: [-1, 1.4, -2.3] },
    { label: "Labs", position: [1, 1.4, -2.3] },
  ],
};
```

---

### Task 1: Gate the feature wall (waterfall/hearth) to the waiting stage

Right now the feature block runs for BOTH stages, so the office wrongly shows a waterfall. Gate it to `stage === "waiting"`.

**Files:**
- Modify: `client/src/xr/engine/SealedRoom.ts` (the feature block, ~lines 141–245)
- Test: `client/src/xr/engine/SealedRoom.test.ts`

- [ ] **Step 1: Write the failing tests**

Add to `SealedRoom.test.ts`:

```ts
describe("feature wall is waiting-room only", () => {
  it("puts the waterfall + koi + emblem in the waiting room", () => {
    const g = buildSealedRoom("waiting", greeting);
    for (const n of ["waterfall", "koi-pond", "km-emblem"]) expect(names(g)).toContain(n);
  });
  it("does NOT put the waterfall in the office", () => {
    const g = buildSealedRoom("office", greeting);
    for (const n of ["waterfall", "koi-pond", "km-emblem"]) expect(names(g)).not.toContain(n);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr/engine/SealedRoom.test.ts`
Expected: FAIL — the office currently contains `waterfall`.

- [ ] **Step 3: Gate the feature block**

In `SealedRoom.ts`, wrap the whole feature section in a stage guard. Change the opening of the feature block from:

```ts
  // ---- feature wall: hearth (default) OR a waterfall + koi pond (greeting) --
  if (greeting) {
```

to:

```ts
  // ---- feature wall: hearth (default) OR a waterfall + koi pond (greeting) --
  // Waiting-room only — the office gets its own warm credential wall (Task 2).
  if (stage === "waiting" && greeting) {
```

and change the matching `} else {` (which begins the hearth) to `} else if (stage === "waiting") {`. Leave the hearth body unchanged.

- [ ] **Step 4: Run tests to verify they pass**

Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr/engine/SealedRoom.test.ts`
Expected: PASS (all, including the pre-existing waiting-stage `hearth` test — the neutral/test skin still builds the hearth in the waiting stage).

- [ ] **Step 5: Commit**

```bash
cd ~/medassurance-webxr-doorfix
git add client/src/xr/engine/SealedRoom.ts client/src/xr/engine/SealedRoom.test.ts
git commit -m "fix(webxr): gate the feature wall to the waiting room only"
```

---

### Task 2: Office credential + bookshelf back wall

The office front wall (behind the seated doctor) is now bare. Give it a warm red-oak bookshelf + two framed credentials.

**Files:**
- Modify: `client/src/xr/engine/SealedRoom.ts` (inside `if (stage === "office") {`)
- Test: `client/src/xr/engine/SealedRoom.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
it("gives the office a credential + bookshelf back wall", () => {
  const g = buildSealedRoom("office", greeting);
  expect(names(g)).toContain("bookshelf");
  expect(names(g)).toContain("credential-1");
  expect(names(g)).toContain("credential-2");
  // ...and the waiting room does not.
  const w = buildSealedRoom("waiting", greeting);
  expect(names(w)).not.toContain("bookshelf");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr/engine/SealedRoom.test.ts`
Expected: FAIL — no `bookshelf`.

- [ ] **Step 3: Add the bookshelf + credentials**

Inside the `if (stage === "office") {` block in `SealedRoom.ts`, after the `rug` is added, insert:

```ts
    // Warm back wall behind the doctor: a red-oak bookshelf + framed credentials.
    const shelf = new THREE.Group();
    shelf.name = "bookshelf";
    shelf.position.set(-1.15, 0, FRONT + 0.12); // left of the doctor, on the front wall
    shelf.add(box("shelf-case", [1.5, 1.9, 0.28], woodMat, [0, 0.98, 0]));
    for (let i = 0; i < 3; i++) {
      shelf.add(box(`shelf-plank-${i}`, [1.44, 0.04, 0.26], goldMat, [0, 0.5 + i * 0.55, 0.02]));
      // A row of book spines as slim colour blocks (tonal, premium, not primary).
      for (let b = 0; b < 7; b++) {
        const tint = new THREE.Color(p.wall).lerp(new THREE.Color(p.trim), (b % 3) * 0.18 + 0.1);
        shelf.add(
          box(`book-${i}-${b}`, [0.14, 0.34, 0.2], new THREE.MeshStandardMaterial({ color: tint, roughness: 0.8 }),
            [-0.6 + b * 0.19, 0.72 + i * 0.55, 0.03]),
        );
      }
    }
    g.add(shelf);

    const credential = (nm: string, x: number) => {
      const c = new THREE.Group();
      c.name = nm;
      c.position.set(x, 1.7, FRONT + 0.06);
      c.add(box(`${nm}-frame`, [0.5, 0.62, 0.04], goldMat, [0, 0, 0]));
      c.add(box(`${nm}-mat`, [0.42, 0.54, 0.02],
        new THREE.MeshStandardMaterial({ color: new THREE.Color("#f4ecd8"), roughness: 0.9 }), [0, 0, 0.02]));
      g.add(c);
    };
    credential("credential-1", 0.55);
    credential("credential-2", 1.15);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr/engine/SealedRoom.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add client/src/xr/engine/SealedRoom.ts client/src/xr/engine/SealedRoom.test.ts
git commit -m "feat(webxr): warm credential + bookshelf back wall in the office"
```

---

### Task 3: Patient sit-anchor seat facing the doctor

The current `chair` (z −2.15) is the DOCTOR's seat. Add the visitor's seat facing −Z at conversational distance.

**Files:**
- Modify: `client/src/xr/engine/SealedRoom.ts` (office block)
- Test: `client/src/xr/engine/SealedRoom.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
it("adds a patient sit-anchor seat facing the doctor in the office", () => {
  const g = buildSealedRoom("office", greeting);
  const seat = g.getObjectByName("patient-seat");
  expect(seat).toBeTruthy();
  expect(seat!.position.z).toBeCloseTo(0.4, 1); // in front of the desk, facing -Z
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr/engine/SealedRoom.test.ts`
Expected: FAIL — no `patient-seat`.

- [ ] **Step 3: Add the patient seat**

Inside the `if (stage === "office") {` block, after the doctor `chair` is added, insert:

```ts
    // The VISITOR's seat — faces the doctor (−Z), conversational distance in front of the desk.
    const patientSeat = new THREE.Group();
    patientSeat.name = "patient-seat";
    patientSeat.position.set(0, 0, 0.4);
    patientSeat.add(box("ps-seat", [0.62, 0.12, 0.6], accentMat, [0, 0.46, 0]));
    patientSeat.add(box("ps-back", [0.62, 0.62, 0.12], accentMat, [0, 0.8, 0.26])); // back behind the sitter (+Z)
    patientSeat.add(box("ps-arm-l", [0.1, 0.3, 0.56], accentMat, [-0.27, 0.57, 0]));
    patientSeat.add(box("ps-arm-r", [0.1, 0.3, 0.56], accentMat, [0.27, 0.57, 0]));
    g.add(patientSeat);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr/engine/SealedRoom.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add client/src/xr/engine/SealedRoom.ts client/src/xr/engine/SealedRoom.test.ts
git commit -m "feat(webxr): add the visitor sit-anchor seat facing the doctor"
```

---

### Task 4: Koi as shaped fish (not boxes)

Replace the two box-koi with a simple fish silhouette (flattened body + tail) so the pond reads premium.

**Files:**
- Modify: `client/src/xr/engine/SealedRoom.ts` (the koi in the waterfall block)
- Test: `client/src/xr/engine/SealedRoom.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
it("builds koi as groups (body + tail), not bare boxes", () => {
  const g = buildSealedRoom("waiting", greeting);
  const koi = g.getObjectByName("koi-1");
  expect(koi).toBeTruthy();
  expect((koi as THREE.Group).children.length).toBeGreaterThanOrEqual(2); // body + tail
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr/engine/SealedRoom.test.ts`
Expected: FAIL — `koi-1` is currently a single `Mesh` (0 children).

- [ ] **Step 3: Replace the box koi with a fish factory**

In `SealedRoom.ts`, replace the two `g.add(box("koi-1", ...))` / `koi-2` calls with:

```ts
    const koi = (nm: string, colorHex: string, x: number, z: number, ry: number) => {
      const k = new THREE.Group();
      k.name = nm;
      k.position.set(x, 0.06, z);
      k.rotation.y = ry;
      const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 8),
        new THREE.MeshStandardMaterial({ color: new THREE.Color(colorHex), roughness: 0.5 }),
      );
      body.name = `${nm}-body`;
      body.scale.set(1.9, 0.5, 1.0); // long, flat fish body
      k.add(body);
      const tail = new THREE.Mesh(
        new THREE.ConeGeometry(0.09, 0.16, 4),
        new THREE.MeshStandardMaterial({ color: new THREE.Color(colorHex), roughness: 0.5 }),
      );
      tail.name = `${nm}-tail`;
      tail.rotation.z = Math.PI / 2;
      tail.position.set(-0.22, 0, 0);
      tail.scale.set(1, 0.5, 1);
      k.add(tail);
      g.add(k);
    };
    koi("koi-1", "#e8743b", FX - 0.25, FRONT + 0.5, 0.4);
    koi("koi-2", "#f2f2f2", FX + 0.32, FRONT + 0.74, -0.8);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr/engine/SealedRoom.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add client/src/xr/engine/SealedRoom.ts client/src/xr/engine/SealedRoom.test.ts
git commit -m "feat(webxr): koi as shaped fish (body + tail) instead of boxes"
```

---

### Task 5: Per-stage lighting config (pure, testable)

Extract the lighting into a pure config function so the numbers are unit-tested; a component consumes it in Task 6.

**Files:**
- Create: `client/src/xr/react/lighting-config.ts`
- Test: `client/src/xr/react/lighting-config.test.ts`

- [ ] **Step 1: Write the failing test**

`client/src/xr/react/lighting-config.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { lightingForStage } from "./lighting-config";

const palette = { wall: "#7a4a2c", floor: "#6b3f26", trim: "#c9a24b", fire: "#3aa0b5", water: "#5fb6cf" };

describe("lightingForStage", () => {
  it("waiting is cooler/brighter with a cool water feature light", () => {
    const l = lightingForStage("waiting", palette);
    expect(l.feature.flicker).toBe("water");
    expect(l.feature.color).toBe("#5fb6cf");
    expect(l.key.intensity).toBeGreaterThan(lightingForStage("office", palette).key.intensity);
  });
  it("office is warm with a warm breathing feature light and casts a key shadow", () => {
    const l = lightingForStage("office", palette);
    expect(l.feature.flicker).toBe("warm");
    expect(l.key.castShadow).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr/react/lighting-config.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lighting-config.ts`**

```ts
import type { RoomStage, RoomPalette } from "@/xr/engine/RoomSkin";

export interface LightSpec {
  color: string;
  intensity: number;
  position: [number, number, number];
}
export interface FeatureLight extends LightSpec {
  distance: number;
  decay: number;
  flicker: "water" | "warm";
  base: number; // mean intensity the flicker oscillates around
  amp: number; // oscillation amplitude
}
export interface RoomLightingConfig {
  ambient: number;
  hemisphere: { sky: string; ground: string; intensity: number };
  key: LightSpec & { castShadow: boolean };
  fill: LightSpec;
  rim: LightSpec;
  feature: FeatureLight;
}

/** Pure per-stage lighting numbers. Waiting = calm-neutral ~4800K; office = warm ~3200K.
 *  Feature light is a COOL water shimmer (waiting) or a WARM breathing lamp (office) —
 *  the flicker technique, never an orange fire (brand motif is water). */
export function lightingForStage(stage: RoomStage, palette: RoomPalette): RoomLightingConfig {
  if (stage === "office") {
    return {
      ambient: 0.28,
      hemisphere: { sky: "#3a2c22", ground: "#160d07", intensity: 0.4 },
      key: { color: "#ffdcae", intensity: 1.3, position: [2.5, 4, 2.5], castShadow: true },
      fill: { color: "#e9c58a", intensity: 6, position: [-2, 2.2, 1] },
      rim: { color: palette.trim, intensity: 0.45, position: [-1, 3, -3.5] },
      feature: {
        color: "#ffcaa0", intensity: 4, position: [1.9, 1.2, -1.4],
        distance: 6, decay: 2, flicker: "warm", base: 4, amp: 0.5,
      },
    };
  }
  return {
    ambient: 0.34,
    hemisphere: { sky: "#dfe7ea", ground: "#241a12", intensity: 0.55 },
    key: { color: "#fff2df", intensity: 1.6, position: [3, 4.5, 2], castShadow: true },
    fill: { color: "#cfe0e6", intensity: 0.6, position: [-3, 2.5, 1] },
    rim: { color: palette.trim, intensity: 0.4, position: [0, 3, -4] },
    feature: {
      color: palette.water ?? "#5fb6cf", intensity: 3.4, position: [-0.7, 1.1, -2.2],
      distance: 4.5, decay: 2, flicker: "water", base: 3.4, amp: 0.6,
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr/react/lighting-config.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add client/src/xr/react/lighting-config.ts client/src/xr/react/lighting-config.test.ts
git commit -m "feat(webxr): pure per-stage lighting config (water vs warm)"
```

---

### Task 6: RoomLighting component + Canvas shadows/Environment (visual)

Replace the flat inline lights with a real rig. Verified visually (WebGL — not unit-tested).

**Files:**
- Create: `client/src/xr/react/RoomLighting.tsx`
- Modify: `client/src/xr/react/SealedRoomCanvas.tsx` (remove old inline lights; add `<RoomLighting>`, Canvas `shadows`, `<Environment>`, `<ContactShadows>`)

- [ ] **Step 1: Create `RoomLighting.tsx`**

```tsx
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import type { RoomStage, RoomPalette } from "@/xr/engine/RoomSkin";
import { lightingForStage } from "./lighting-config";

export function RoomLighting({ stage, palette }: { stage: RoomStage; palette: RoomPalette }) {
  const cfg = useMemo(() => lightingForStage(stage, palette), [stage, palette]);
  const feature = useRef<THREE.PointLight>(null);
  const t = useRef(0);

  useFrame((_, dt) => {
    t.current += dt;
    const f = feature.current;
    if (!f) return;
    if (cfg.feature.flicker === "water") {
      // gentle cool shimmer, ~7Hz, no harsh spikes
      const n = Math.sin(t.current * 6.8) * 0.6 + Math.sin(t.current * 11.5) * 0.3;
      f.intensity = cfg.feature.base + n * cfg.feature.amp;
    } else {
      // slow warm breathing
      const n = Math.sin(t.current * 1.6) * 0.7 + Math.sin(t.current * 3.1) * 0.3;
      f.intensity = cfg.feature.base + n * cfg.feature.amp;
    }
  });

  return (
    <>
      <ambientLight intensity={cfg.ambient} />
      <hemisphereLight args={[new THREE.Color(cfg.hemisphere.sky), new THREE.Color(cfg.hemisphere.ground), cfg.hemisphere.intensity]} />
      <directionalLight
        position={cfg.key.position}
        color={cfg.key.color}
        intensity={cfg.key.intensity}
        castShadow={cfg.key.castShadow}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <directionalLight position={cfg.fill.position} color={cfg.fill.color} intensity={cfg.fill.intensity} />
      <directionalLight position={cfg.rim.position} color={cfg.rim.color} intensity={cfg.rim.intensity} />
      <pointLight
        ref={feature}
        position={cfg.feature.position}
        color={cfg.feature.color}
        intensity={cfg.feature.base}
        distance={cfg.feature.distance}
        decay={cfg.feature.decay}
      />
      <ContactShadows position={[0, 0.02, -1.2]} scale={6} resolution={512} opacity={0.5} blur={2.4} far={1.4} frames={1} />
    </>
  );
}
```

- [ ] **Step 2: Wire it into `SealedRoomCanvas.tsx`**

In `RoomScene`'s returned JSX, DELETE the five inline light lines (the `ambientLight`, `hemisphereLight`, and three `pointLight`s at ~lines 133–137) and replace with:

```tsx
      <RoomLighting stage={stage} palette={skin.palette} />
```

Add the import at the top: `import { RoomLighting } from "./RoomLighting";`
Enable shadows + IBL on the `<Canvas>` (in `SealedRoomCanvas`): add the `shadows` prop and, as the first child inside `<Canvas>`, an `<Environment>`:

```tsx
      <Canvas
        shadows
        camera={{ position: [0, 1.55, 1.5], fov: 66 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Environment preset="apartment" background={false} environmentIntensity={0.25} />
```

Add `Environment` to the drei import: `import { OrbitControls, Environment } from "@react-three/drei";`
Make the room receive/cast shadows: after `const room = useMemo(...)`, add an effect that walks the group:

```tsx
  useEffect(() => {
    room.traverse((o) => {
      const m = o as THREE.Mesh;
      if ((m as any).isMesh) { m.castShadow = true; m.receiveShadow = true; }
    });
  }, [room]);
```

- [ ] **Step 3: Restart preview and screenshot both rooms**

Run the preview (`medassurance-webxr-doorfix`, port 5183), navigate to `/room`, screenshot the waiting room, click "Step through Door 1 → the office" → "Meet your doctor", screenshot the office.
Expected: warm directional key light with soft shadows; no black/unlit faces; waiting reads cool-calm with cool shimmer at the waterfall; office reads warm; gold trim now shows real reflections from the Environment.

- [ ] **Step 4: Check console for errors**

Expected: no errors/warnings related to lights, shadows, or `Environment`.

- [ ] **Step 5: Commit**

```bash
git add client/src/xr/react/RoomLighting.tsx client/src/xr/react/SealedRoomCanvas.tsx
git commit -m "feat(webxr): real per-room lighting rig, shadows, and IBL"
```

---

### Task 7: Wood-grain + gold reflection materials (visual)

Give walls/floor/wood a grain texture and raise gold metalness so the room stops looking like flat paint.

**Files:**
- Create: `client/src/xr/react/materials.ts`
- Modify: `client/src/xr/engine/SealedRoom.ts` (gold metalness), `client/src/xr/react/SealedRoomCanvas.tsx` (apply wood texture to named meshes)

- [ ] **Step 1: Raise gold metalness in the engine**

In `SealedRoom.ts`, in `goldMat`, change `metalness: 0.45,` to `metalness: 0.85,` and `emissiveIntensity: 0.14` to `emissiveIntensity: 0.06` (let reflection, not glow, carry the gold now that IBL exists).
Run the existing tests to confirm nothing breaks (colors unaffected):
Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr/engine`
Expected: PASS (19+).

- [ ] **Step 2: Create `materials.ts` (procedural red-oak grain)**

```ts
import * as THREE from "three";

/** A tiling red-oak grain CanvasTexture — warm base with soft vertical grain streaks.
 *  Cheap, Quest-friendly, no asset fetch. */
export function makeWoodTexture(baseHex: string): THREE.CanvasTexture {
  const w = 256, h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const base = new THREE.Color(baseHex);
  ctx.fillStyle = `#${base.getHexString()}`;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 70; i++) {
    const x = Math.floor((i * 37) % w);
    const light = i % 2 === 0;
    ctx.globalAlpha = 0.05 + ((i * 13) % 10) / 100;
    ctx.strokeStyle = `#${base.clone().lerp(new THREE.Color(light ? 0xffffff : 0x000000), 0.4).getHexString()}`;
    ctx.lineWidth = 1 + (i % 3);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 8, h * 0.33, x - 8, h * 0.66, x + 4, h);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}
```

- [ ] **Step 3: Apply wood grain to walls/floor/desks in `SealedRoomCanvas.tsx`**

In the existing `useEffect(() => { ... }, [room, skin])` that wires the waterfall/emblem, add (before the cleanup `return`):

```tsx
    const woodTex = makeWoodTexture(skin.palette.wood ?? skin.palette.wall);
    woodTex.repeat.set(3, 2);
    room.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!(m as any).isMesh) return;
      if (/^(wall-|floor|fd-body|desk-top|desk-front|desk-left|desk-right|shelf-case|ps-|accent-chair)/.test(m.name)) {
        const mat = m.material as THREE.MeshStandardMaterial;
        mat.map = woodTex;
        mat.needsUpdate = true;
      }
    });
```

Add the import: `import { makeWoodTexture } from "./materials";`
(Dispose `woodTex` in the same effect's cleanup alongside `waterTex.current?.dispose()`.)

- [ ] **Step 4: Restart preview, screenshot both rooms, check console**

Expected: walls and floor show subtle grain; desks/shelf read as wood; gold trim reflects the environment. No console errors.

- [ ] **Step 5: Commit**

```bash
git add client/src/xr/engine/SealedRoom.ts client/src/xr/react/materials.ts client/src/xr/react/SealedRoomCanvas.tsx
git commit -m "feat(webxr): red-oak grain textures + reflective gold trim"
```

---

### Task 8: Warm-on-arrival lighting transition (visual)

When crossing into the office, ease the light from cool→warm so arrival "feels" like stepping into a cozier room.

**Files:**
- Modify: `client/src/xr/react/RoomLighting.tsx`

- [ ] **Step 1: Lerp the config on stage change**

In `RoomLighting`, replace the direct `cfg` use with an interpolated current config. Add refs + a lerp in `useFrame`:

```tsx
  const target = cfg;
  const cur = useRef(cfg);
  const key = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  // ...attach ref={key} to the key <directionalLight> and ref={hemi} to <hemisphereLight>.

  useFrame((_, dt) => {
    // ease current toward target (~1.2s)
    const k = Math.min(1, dt / 1.2);
    cur.current.key.intensity += (target.key.intensity - cur.current.key.intensity) * k;
    cur.current.hemisphere.intensity += (target.hemisphere.intensity - cur.current.hemisphere.intensity) * k;
    if (key.current) {
      key.current.intensity = cur.current.key.intensity;
      key.current.color.lerp(new THREE.Color(target.key.color), k);
    }
    if (hemi.current) hemi.current.intensity = cur.current.hemisphere.intensity;
    // ...existing feature-flicker block unchanged...
  });
```

Keep it minimal — intensity + key color easing is enough to sell the arrival. (Feature flicker stays as in Task 6.)

- [ ] **Step 2: Restart preview; walk waiting → office and screenshot the moment after arrival**

Expected: a visible, smooth warm-up as the office loads (no hard snap). No console errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/xr/react/RoomLighting.tsx
git commit -m "feat(webxr): warm-on-arrival lighting transition into the office"
```

---

### Task 9: Ambient audio beds (last Phase A step)

Add ambient sound: waiting waterfall bed; office fountain + sleeping-dog + room tone. Positions re-anchored to 4×5×3. Real files generated separately; this task adds the type, the selector (tested), and the wiring.

**Files:**
- Modify: `client/src/xr/engine/RoomSkin.ts` (add `audio` field)
- Create: `client/src/xr/react/audio-config.ts` + `client/src/xr/react/audio-config.test.ts`
- Create: `client/src/xr/react/RoomAudio.tsx`
- Modify: `client/src/xr/react/SealedRoomCanvas.tsx` (mount `<RoomAudio>`)
- Assets: `client/public/audio/d2yd/*.ogg` (generated via the audio tool; `.mp3` fallback)

- [ ] **Step 1: Add the `audio` field to `RoomSkin`**

In `RoomSkin.ts`, add to the `RoomSkin` interface:

```ts
  /** Optional ambient audio. The engine never loads these; the React layer plays them. */
  audio?: {
    waiting?: { bed?: string; sources?: { url: string; position: [number, number, number]; gain: number }[] };
    office?: { bed?: string; sources?: { url: string; position: [number, number, number]; gain: number }[] };
  };
```

- [ ] **Step 2: Write the failing selector test**

`client/src/xr/react/audio-config.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { audioForStage } from "./audio-config";
import type { RoomSkin } from "@/xr/engine/RoomSkin";

const skin = {
  audio: {
    waiting: { bed: "/audio/d2yd/d2yd_waiting_tone.ogg", sources: [{ url: "/audio/d2yd/d2yd_waiting_waterfall.ogg", position: [-0.7, 1, -2.2], gain: 0.5 }] },
    office: { bed: "/audio/d2yd/d2yd_office_tone.ogg", sources: [] },
  },
} as unknown as RoomSkin;

describe("audioForStage", () => {
  it("returns the waiting bed + positional sources", () => {
    const a = audioForStage("waiting", skin);
    expect(a.bed).toContain("waiting_tone");
    expect(a.sources).toHaveLength(1);
  });
  it("returns an empty result when the skin has no audio", () => {
    const a = audioForStage("office", {} as RoomSkin);
    expect(a.bed).toBeUndefined();
    expect(a.sources).toEqual([]);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr/react/audio-config.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 4: Implement `audio-config.ts`**

```ts
import type { RoomSkin, RoomStage } from "@/xr/engine/RoomSkin";

export interface StageAudio {
  bed?: string;
  sources: { url: string; position: [number, number, number]; gain: number }[];
}

export function audioForStage(stage: RoomStage, skin: RoomSkin): StageAudio {
  const a = skin.audio?.[stage];
  return { bed: a?.bed, sources: a?.sources ?? [] };
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr/react/audio-config.test.ts`
Expected: PASS.

- [ ] **Step 6: Generate the audio loops**

Generate 5 seamless mono/stereo loops (waiting_tone stereo bed; waiting_waterfall mono; office_tone stereo bed; office_fountain mono; office_dog mono, sparse, no barking) per `audio-spec.md` §3 prompts. Save as `.ogg` (+ `.mp3`) in `client/public/audio/d2yd/` named `d2yd_<room>_<source>.<ext>`. (Operator/Nate may hand these over; until present, the skin's `audio` field can stay unset and `RoomAudio` renders nothing — never a broken build.)

- [ ] **Step 7: Create `RoomAudio.tsx` and wire it**

```tsx
import { PositionalAudio } from "@react-three/drei";
import type { RoomSkin, RoomStage } from "@/xr/engine/RoomSkin";
import { audioForStage } from "./audio-config";

export function RoomAudio({ stage, skin, enabled }: { stage: RoomStage; skin: RoomSkin; enabled: boolean }) {
  if (!enabled) return null;
  const a = audioForStage(stage, skin);
  return (
    <>
      {a.sources.map((s, i) => (
        <PositionalAudio key={`${stage}-${i}`} url={s.url} position={s.position} distance={1} loop />
      ))}
      {/* Bed = a plain looping HTML audio element mounted by the parent (non-positional). */}
    </>
  );
}
```

Mount `<RoomAudio stage={stage} skin={skin} enabled={/* after enter gesture */} />` inside `RoomScene`. Gate playback on a user gesture (browser autoplay) — start only after the "Step through"/enter interaction. Add the `direct2yourdoc-greeting` skin's `audio` block once files exist.

- [ ] **Step 8: Verify + commit**

Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr` → PASS. Restart preview; confirm no console errors (and, if files present, audio starts after the enter gesture and never masks a voice).

```bash
git add client/src/xr/engine/RoomSkin.ts client/src/xr/react/audio-config.ts client/src/xr/react/audio-config.test.ts client/src/xr/react/RoomAudio.tsx client/src/xr/react/SealedRoomCanvas.tsx client/public/audio 2>/dev/null
git commit -m "feat(webxr): ambient audio beds (waiting waterfall / office fountain + dog)"
```

---

### Task 10: Phase A verification gate + hand-off

**Files:** none (verification only)

- [ ] **Step 1: Full test suite green**

Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr`
Expected: all green (19 original + the new engine/lighting/audio tests).

- [ ] **Step 2: Typecheck + build**

Run: `corepack pnpm@10.4.1 exec tsc --noEmit && corepack pnpm@10.4.1 run build`
Expected: tsc clean; build succeeds; Three.js stays a lazy `/room` chunk (medical bundle unchanged).

- [ ] **Step 3: Visual acceptance (screenshots)**

Render `/room` on 5183. Capture the waiting room and the office. Check against `demo-scope-and-platform-split.md` §1: both rooms lit (no black voids), Door-1 traversal with comfort fade, presence reads as a person, sit-anchor faces the doctor, exit always available. Iterate on any task above until it reads *gorgeous*, not greybox.

- [ ] **Step 4: Hand the branch to Tower (C5)**

Post the branch (`fix/webxr-door-threshold`, HEAD after Task 9), the test/build result, and the two screenshots to Tower for merge sequencing. Do NOT merge to `main`. direct2yourdoc.com go-live stays gated on Nate.

---

## Self-Review

- **Spec coverage:** waterfall-waiting-only (T1), office credential wall (T2), sit-anchor (T3), koi craft (T4), lighting rig + shadows + IBL + water-shimmer/warm-breathing (T5–T6), materials/gold (T7), warm-on-arrival transition (T8), ambient audio re-anchored + never-mask (T9), 4×5×3 canonical (header + tests), verify + hand-off (T10). Phase B (cast, document sign/destruct + legal flag) is intentionally out of scope — its own plan after A verifies.
- **Placeholders:** none — every code step shows real code; audio files are explicitly optional-until-generated with a safe no-op fallback.
- **Type consistency:** `lightingForStage`/`RoomLightingConfig`/`FeatureLight` used identically in T5→T6→T8; `audioForStage`/`StageAudio` identical in T9; engine object names in tests match the names added in the same task.
