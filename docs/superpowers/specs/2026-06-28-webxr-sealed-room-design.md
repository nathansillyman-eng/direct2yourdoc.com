# WebXR Sealed Room — design

**Date:** 2026-06-28
**Branch:** `feat/webxr-sealed-room`
**Status:** approved design, pre-implementation

## Goal

Bring the Direct2YourDoc / Sanctum "sealed room" experience to **Meta Quest 3 and
other Android-powered VR** without forking the iOS/visionOS Swift work. The Quest
runs an Android stack and cannot execute any of the existing Swift / RealityKit
code, so this is a **fresh WebXR build**, not a port — delivered as a VR mode inside
the existing MedAssurance React/Vite web app. Because it is WebXR, the same build
runs in the **Quest Browser** and in **Android Chrome**, with no app-store path.

This build is the **web twin of `SanctumEngine`**: it mirrors the Swift engine's
exact "one engine, two faces" boundary so the spatial experience stays
conceptually identical to the visionOS one instead of diverging.

### Strategic note
The prior Sanctum decision was "Vision-Pro-over-Quest." This WebXR lane is treated
as a **parallel hedge** — built in the web stack while the iOS/visionOS work
deepens — not a reversal of that decision. It reuses the real brand/content and
costs little because it shares the existing web app.

## v1 scope

A **walkable, branded sealed room with a seated concierge-doctor presence.**

- Spawn in the **waiting room**; **Door 1** is the focal element.
- Teleport to Door 1, trigger it → fade-to-black → scene rebuilds at the **office**
  stage → seated **concierge-doctor presence** fades in across the desk.
- Office wall shows the **patient command file** labels arced
  (Records · Visits · Labs · Meds · Messages), echoing the iOS app's command-file tab.
- Palette is the brand teal-navy / emerald / gold.

**Out of scope for v1:** live WebRTC video of the doctor, rigged 3D avatars,
scheduling/auth/records logic, multi-room beyond waiting→office. The doctor
presence surface is designed so live video or a rigged avatar is a later drop-in.

## Architecture

Framework-agnostic Three.js engine (the twin of `SanctumEngine`) with a thin
React/R3F mounting + XR-session shell on top. The engine owns immersion; it knows
nothing about medicine or brand. A **skin** supplies identity.

```
MedAssurance/client/src/xr/
  engine/                    ← web twin of SanctumEngine (plain Three.js, no React)
    RoomSkin.ts              ← RoomStage, RoomPalette, RoomObject, RoomSkin, neutralSkin, arc()
    SealedRoom.ts            ← buildSealedRoom(stage, skin) → THREE.Group
    presence.ts              ← buildPresence(skin) → seated-doctor billboard plane
  skins/
    direct2yourdoc.ts        ← the medical SKIN (brand, palette, copy, commandFile, doctorImage)
  react/
    SealedRoomCanvas.tsx     ← R3F <Canvas>+<XR> shell: mounts group, owns stage + locomotion
    VRRoomPage.tsx           ← route page: Enter-VR button + desktop fallback preview
  locomotion.ts              ← teleport + Door-1 stage transition
```

### Engine API (mirrors the Swift surface ~1:1)

```ts
type RoomStage = 'waiting' | 'office';
interface RoomPalette { wall: string; floor: string; trim: string; fire: string; } // hex
interface RoomObject  { label: string; position: [number, number, number]; }
interface RoomSkin {
  id: string;
  brand: string;
  tagline: string;
  professional: string;       // e.g. the doctor's name/title
  officeTitle: string;
  palette: RoomPalette;
  commandFile: RoomObject[];   // arced labels in the office
  doctorImage?: string;        // optional — engine never hard-depends on it
}
function arc(labels: string[]): RoomObject[];        // layout helper (twin of RoomSkin.arc)
const neutralSkin: RoomSkin;                          // the empty engine room
function buildSealedRoom(stage: RoomStage, skin: RoomSkin): THREE.Group;
function buildPresence(skin: RoomSkin): THREE.Group;  // office stage only
```

### Key invariant
The engine **never hard-depends on skin images**. A missing `doctorImage` (or any
texture) → the room still builds with neutral materials. No medical or brand
identity lives in `engine/`; it lives only in `skins/`.

## Data flow / stages

- Single linear flow for v1: **waiting → office**.
- `stage` is React state in `SealedRoomCanvas`. On change: dispose the old
  `THREE.Group` (geometries, materials, textures) and build the new one via
  `buildSealedRoom`. Door-1 trigger drives a fade-to-black during the swap.
- `buildSealedRoom('waiting', …)`: floor, four walls, ceiling, hearth/fire glow,
  Door 1 (closed, the threshold to the office).
- `buildSealedRoom('office', …)`: same shell + desk + chair + arced commandFile
  labels; `buildPresence` adds the billboarded seated doctor behind the desk.

## Locomotion & mounting

- `@react-three/xr` provides the VR session, controllers, hand-tracking, **teleport**
  (point at floor + trigger), and snap-turn. Comfort-first: fade transitions, no
  smooth artificial locomotion by default. Room ~4×5m; seated or standing both work.
- `VRRoomPage` mounts as a **lazy-loaded route `/room`** in `App.tsx`, so Three.js
  never bloats the main bundle.
- **Desktop / phone (no XR) fallback:** the same room renders under OrbitControls,
  so the route is never a dead end and it can be verified in a normal browser
  without a headset.
- WebXR requires HTTPS — automatic on Netlify. Local on-device testing needs an
  https dev host (documented in the implementation plan).

## Doctor presence asset

- Higgsfield-generated seated concierge doctor, palette-locked (recraft) to the
  teal-navy/emerald/gold so it matches the room.
- `remove_background` → transparent PNG → billboarded textured plane behind the
  desk, with a soft rim-light/vignette so it reads as presence, not a cutout.
- Stored in `client/public/manus-storage/` per the off-Manus / Cloudflare
  asset-localization convention.
- The presence surface is the upgrade seam: a rigged avatar or **live WebRTC video**
  later renders on this same plane.

## Error handling

- **WebXR unsupported** → show the desktop fallback preview plus a friendly
  "open this on your Quest or in Android Chrome" note.
- **Asset/texture load failure** → engine builds the room with neutral materials;
  no crash, no blank scene.
- **XR session end** → return cleanly to the fallback view.

## Testing

- Engine builders are **pure functions returning `THREE.Group`** → unit-tested in
  Node with **vitest**: assert object counts, positions, and materials per
  `stage`/`skin`; assert the neutral-material fallback when images are absent;
  assert `arc()` layout. **Tests written first (TDD).**
- The R3F/XR shell is verified manually: desktop fallback in the preview browser,
  then on-device on the Quest.

## Dependencies (new)

`three`, `@react-three/fiber` (v9 — React 19 compatible), `@react-three/xr`,
`@react-three/drei`. All MIT.

## Future (explicitly deferred)

- Live WebRTC telepresence on the presence plane (needs a signaling path).
- Rigged 3D doctor avatar.
- Additional rooms / vertical skins reusing the same engine (the "room factory"
  web twin).
- Auth, scheduling, records, and other Direct2YourDoc business logic.
