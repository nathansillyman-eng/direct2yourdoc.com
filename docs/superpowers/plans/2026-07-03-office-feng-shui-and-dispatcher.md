# Office Feng-Shui Pass + Instance Dispatcher — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the concretely-buildable slice of `docs/superpowers/specs/2026-07-03-office-live-handoff-design.md` — a calm-positive feng-shui touch in the office room, a softer office lighting pass, and two pure-logic modules (room-instance dispatcher, booking-day/time selection) that the live-handoff and booking UI will wire into later.

**Architecture:** Follows the existing room-factory pattern exactly — engine geometry stays skin-agnostic (`SealedRoom.ts`), stage lighting stays in `lighting-config.ts`, and the two new subsystems (dispatcher, booking selection) are new pure, stateless-transform modules under `client/src/xr/engine/` with no rendering/React/network code — same shape as the existing `presence.ts` / `locomotion.ts` pure modules. No new dependencies. No live networking, voice, or avatar puppeting is implemented in this plan (that's `docs/superpowers/specs/2026-07-03-office-live-handoff-design.md` §4, a separate future spec).

**Tech Stack:** TypeScript, Three.js, Vitest (existing project stack — no additions).

---

## Task 1: Office living-element (feng-shui calm-positive pass)

**Files:**
- Modify: `client/src/xr/engine/SealedRoom.ts` (add a plant group inside the `stage === "office"` block, after the `patientSeat` block and before the command-file hotspot loop, around line 378)
- Test: `client/src/xr/engine/SealedRoom.test.ts`

- [ ] **Step 1: Write the failing test**

Add this test inside the existing `describe("office back wall + seating", ...)` block in `client/src/xr/engine/SealedRoom.test.ts` (after the `"adds a patient sit-anchor seat..."` test, before the closing `});` of that describe):

```ts
  it("adds a living plant element to the office (feng-shui calm-positive direction)", () => {
    const g = buildSealedRoom("office", greeting);
    expect(names(g)).toContain("office-plant");
    const w = buildSealedRoom("waiting", greeting);
    expect(names(w)).not.toContain("office-plant");
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr/engine/SealedRoom.test.ts -t "living plant"`
Expected: FAIL — `expect(names(g)).toContain("office-plant")` fails, no such name exists yet.

- [ ] **Step 3: Write minimal implementation**

In `client/src/xr/engine/SealedRoom.ts`, inside the `if (stage === "office") {` block, immediately after the `patientSeat` section ends (`g.add(patientSeat);`) and before the `// Command-file hotspots` comment, insert:

```ts
    // Feng-shui living element (calm-positive design direction, spec
    // 2026-07-03-office-live-handoff-design.md §2): a plant reads as living/breathing,
    // not sterile-clinical. Placed in the free corner beside the desk, clear of the
    // door-to-seat walking path (door at x≈1.0, path runs along x≈0).
    const plant = new THREE.Group();
    plant.name = "office-plant";
    plant.position.set(1.55, 0, -1.85);
    const potMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(p.floor).lerp(new THREE.Color(p.trim), 0.15),
      roughness: 0.75,
      metalness: 0.05,
    });
    const leafMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#4a6b52"),
      roughness: 0.8,
      metalness: 0.0,
    });
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.32, 12), potMat);
    pot.position.y = 0.16;
    plant.add(pot);
    const leafPositions: [number, number, number][] = [
      [0, 0.55, 0],
      [0.12, 0.62, 0.08],
      [-0.1, 0.6, -0.09],
      [0.05, 0.72, -0.06],
    ];
    leafPositions.forEach((pos, i) => {
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.4, 6), leafMat);
      leaf.position.set(...pos);
      leaf.rotation.z = (i - 1.5) * 0.35;
      plant.add(leaf);
    });
    g.add(plant);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr/engine/SealedRoom.test.ts`
Expected: PASS — all tests in the file, including the new one.

- [ ] **Step 5: Commit**

```bash
git add client/src/xr/engine/SealedRoom.ts client/src/xr/engine/SealedRoom.test.ts
git commit -m "Office: add a living plant element (feng-shui calm-positive pass)"
```

---

## Task 2: Office lighting — soften for calm-positive (no harsh clinical key light)

**Files:**
- Modify: `client/src/xr/react/lighting-config.ts:29-39` (the `stage === "office"` branch of `lightingForStage`)
- Test: `client/src/xr/react/lighting-config.test.ts`

- [ ] **Step 1: Write the failing test**

Add this test inside the existing `describe("lightingForStage", ...)` block in `client/src/xr/react/lighting-config.test.ts` (after the existing `"office is warm..."` test):

```ts
  it("office reads calm-positive: a soft key (not a harsh clinical spot) and lifted ambient fill", () => {
    const l = lightingForStage("office", palette);
    expect(l.key.intensity).toBeLessThanOrEqual(1.3);
    expect(l.ambient).toBeGreaterThanOrEqual(0.48);
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr/react/lighting-config.test.ts -t "calm-positive"`
Expected: FAIL — current values are `key.intensity: 1.5` (> 1.3) and `ambient: 0.42` (< 0.48).

- [ ] **Step 3: Write minimal implementation**

In `client/src/xr/react/lighting-config.ts`, replace the `office` branch's `ambient` and `key` values:

```ts
  if (stage === "office") {
    return {
      ambient: 0.5,
      hemisphere: { sky: "#43342a", ground: "#241811", intensity: 0.55 },
      key: { color: "#ffdcae", intensity: 1.25, position: [2.5, 4, 2.5], castShadow: true },
      fill: { color: "#e9c58a", intensity: 6, position: [-2, 2.2, 1] },
      rim: { color: palette.trim, intensity: 0.45, position: [-1, 3, -3.5] },
      feature: {
        color: "#ffcaa0", intensity: 2.6, position: [1.5, 1.7, -0.4],
        distance: 5, decay: 2, flicker: "warm", base: 2.6, amp: 0.35,
      },
    };
  }
```

(Only `ambient` — 0.42 → 0.5 — and `key.intensity` — 1.5 → 1.25 — change; everything else in the branch is unchanged.)

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr/react/lighting-config.test.ts`
Expected: PASS — all tests in the file, including the pre-existing `"waiting is cooler/brighter..."` test (0.5 ambient / 1.25 key is still less bright than waiting's 0.72 ambient / 1.85 key, so that comparison still holds).

- [ ] **Step 5: Commit**

```bash
git add client/src/xr/react/lighting-config.ts client/src/xr/react/lighting-config.test.ts
git commit -m "Office lighting: soften key + lift ambient for calm-positive feel"
```

---

## Task 3: Room-instance dispatcher (pure logic — backstage control-panel model)

Implements spec §5: one room definition, instantiated per patient; the founder/doctor's active
presence hops between instances via a dispatcher, never a physical door/hallway.

**Files:**
- Create: `client/src/xr/engine/roomInstances.ts`
- Test: `client/src/xr/engine/roomInstances.test.ts`

- [ ] **Step 1: Write the failing test**

Create `client/src/xr/engine/roomInstances.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  emptyDispatcherState,
  createInstance,
  enterInstance,
  leaveActiveInstance,
  closeInstance,
} from "./roomInstances";

describe("roomInstances dispatcher", () => {
  it("starts empty with no active instance", () => {
    const state = emptyDispatcherState();
    expect(state.instances).toEqual([]);
    expect(state.activeInstanceId).toBeNull();
  });

  it("creates a waiting instance without changing the active instance", () => {
    const state = createInstance(emptyDispatcherState(), "p1", "Jane D.");
    expect(state.instances).toEqual([{ id: "p1", patientLabel: "Jane D.", status: "waiting" }]);
    expect(state.activeInstanceId).toBeNull();
  });

  it("entering an instance marks it in-session and active", () => {
    let state = createInstance(emptyDispatcherState(), "p1", "Jane D.");
    state = enterInstance(state, "p1");
    expect(state.activeInstanceId).toBe("p1");
    expect(state.instances.find((i) => i.id === "p1")!.status).toBe("in-session");
  });

  it("entering a second instance auto-releases the first back to waiting", () => {
    let state = createInstance(emptyDispatcherState(), "p1", "Jane D.");
    state = createInstance(state, "p2", "Sam R.");
    state = enterInstance(state, "p1");
    state = enterInstance(state, "p2");
    expect(state.activeInstanceId).toBe("p2");
    expect(state.instances.find((i) => i.id === "p1")!.status).toBe("waiting");
    expect(state.instances.find((i) => i.id === "p2")!.status).toBe("in-session");
  });

  it("entering an unknown instance id throws", () => {
    expect(() => enterInstance(emptyDispatcherState(), "missing")).toThrow(
      "roomInstances: no instance with id \"missing\"",
    );
  });

  it("leaving the active instance clears active and returns it to waiting", () => {
    let state = createInstance(emptyDispatcherState(), "p1", "Jane D.");
    state = enterInstance(state, "p1");
    state = leaveActiveInstance(state);
    expect(state.activeInstanceId).toBeNull();
    expect(state.instances.find((i) => i.id === "p1")!.status).toBe("waiting");
  });

  it("leaving with no active instance is a no-op", () => {
    const state = createInstance(emptyDispatcherState(), "p1", "Jane D.");
    expect(leaveActiveInstance(state)).toEqual(state);
  });

  it("closing an instance removes it and clears active if it was active", () => {
    let state = createInstance(emptyDispatcherState(), "p1", "Jane D.");
    state = enterInstance(state, "p1");
    state = closeInstance(state, "p1");
    expect(state.instances).toEqual([]);
    expect(state.activeInstanceId).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr/engine/roomInstances.test.ts`
Expected: FAIL with "Cannot find module './roomInstances'".

- [ ] **Step 3: Write minimal implementation**

Create `client/src/xr/engine/roomInstances.ts`:

```ts
// Room-instance dispatcher — pure logic (spec 2026-07-03-office-live-handoff-design.md §5).
// One room DEFINITION, instantiated fresh per patient session. The founder/doctor's live
// presence hops between instances via this dispatcher (a backstage control panel), never
// a physical in-world hallway/door — chosen as the simpler build. No rendering, no
// networking: this module only tracks which instance is "active" (who the operator is
// currently present in) and each instance's status.

export type RoomInstanceStatus = "waiting" | "in-session" | "closed";

export interface RoomInstanceRecord {
  id: string;
  patientLabel: string;
  status: RoomInstanceStatus;
}

export interface DispatcherState {
  instances: RoomInstanceRecord[];
  activeInstanceId: string | null;
}

export function emptyDispatcherState(): DispatcherState {
  return { instances: [], activeInstanceId: null };
}

function findOrThrow(state: DispatcherState, id: string): RoomInstanceRecord {
  const instance = state.instances.find((i) => i.id === id);
  if (!instance) throw new Error(`roomInstances: no instance with id "${id}"`);
  return instance;
}

export function createInstance(state: DispatcherState, id: string, patientLabel: string): DispatcherState {
  return {
    ...state,
    instances: [...state.instances, { id, patientLabel, status: "waiting" }],
  };
}

export function enterInstance(state: DispatcherState, id: string): DispatcherState {
  findOrThrow(state, id);
  const instances = state.instances.map((instance) => {
    if (instance.id === id) return { ...instance, status: "in-session" as const };
    if (instance.id === state.activeInstanceId && instance.status === "in-session") {
      return { ...instance, status: "waiting" as const };
    }
    return instance;
  });
  return { instances, activeInstanceId: id };
}

export function leaveActiveInstance(state: DispatcherState): DispatcherState {
  if (state.activeInstanceId === null) return state;
  const activeId = state.activeInstanceId;
  const instances = state.instances.map((instance) =>
    instance.id === activeId ? { ...instance, status: "waiting" as const } : instance,
  );
  return { instances, activeInstanceId: null };
}

export function closeInstance(state: DispatcherState, id: string): DispatcherState {
  findOrThrow(state, id);
  return {
    instances: state.instances.filter((i) => i.id !== id),
    activeInstanceId: state.activeInstanceId === id ? null : state.activeInstanceId,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr/engine/roomInstances.test.ts`
Expected: PASS — all 8 tests.

- [ ] **Step 5: Commit**

```bash
git add client/src/xr/engine/roomInstances.ts client/src/xr/engine/roomInstances.test.ts
git commit -m "Add room-instance dispatcher (pure logic, backstage control-panel model)"
```

---

## Task 4: Booking day/time selection (pure logic — "draw an X" as tap-to-select)

Implements spec §3/§9: visitor picks a day cell then a time cell (rendered with an X-mark
confirmation in the UI layer, built later) rather than freehand stroke-drawing.

**Files:**
- Create: `client/src/xr/engine/bookingSelection.ts`
- Test: `client/src/xr/engine/bookingSelection.test.ts`

- [ ] **Step 1: Write the failing test**

Create `client/src/xr/engine/bookingSelection.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  emptyBookingSelection,
  selectDay,
  selectTime,
  confirmBooking,
} from "./bookingSelection";

describe("bookingSelection", () => {
  it("starts with nothing selected", () => {
    expect(emptyBookingSelection()).toEqual({ dayId: null, timeId: null, confirmed: false });
  });

  it("selecting a day sets dayId and clears any prior time/confirmation", () => {
    const selection = selectDay(emptyBookingSelection(), "2026-07-05");
    expect(selection).toEqual({ dayId: "2026-07-05", timeId: null, confirmed: false });
  });

  it("changing the day after a time was picked clears the time", () => {
    let selection = selectDay(emptyBookingSelection(), "2026-07-05");
    selection = selectTime(selection, "14:00");
    selection = selectDay(selection, "2026-07-06");
    expect(selection).toEqual({ dayId: "2026-07-06", timeId: null, confirmed: false });
  });

  it("selecting a time without a day first throws", () => {
    expect(() => selectTime(emptyBookingSelection(), "14:00")).toThrow(
      "bookingSelection: pick a day before a time",
    );
  });

  it("selecting a time after a day sets timeId", () => {
    const selection = selectTime(selectDay(emptyBookingSelection(), "2026-07-05"), "14:00");
    expect(selection).toEqual({ dayId: "2026-07-05", timeId: "14:00", confirmed: false });
  });

  it("confirming without both day and time throws", () => {
    expect(() => confirmBooking(selectDay(emptyBookingSelection(), "2026-07-05"))).toThrow(
      "bookingSelection: day and time must be selected before confirming",
    );
  });

  it("confirming with both day and time sets confirmed", () => {
    const selection = confirmBooking(selectTime(selectDay(emptyBookingSelection(), "2026-07-05"), "14:00"));
    expect(selection).toEqual({ dayId: "2026-07-05", timeId: "14:00", confirmed: true });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr/engine/bookingSelection.test.ts`
Expected: FAIL with "Cannot find module './bookingSelection'".

- [ ] **Step 3: Write minimal implementation**

Create `client/src/xr/engine/bookingSelection.ts`:

```ts
// Booking day/time selection — pure logic (spec 2026-07-03-office-live-handoff-design.md
// §3/§9). Nate's "draw an X on the day, then an X on the time" is realised as tap-to-select
// day/time cells that render an X-mark on selection — not freehand stroke recognition
// (chosen: same visual outcome, far more reliable on VR controllers/hand-tracking).

export interface BookingSelection {
  dayId: string | null;
  timeId: string | null;
  confirmed: boolean;
}

export function emptyBookingSelection(): BookingSelection {
  return { dayId: null, timeId: null, confirmed: false };
}

export function selectDay(selection: BookingSelection, dayId: string): BookingSelection {
  return { dayId, timeId: null, confirmed: false };
}

export function selectTime(selection: BookingSelection, timeId: string): BookingSelection {
  if (selection.dayId === null) throw new Error("bookingSelection: pick a day before a time");
  return { ...selection, timeId, confirmed: false };
}

export function confirmBooking(selection: BookingSelection): BookingSelection {
  if (selection.dayId === null || selection.timeId === null) {
    throw new Error("bookingSelection: day and time must be selected before confirming");
  }
  return { ...selection, confirmed: true };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr/engine/bookingSelection.test.ts`
Expected: PASS — all 7 tests.

- [ ] **Step 5: Commit**

```bash
git add client/src/xr/engine/bookingSelection.ts client/src/xr/engine/bookingSelection.test.ts
git commit -m "Add booking day/time selection logic (tap-to-select, X-mark confirmation)"
```

---

## Task 5: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `corepack pnpm@10.4.1 exec vitest run client/src/xr`
Expected: PASS — every test file under `client/src/xr`, including all four new/modified ones above.

- [ ] **Step 2: Type-check**

Run: `corepack pnpm@10.4.1 exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Build**

Run: `corepack pnpm@10.4.1 exec vite build`
Expected: build succeeds (confirms the office scene changes don't break the bundle).

- [ ] **Step 4: Visual check on the dev server**

Run the `medassurance-webxr-doorfix` preview (port 5183), open `/room?stage=office`, and confirm:
- the plant renders in the right-rear corner, clear of the desk/patient-seat sightline
- the office no longer has a stark hot spotlight — light should read softer/warmer than before

No commit for this task (verification only) — if the visual check reveals a problem, fix it as
an amendment to Task 1 or 2 above, re-run their tests, and commit the fix separately.
