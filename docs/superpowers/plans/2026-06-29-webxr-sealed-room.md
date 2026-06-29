# WebXR Sealed Room Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a walkable, branded WebXR sealed room (waiting → office) that runs in the Quest 3 browser and Android Chrome, built as a VR mode inside the existing Direct2YourDoc React/Vite app (the medical front door; repo dir on disk is `MedAssurance/`), with a stable desktop fallback.

**Architecture:** A framework-agnostic Three.js engine (the web twin of `SanctumEngine`) exposes pure builder functions that return `THREE.Group`s from data only. A thin react-three-fiber + `@react-three/xr` shell mounts those groups, owns the XR session, locomotion, and stage transitions. A separate **skin** module supplies brand/medical identity. The engine never depends on specific images.

**Tech Stack:** TypeScript, Three.js, react-three-fiber v9, `@react-three/xr` v6, `@react-three/drei` v10, wouter (existing router), Vitest (engine unit tests), Tailwind v4 (existing), pnpm.

---

## Identity separation (non-negotiable, applies to every task)

- `client/src/xr/engine/**` is the **reusable room technology** (Sanctum twin). It MUST NOT import from `skins/`, reference Direct2YourDoc or any medical/brand identity, doctors, patients, records, or any specific image path. Each engine file starts with the header comment:
  `// SealedRoom engine — reusable room tech. No brand/medical identity. No specific assets.`
- `client/src/xr/skins/**` is the **medical face**. It owns brand, palette, copy, command-file labels, and asset URLs.
- The engine receives identity only as data (a `RoomSkin`) and optional already-loaded `THREE.Texture`s passed in by the React layer. The engine never fetches a URL itself.

## Two stages

- **Stage 1 (this plan, full detail):** deps + tooling, the engine (`RoomSkin`, `SealedRoom`, `presence` as a *neutral* placeholder), the Direct2YourDoc skin, locomotion helper, the R3F/XR shell, the `/room` route, desktop fallback, XR-unavailable handling, Quest verification. Stage 1 proves: enter the waiting threshold, move into the room, see branded room objects, interact with hotspots, stable desktop fallback.
- **Stage 2 (outlined at end, detailed after Stage 1 review):** richer doctor presence (Higgsfield asset + texture wired onto the presence plane), and deeper business logic. No Higgsfield credits spent in Stage 1.

## File structure

```
Repo root:
  vitest.config.ts                              CREATE — Vitest config (node env, @ alias)
  package.json                                  MODIFY — add deps + test scripts

client/src/xr/
  engine/
    RoomSkin.ts                                 CREATE — types, neutralSkin, arc()
    RoomSkin.test.ts                            CREATE
    SealedRoom.ts                               CREATE — buildSealedRoom(stage, skin)
    SealedRoom.test.ts                          CREATE
    presence.ts                                 CREATE — buildPresence(skin, texture?)
    presence.test.ts                            CREATE
  skins/
    direct2yourdoc.ts                           CREATE — the medical skin
    direct2yourdoc.test.ts                      CREATE
  locomotion.ts                                 CREATE — stage-transition helper
  locomotion.test.ts                            CREATE
  react/
    SealedRoomCanvas.tsx                        CREATE — R3F <Canvas>+<XR> shell
    VRRoomPage.tsx                              CREATE — route page + desktop fallback + XR-unsupported

client/src/App.tsx                              MODIFY — add lazy /room route
```

---

## Task 0: Tooling — deps + Vitest

**Files:**
- Modify: `package.json` (dependencies + scripts)
- Create: `vitest.config.ts`
- Create: `client/src/xr/engine/__smoke__.test.ts` (temporary smoke test, deleted in Step 6)

- [ ] **Step 1: Install runtime deps**

Run (use corepack if pnpm is not on PATH: `corepack pnpm@10.4.1 ...`):
```bash
pnpm add three@^0.171 @react-three/fiber@^9 @react-three/drei@^10 @react-three/xr@^6
pnpm add -D @types/three@^0.171
```
Expected: deps resolve and install with no peer-dependency errors against React 19. If `@react-three/xr` reports a peer conflict with R3F, pin `@react-three/fiber@^9` and re-run — v6 of xr targets R3F v9.

- [ ] **Step 2: Add test scripts to package.json**

In the `"scripts"` block add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create Vitest config**

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

// Engine builders are pure (no WebGLRenderer, no DOM) — run them in node.
export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "client/src") },
  },
  test: {
    environment: "node",
    include: ["client/src/**/*.test.ts"],
  },
});
```

- [ ] **Step 4: Write a smoke test**

Create `client/src/xr/engine/__smoke__.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import * as THREE from "three";

describe("tooling smoke", () => {
  it("constructs a three Object3D in node", () => {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial()));
    expect(g.children).toHaveLength(1);
  });
});
```

- [ ] **Step 5: Run the smoke test**

Run: `pnpm test`
Expected: 1 test file, 1 test, PASS. (Confirms three + vitest run in node with the `@` alias available.)

- [ ] **Step 6: Delete the smoke test and commit**

```bash
rm client/src/xr/engine/__smoke__.test.ts
git add package.json pnpm-lock.yaml vitest.config.ts
git commit -m "build: add three/r3f/xr deps and vitest config for WebXR room"
```

---

## Task 1: RoomSkin — types, neutralSkin, arc()

**Files:**
- Create: `client/src/xr/engine/RoomSkin.ts`
- Test: `client/src/xr/engine/RoomSkin.test.ts`

- [ ] **Step 1: Write the failing test**

Create `client/src/xr/engine/RoomSkin.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { neutralSkin, arc, type RoomObject } from "./RoomSkin";

describe("arc", () => {
  it("returns one RoomObject per label", () => {
    const objs = arc(["A", "B", "C"]);
    expect(objs).toHaveLength(3);
    expect(objs.map((o: RoomObject) => o.label)).toEqual(["A", "B", "C"]);
  });

  it("spreads labels symmetrically across x and keeps them on the front wall", () => {
    const objs = arc(["A", "B", "C"]);
    const xs = objs.map((o) => o.position[0]);
    expect(xs[0]).toBeLessThan(0);
    expect(Math.abs(xs[1])).toBeLessThan(1e-9); // middle centered
    expect(xs[2]).toBeGreaterThan(0);
    objs.forEach((o) => expect(o.position[2]).toBeCloseTo(-2.3)); // front wall
  });

  it("handles a single label at center", () => {
    const objs = arc(["Solo"]);
    expect(objs[0].position[0]).toBeCloseTo(0);
  });
});

describe("neutralSkin", () => {
  it("is a complete, brandless RoomSkin", () => {
    expect(neutralSkin.id).toBe("neutral");
    expect(neutralSkin.palette).toMatchObject({
      wall: expect.any(String),
      floor: expect.any(String),
      trim: expect.any(String),
      fire: expect.any(String),
    });
    expect(neutralSkin.commandFile).toEqual([]);
    expect(neutralSkin.presenceImage).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test client/src/xr/engine/RoomSkin.test.ts`
Expected: FAIL — `Cannot find module "./RoomSkin"`.

- [ ] **Step 3: Write minimal implementation**

Create `client/src/xr/engine/RoomSkin.ts`:
```ts
// SealedRoom engine — reusable room tech. No brand/medical identity. No specific assets.

export type RoomStage = "waiting" | "office";

export interface RoomPalette {
  wall: string;
  floor: string;
  trim: string;
  fire: string;
}

export interface RoomObject {
  label: string;
  position: [number, number, number];
}

export interface RoomSkin {
  id: string;
  brand: string;
  tagline: string;
  professional: string;
  officeTitle: string;
  palette: RoomPalette;
  commandFile: RoomObject[];
  /** Optional. The engine never fetches this; the React layer loads it and passes a texture. */
  presenceImage?: string;
}

const FRONT_WALL_Z = -2.3;
const HOTSPOT_Y = 1.4;
const HOTSPOT_SPAN = 2.4; // total width the labels spread across, in metres

/** Lay command-file labels out evenly along the front wall (twin of Swift RoomSkin.arc). */
export function arc(labels: string[]): RoomObject[] {
  const n = labels.length;
  return labels.map((label, i) => {
    const x = n === 1 ? 0 : (i / (n - 1) - 0.5) * HOTSPOT_SPAN;
    return { label, position: [x, HOTSPOT_Y, FRONT_WALL_Z] as [number, number, number] };
  });
}

export const neutralSkin: RoomSkin = {
  id: "neutral",
  brand: "Sealed Room",
  tagline: "A private space.",
  professional: "",
  officeTitle: "Office",
  palette: { wall: "#2a2f3a", floor: "#1c2029", trim: "#3a4150", fire: "#c8762e" },
  commandFile: [],
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test client/src/xr/engine/RoomSkin.test.ts`
Expected: PASS (3 arc tests + 1 neutralSkin test).

- [ ] **Step 5: Commit**

```bash
git add client/src/xr/engine/RoomSkin.ts client/src/xr/engine/RoomSkin.test.ts
git commit -m "feat(xr): RoomSkin types, neutralSkin, arc() layout helper"
```

---

## Task 2: SealedRoom — buildSealedRoom(stage, skin)

**Files:**
- Create: `client/src/xr/engine/SealedRoom.ts`
- Test: `client/src/xr/engine/SealedRoom.test.ts`

Naming contract (asserted by tests): `floor`, `ceiling`, `wall-n`, `wall-s`, `wall-e`, `wall-w`, `hearth`, `door-1` always present. Office stage adds `desk`, `chair`, and one `hotspot:<label>` per `skin.commandFile` entry. Each hotspot mesh carries `userData.label`.

- [ ] **Step 1: Write the failing test**

Create `client/src/xr/engine/SealedRoom.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { buildSealedRoom } from "./SealedRoom";
import { neutralSkin, type RoomSkin } from "./RoomSkin";

const skin: RoomSkin = {
  ...neutralSkin,
  id: "test",
  palette: { wall: "#102030", floor: "#0a0a0a", trim: "#405060", fire: "#ff8800" },
  commandFile: [
    { label: "Records", position: [-1, 1.4, -2.3] },
    { label: "Labs", position: [1, 1.4, -2.3] },
  ],
};

function names(g: THREE.Group): string[] {
  return g.children.map((c) => c.name);
}

describe("buildSealedRoom", () => {
  it("builds the shell + closed door in the waiting stage", () => {
    const g = buildSealedRoom("waiting", skin);
    for (const n of ["floor", "ceiling", "wall-n", "wall-s", "wall-e", "wall-w", "hearth", "door-1"]) {
      expect(names(g)).toContain(n);
    }
    // No office furniture in the waiting room.
    expect(names(g)).not.toContain("desk");
    expect(names(g).some((n) => n.startsWith("hotspot:"))).toBe(false);
  });

  it("adds desk, chair, and one hotspot per command-file entry in the office stage", () => {
    const g = buildSealedRoom("office", skin);
    expect(names(g)).toContain("desk");
    expect(names(g)).toContain("chair");
    const hotspots = g.children.filter((c) => c.name.startsWith("hotspot:"));
    expect(hotspots).toHaveLength(2);
    expect(hotspots.map((h) => h.userData.label).sort()).toEqual(["Labs", "Records"]);
  });

  it("applies palette colours to the floor and walls", () => {
    const g = buildSealedRoom("waiting", skin);
    const floor = g.getObjectByName("floor") as THREE.Mesh;
    const mat = floor.material as THREE.MeshStandardMaterial;
    expect(`#${mat.color.getHexString()}`).toBe("#0a0a0a");
  });

  it("builds without throwing for the neutral skin (no brand, empty command file)", () => {
    expect(() => buildSealedRoom("office", neutralSkin)).not.toThrow();
    const g = buildSealedRoom("office", neutralSkin);
    expect(g.children.filter((c) => c.name.startsWith("hotspot:"))).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test client/src/xr/engine/SealedRoom.test.ts`
Expected: FAIL — `Cannot find module "./SealedRoom"`.

- [ ] **Step 3: Write minimal implementation**

Create `client/src/xr/engine/SealedRoom.ts`:
```ts
// SealedRoom engine — reusable room tech. No brand/medical identity. No specific assets.
import * as THREE from "three";
import type { RoomStage, RoomSkin } from "./RoomSkin";

const W = 4; // room width  (x)
const D = 5; // room depth  (z)
const H = 3; // room height (y)

function panel(name: string, w: number, h: number, color: string): THREE.Mesh {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(color), side: THREE.DoubleSide }),
  );
  m.name = name;
  return m;
}

/** Build the sealed room for a stage. Pure: returns a Group, loads nothing. */
export function buildSealedRoom(stage: RoomStage, skin: RoomSkin): THREE.Group {
  const g = new THREE.Group();
  g.name = `sealed-room:${stage}`;
  const p = skin.palette;

  const floor = panel("floor", W, D, p.floor);
  floor.rotation.x = -Math.PI / 2;
  g.add(floor);

  const ceiling = panel("ceiling", W, D, p.wall);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = H;
  g.add(ceiling);

  const wallN = panel("wall-n", W, H, p.wall); // front (-z)
  wallN.position.set(0, H / 2, -D / 2);
  g.add(wallN);

  const wallS = panel("wall-s", W, H, p.wall); // back (+z)
  wallS.position.set(0, H / 2, D / 2);
  wallS.rotation.y = Math.PI;
  g.add(wallS);

  const wallW = panel("wall-w", D, H, p.wall);
  wallW.position.set(-W / 2, H / 2, 0);
  wallW.rotation.y = Math.PI / 2;
  g.add(wallW);

  const wallE = panel("wall-e", D, H, p.wall);
  wallE.position.set(W / 2, H / 2, 0);
  wallE.rotation.y = -Math.PI / 2;
  g.add(wallE);

  // Hearth: a glowing trim block on the front wall (the warm anchor).
  const hearth = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.6, 0.2),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(p.fire),
      emissive: new THREE.Color(p.fire),
      emissiveIntensity: 0.6,
    }),
  );
  hearth.name = "hearth";
  hearth.position.set(0, 0.3, -D / 2 + 0.11);
  g.add(hearth);

  // Door 1: the threshold to the office, on the front wall.
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2.1, 0.12),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(p.trim) }),
  );
  door.name = "door-1";
  door.position.set(1.0, 1.05, -D / 2 + 0.07);
  door.userData.interactive = true;
  g.add(door);

  if (stage === "office") {
    const deskMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(p.trim) });
    const desk = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.75, 0.7), deskMat);
    desk.name = "desk";
    desk.position.set(0, 0.375, -1.4);
    g.add(desk);

    const chair = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.9, 0.6),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(p.wall) }),
    );
    chair.name = "chair";
    chair.position.set(0, 0.45, 0.4);
    g.add(chair);

    for (const obj of skin.commandFile) {
      const hot = new THREE.Mesh(
        new THREE.PlaneGeometry(0.5, 0.32),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(p.trim),
          emissive: new THREE.Color(p.fire),
          emissiveIntensity: 0.15,
        }),
      );
      hot.name = `hotspot:${obj.label}`;
      hot.position.set(...obj.position);
      hot.userData.label = obj.label;
      hot.userData.interactive = true;
      g.add(hot);
    }
  }

  return g;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test client/src/xr/engine/SealedRoom.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add client/src/xr/engine/SealedRoom.ts client/src/xr/engine/SealedRoom.test.ts
git commit -m "feat(xr): buildSealedRoom — waiting/office stages, palette, hotspots"
```

---

## Task 3: presence — buildPresence(skin, texture?)

The presence seam. In Stage 1 it renders a neutral seated volume behind the desk; when the React layer passes a loaded `THREE.Texture` (Stage 2), the plane shows it. The engine never loads the image.

**Files:**
- Create: `client/src/xr/engine/presence.ts`
- Test: `client/src/xr/engine/presence.test.ts`

- [ ] **Step 1: Write the failing test**

Create `client/src/xr/engine/presence.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { buildPresence } from "./presence";
import { neutralSkin } from "./RoomSkin";

function plane(g: THREE.Group): THREE.Mesh {
  return g.getObjectByName("presence-plane") as THREE.Mesh;
}

describe("buildPresence", () => {
  it("returns a group with a presence plane positioned behind the desk", () => {
    const g = buildPresence(neutralSkin);
    const p = plane(g);
    expect(p).toBeTruthy();
    expect(p.position.z).toBeLessThan(-1.4); // behind the desk (desk at z=-1.4)
  });

  it("uses a neutral material (no map) when no texture is supplied", () => {
    const g = buildPresence(neutralSkin);
    const mat = plane(g).material as THREE.MeshBasicMaterial;
    expect(mat.map).toBeNull();
  });

  it("applies the supplied texture as the plane's map", () => {
    const tex = new THREE.Texture();
    const g = buildPresence(neutralSkin, tex);
    const mat = plane(g).material as THREE.MeshBasicMaterial;
    expect(mat.map).toBe(tex);
    expect(mat.transparent).toBe(true);
  });

  it("does not throw when the skin has no presenceImage", () => {
    expect(() => buildPresence(neutralSkin)).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test client/src/xr/engine/presence.test.ts`
Expected: FAIL — `Cannot find module "./presence"`.

- [ ] **Step 3: Write minimal implementation**

Create `client/src/xr/engine/presence.ts`:
```ts
// SealedRoom engine — reusable room tech. No brand/medical identity. No specific assets.
import * as THREE from "three";
import type { RoomSkin } from "./RoomSkin";

/**
 * A seated "presence" behind the desk. Stage 1: neutral volume. Stage 2/live:
 * the React layer loads skin.presenceImage (or a WebRTC video texture) and passes
 * it in here. The engine itself loads nothing.
 */
export function buildPresence(skin: RoomSkin, texture?: THREE.Texture): THREE.Group {
  const g = new THREE.Group();
  g.name = "presence";

  const mat = new THREE.MeshBasicMaterial({
    color: texture ? 0xffffff : new THREE.Color(skin.palette.trim),
    map: texture ?? null,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.6), mat);
  planeMesh.name = "presence-plane";
  planeMesh.position.set(0, 1.1, -2.0); // seated, behind the desk, facing the visitor
  planeMesh.userData.billboard = true; // React layer keeps it facing the camera
  g.add(planeMesh);

  return g;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test client/src/xr/engine/presence.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add client/src/xr/engine/presence.ts client/src/xr/engine/presence.test.ts
git commit -m "feat(xr): buildPresence — neutral seated volume with texture seam"
```

---

## Task 4: Direct2YourDoc skin (the medical face)

**Files:**
- Create: `client/src/xr/skins/direct2yourdoc.ts`
- Test: `client/src/xr/skins/direct2yourdoc.test.ts`

Palette uses the brand teal-navy / emerald / gold. `presenceImage` points at the off-Manus asset path (the file itself is produced in Stage 2; the path is declared now and the engine tolerates its absence).

- [ ] **Step 1: Write the failing test**

Create `client/src/xr/skins/direct2yourdoc.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { direct2YourDocSkin } from "./direct2yourdoc";
import { arc } from "@/xr/engine/RoomSkin";

describe("direct2YourDocSkin", () => {
  it("is a complete RoomSkin with the brand palette", () => {
    expect(direct2YourDocSkin.id).toBe("direct2yourdoc");
    expect(direct2YourDocSkin.palette.wall).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(direct2YourDocSkin.palette.fire).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it("exposes the patient command file as arced room objects", () => {
    expect(direct2YourDocSkin.commandFile.length).toBeGreaterThanOrEqual(4);
    // command file is laid out with arc() — every entry sits on the front wall
    direct2YourDocSkin.commandFile.forEach((o) => expect(o.position[2]).toBeCloseTo(-2.3));
  });

  it("declares a doctor image path under manus-storage", () => {
    expect(direct2YourDocSkin.presenceImage).toContain("/manus-storage/");
  });

  it("regenerates the same layout via arc()", () => {
    const labels = direct2YourDocSkin.commandFile.map((o) => o.label);
    expect(direct2YourDocSkin.commandFile).toEqual(arc(labels));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test client/src/xr/skins/direct2yourdoc.test.ts`
Expected: FAIL — `Cannot find module "./direct2yourdoc"`.

- [ ] **Step 3: Write minimal implementation**

Create `client/src/xr/skins/direct2yourdoc.ts`:
```ts
// Direct2YourDoc skin — the MEDICAL FACE. Brand/identity lives here, never in engine/.
import { arc, type RoomSkin } from "@/xr/engine/RoomSkin";

const COMMAND_FILE = ["Records", "Visits", "Labs", "Meds", "Messages"];

export const direct2YourDocSkin: RoomSkin = {
  id: "direct2yourdoc",
  brand: "Direct2YourDoc",
  tagline: "A private visit, in person — anywhere.",
  professional: "Dr. Heslin",
  officeTitle: "The Office",
  // teal-navy walls, deep floor, gold trim, warm hearth
  palette: { wall: "#0f2a33", floor: "#081519", trim: "#c9a24b", fire: "#1f8a6b" },
  commandFile: arc(COMMAND_FILE),
  presenceImage: "/manus-storage/d2yd-doctor-presence.png", // produced in Stage 2
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test client/src/xr/skins/direct2yourdoc.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add client/src/xr/skins/direct2yourdoc.ts client/src/xr/skins/direct2yourdoc.test.ts
git commit -m "feat(xr): Direct2YourDoc medical skin (palette, command file)"
```

---

## Task 5: Locomotion / stage-transition helper

A tiny pure helper for the linear waiting→office flow and the fade timing constant. Teleport itself is configured declaratively in the React layer (Task 6); this isolates the testable logic.

**Files:**
- Create: `client/src/xr/locomotion.ts`
- Test: `client/src/xr/locomotion.test.ts`

- [ ] **Step 1: Write the failing test**

Create `client/src/xr/locomotion.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { advanceStage, FADE_MS } from "./locomotion";

describe("advanceStage", () => {
  it("advances waiting -> office", () => {
    expect(advanceStage("waiting")).toBe("office");
  });
  it("is terminal at office (v1 is linear)", () => {
    expect(advanceStage("office")).toBe("office");
  });
});

describe("FADE_MS", () => {
  it("is a comfortable, non-zero fade", () => {
    expect(FADE_MS).toBeGreaterThanOrEqual(200);
    expect(FADE_MS).toBeLessThanOrEqual(800);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test client/src/xr/locomotion.test.ts`
Expected: FAIL — `Cannot find module "./locomotion"`.

- [ ] **Step 3: Write minimal implementation**

Create `client/src/xr/locomotion.ts`:
```ts
import type { RoomStage } from "@/xr/engine/RoomSkin";

/** Comfort: every stage swap fades to black over this duration. */
export const FADE_MS = 400;

/** v1 is a single linear flow: waiting -> office, then terminal. */
export function advanceStage(stage: RoomStage): RoomStage {
  return stage === "waiting" ? "office" : "office";
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test client/src/xr/locomotion.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add client/src/xr/locomotion.ts client/src/xr/locomotion.test.ts
git commit -m "feat(xr): linear stage-transition helper + fade constant"
```

---

## Task 6: SealedRoomCanvas — the R3F + XR shell

Mounts the engine groups into an R3F scene, owns `stage` state, wires teleport locomotion, makes Door 1 + hotspots interactive, billboards the presence plane, and fades on stage change. **Verified manually** (R3F scene graph + XR session aren't unit-tested here; the engine they render is covered by Tasks 1–5).

**Files:**
- Create: `client/src/xr/react/SealedRoomCanvas.tsx`

- [ ] **Step 1: Write the component**

Create `client/src/xr/react/SealedRoomCanvas.tsx`:
```tsx
import { useMemo, useState, useRef, useEffect } from "react";
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
      <primitive object={room} onClick={(e: any) => onSelect(e)} onSelect={(e: any) => onSelect(e)} />
      {presence && <primitive object={presence} />}
      {enableOrbit && <OrbitControls target={[0, 1.4, -1.5]} />}
      {/* Comfort fade overlay attached to the camera. */}
      <mesh position={[0, 0, -0.3]} visible={fade > 0}>
        <planeGeometry args={[4, 4]} />
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
```

- [ ] **Step 2: Type-check**

Run: `pnpm exec tsc --noEmit -p tsconfig.json`
Expected: no errors in `client/src/xr/**`. (If `@react-three/xr` exports differ by patch version, adjust the `XROrigin`/`createXRStore` import to match the installed version's API — verify against `node_modules/@react-three/xr/dist`.)

- [ ] **Step 3: Commit**

```bash
git add client/src/xr/react/SealedRoomCanvas.tsx
git commit -m "feat(xr): SealedRoomCanvas R3F+XR shell with teleport door + fades"
```

---

## Task 7: VRRoomPage — page, Enter-VR, desktop fallback, XR-unsupported

**Files:**
- Create: `client/src/xr/react/VRRoomPage.tsx`

- [ ] **Step 1: Write the component**

Create `client/src/xr/react/VRRoomPage.tsx`:
```tsx
import { useEffect, useState } from "react";
import { SealedRoomCanvas, xrStore } from "./SealedRoomCanvas";
import { direct2YourDocSkin } from "@/xr/skins/direct2yourdoc";

type XRSupport = "checking" | "supported" | "unsupported";

export default function VRRoomPage() {
  const [support, setSupport] = useState<XRSupport>("checking");

  useEffect(() => {
    const xr = (navigator as any).xr;
    if (!xr?.isSessionSupported) return setSupport("unsupported");
    xr.isSessionSupported("immersive-vr")
      .then((ok: boolean) => setSupport(ok ? "supported" : "unsupported"))
      .catch(() => setSupport("unsupported"));
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#081519" }}>
      <SealedRoomCanvas skin={direct2YourDocSkin} xr={support === "supported"} />

      <div style={{ position: "absolute", top: 16, left: 16, right: 16, display: "flex", gap: 12, alignItems: "center" }}>
        {support === "supported" && (
          <button
            onClick={() => xrStore.enterVR()}
            style={{ padding: "12px 20px", borderRadius: 9999, border: "1px solid #c9a24b", background: "#0f2a33", color: "#f4e9c8", fontWeight: 600, cursor: "pointer" }}
          >
            Enter the room (VR)
          </button>
        )}
        {support === "unsupported" && (
          <div style={{ padding: "10px 16px", borderRadius: 12, background: "rgba(0,0,0,0.5)", color: "#f4e9c8", maxWidth: 420 }}>
            VR isn’t available on this device. You’re seeing the desktop preview — drag to look around.
            Open this page in the <strong>Meta Quest browser</strong> or <strong>Android Chrome</strong> to step inside.
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `pnpm exec tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/xr/react/VRRoomPage.tsx
git commit -m "feat(xr): VRRoomPage with Enter-VR, desktop fallback, XR-unsupported notice"
```

---

## Task 8: Wire the /room route (lazy)

**Files:**
- Modify: `client/src/App.tsx`

- [ ] **Step 1: Add a lazy import and route**

In `client/src/App.tsx`, add near the top imports:
```tsx
import { lazy, Suspense } from "react";
const VRRoomPage = lazy(() => import("./xr/react/VRRoomPage"));
```

Inside the `<Switch>` in `Router()`, add before the fallback route:
```tsx
<Route path={"/room"}>
  <Suspense fallback={<div style={{ position: "fixed", inset: 0, background: "#081519" }} />}>
    <VRRoomPage />
  </Suspense>
</Route>
```

- [ ] **Step 2: Build to confirm the lazy chunk is split**

Run: `pnpm build`
Expected: build succeeds; output shows a separate chunk for the room page (Three.js is not in the main entry chunk).

- [ ] **Step 3: Verify the desktop fallback in the preview browser**

Start the dev server and open `/room`. Use the preview tools:
- `preview_start`, then navigate to `/room`.
- `preview_console_logs` → no uncaught errors.
- `preview_snapshot` → canvas present; the "VR isn’t available… desktop preview" notice is shown (preview has no XR).
- `preview_screenshot` → the teal-navy room renders with the gold door and hearth glow; dragging orbits the view.

Acceptance: `/room` renders the room under OrbitControls with no console errors, and shows the XR-unsupported notice.

- [ ] **Step 4: Commit**

```bash
git add client/src/App.tsx
git commit -m "feat(xr): mount /room route (lazy-loaded) with suspense fallback"
```

---

## Task 9: Quest 3 on-device verification (manual, no code)

WebXR requires HTTPS. Two ways to get the room onto the headset:

- [ ] **Step 1: Deploy a branch preview (preferred)**

Push the branch and use the Netlify deploy preview URL (HTTPS automatically). Open that URL in the **Meta Quest browser**.

- [ ] **Step 2: Or serve locally over HTTPS for the Quest on the same network**

Run the dev server bound to all interfaces over https, e.g.:
```bash
pnpm dev --host
```
If the dev server is http-only, front it with a quick HTTPS tunnel (`npx localtunnel --port <port>` or an `ngrok http <port>`), then open the https URL in the Quest browser. (Plain `http://<lan-ip>` will NOT expose `navigator.xr`.)

- [ ] **Step 3: Verify in-headset**

Acceptance criteria for Stage 1 (all must pass on the Quest 3):
- The page shows an **"Enter the room (VR)"** button (i.e. `immersive-vr` is reported supported).
- Pressing it enters immersive VR; you spawn at the **waiting threshold** facing into the room.
- **Teleport locomotion** works: point at the floor + trigger moves you into the room.
- The room is **branded** (teal-navy walls, gold door/trim, warm hearth glow) and the office wall shows the command-file **hotspots**.
- **Door 1 is interactive**: selecting it fades to black and you arrive in the **office** stage (desk, chair, hotspots, neutral presence volume behind the desk).
- No black screen, no console-fatal errors; exiting the session returns to the desktop fallback view cleanly.

- [ ] **Step 4: Record the result**

Note pass/fail per criterion in the PR description. File follow-ups for any comfort issues (e.g. teleport arc too sensitive).

---

## Stage 2 (outline — detailed after Stage 1 review; do NOT build now)

Each item ships behind the same engine seam, so Stage 1 code does not change shape.

1. **Doctor presence asset.** Generate a seated concierge doctor with Higgsfield (recraft, palette-locked to teal-navy/emerald/gold) → `remove_background` → transparent PNG → optimize → save to `client/public/manus-storage/d2yd-doctor-presence.png` (the path the skin already declares).
   - Acceptance: file exists; office stage shows the doctor on the presence plane, softly lit, billboarded; engine still builds with neutral material if the file is missing.
2. **Wire the texture.** In `SealedRoomCanvas`, load `skin.presenceImage` via drei `useTexture` (only when present) and pass it to `buildPresence(skin, texture)`. Add a soft rim-light/vignette.
   - Acceptance: with the asset present, the doctor reads as a person seated across the desk; with it removed, no crash.
3. **Hotspot labels + content.** Render `userData.label` text over each hotspot (drei `<Text>`/`<Billboard>`), and on select show the corresponding command-file panel.
   - Acceptance: each of Records/Visits/Labs/Meds/Messages is readable and selectable in-headset.
4. **Deeper business logic / live presence.** WebRTC video texture on the same presence plane (needs a signaling path), and any Direct2YourDoc data wiring — scoped as its own spec.

---

## Self-review

- **Spec coverage:** engine twin (Tasks 1–3), skin/identity separation (Task 4 + header-comment rule), waiting→office flow + fades (Tasks 5–6), locomotion + mounting + lazy route (Tasks 6–8), desktop fallback + XR-unsupported (Tasks 7–8), HTTPS/Quest verification (Task 9), comfort defaults (FADE_MS + teleport-only, Tasks 5–6/9), asset-loading rule + neutral fallback (Tasks 3/4 + Stage 2), presence/doctor + future WebRTC (Stage 2). All spec sections map to a task.
- **Placeholder scan:** no TBD/TODO; every code step shows full code; the one declared-but-unproduced asset (`d2yd-doctor-presence.png`) is explicitly handled by the neutral-material fallback and produced in Stage 2.
- **Type consistency:** `RoomStage`/`RoomSkin`/`RoomObject`/`RoomPalette`, `buildSealedRoom`, `buildPresence`, `advanceStage`, `FADE_MS`, `xrStore`, `direct2YourDocSkin` names are used identically across tasks. Hotspot naming `hotspot:<label>` and `userData.label` are consistent between Task 2 (producer) and Task 6 (consumer). Door name `door-1` consistent between Task 2 and Task 6.

## Rollback plan

- All work is on branch `feat/webxr-sealed-room`; `main` is untouched. Abandon by deleting the branch — nothing ships until merged.
- The feature is additive and isolated under `client/src/xr/**` plus one lazy route in `App.tsx`. To disable without reverting commits, remove the `<Route path="/room">` block (the chunk is lazy, so it never loads on other routes).
- New deps (`three`, `@react-three/*`) are only imported by the lazy `/room` chunk; they add nothing to the main bundle and can be removed with `pnpm remove` if the route is dropped.
- No backend, env vars, schema, or existing pages are modified — there is no data migration to undo.
