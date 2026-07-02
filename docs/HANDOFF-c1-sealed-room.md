# Direct2YourDoc — WebXR Sealed Room · Session Handoff (Claude 1)

_Last updated: 2026-07-02. Branch tip `3fa0ddf`._

---

## 0. OPERATING RULES (read first, every session)

**Lane discipline — stay in YOUR lane only.**
- This lane = the **Direct2YourDoc WebXR sealed room** (the `/room` route + its engine/skin/assets) and the D2YD medical front door + iOS. Work ONLY in your own worktree/branch.
- **Never** edit another lane's files, work in another session's worktree, or touch a shared file (e.g. a root `package.json`, `Nav.tsx`) without STOPPING and flagging Nate / the Tower (Claude 5) first.
- **Never** `git checkout main`, merge to `main`, `reset --hard`, or juggle worktrees. **The Tower sequences ALL merges to main.** When your work is verify-green, hand the branch to the Tower.
- **Commit as you go** (uncommitted work is what gets destroyed in a collision). **Never force-push.**
- Production go-live on `direct2yourdoc.com` is **gated on Nate** — never self-deploy.

**Communicating with Nate — keep it SHORT.**
- Give Nate **1–2 sentence** answers and requests. When you have a question for him, ask it in 1–2 sentences. Do the deep work silently (tools, specs, memory); the chat reply stays tiny and leads with what he needs to decide or do.
- When he must do a hands-on step, drip-feed **one step at a time** and wait for confirmation.

**Brand rules (locked).**
- Nate = **sole founder AND the host/connector** who introduces the client to a network doctor. Credit is Nate's alone.
- The in-room doctor = a **de-identified generic network physician**. Name vars `presence`/`doctor`, never `andrew`/`heslin`. **No picture/likeness of Andrew anywhere** (a name + quote in text is OK; a face is not).

---

## 1. What this is

A two-room WebXR "sealed room" telemedicine experience served at **`/room`**: a **waiting room** (greeting) → through **Door 1** → a **doctor's office**, where the visitor is seated across the desk from a physician. Quest 3 is the primary target; a desktop OrbitControls preview is the fallback. It is one lazy `/room` chunk — the live medical site bundle is untouched.

## 2. Where the work lives

- **Worktree:** `~/medassurance-webxr-doorfix` (repo dir is named MedAssurance; brand is Direct2YourDoc — MedAssurance is RETIRED).
- **Phase B branch (current):** `feat/webxr-cast-phase-b` — tip **`3fa0ddf`**, off the Phase-A branch. **Local-only; Tower to back up to origin.**
- **Phase A branch:** `fix/webxr-door-threshold` (the "gorgeous room shell"). Handed to Tower; MERGE-READY.
- **Front-door (separate lane, handed off):** `frontdoor/founder-bio-photo-thumbnail` (real founder portrait + bio + OG thumbnail) — awaiting a Netlify deploy-preview; go-live gated on Nate.
- Design specs + plan: `docs/superpowers/specs/` and `docs/superpowers/plans/`. Live-state memory: `webxr-sealed-room-build` (+ `brand-lane-map`, `medassurance-repo-setup`).

## 3. Current state (what's built)

- **Room shell (Phase A):** red-oak greeting skin is the default (`?skin=classic` = old teal). Waterfall→koi→gold-KM feature wall (waiting only), reception desk, warm lavender-accent → now **greige** chairs, office with credential/bookshelf wall + patient seat, Door 1 threshold with comfort fade. Per-room lighting rig (shadow key + fill + rim + feature shimmer), ContactShadows, procedural IBL for gold reflection.
- **Cast (Phase B):** full greeting party as real generated 3D — **host = Nate's likeness** (suit, gold suspenders, emerald tie), pregnant woman, husband (all rigged + idle); **de-identified doctor** in the office. GLBs in `client/public/models/`, placed via `RoomSkin.cast.{waiting,office}`.
- **Comfort fixes (from in-headset review):** always-available **office exit** (Door 1 + oversized collider + billboard pill + desktop button → fade back to waiting); office spawn **seats the visitor** in the patient chair facing the doctor; cast **de-waxed** (matte materials); waterfall thinned so the KM logo reads; group clustered right so the waterfall is a clean backdrop.
- **Audio:** water calmed to a hush; **continuous music bed** = Nate's jazz `dockside-doctor.mp3` (`RoomSkin.audio.music`, plays across both rooms, doesn't restart on door transition).
- **Look pass (in progress):** real red-oak **photo texture** on walls/floor/furniture (`client/public/brand/wood-redoak.png`); light **warmed + lifted** so the grain reads.

## 4. How to run / test

- **Desktop preview:** dev server config `medassurance-webxr-doorfix` (port 5183). `/room` = waiting; **`/room?stage=office`** jumps straight to the office (dev shortcut).
- **On-device Quest 3 (needs HTTPS):** cloudflared quick tunnel — binary is in the session scratchpad; run `./cloudflared tunnel --url http://localhost:5183`, open the printed `https://…trycloudflare.com/room` in the Meta Quest Browser, tap "Enter the room (VR)". Vite `allowedHosts` already includes `.trycloudflare.com`. Runbook: `docs/QUEST-TEST.md`.
- **Verify:** `corepack pnpm@10.4.1 exec tsc --noEmit`; `… exec vitest run client/src/xr` (pure-logic tests only); `… exec vite build`.

## 5. Architecture (keep the room-factory principle)

- **Engine is skin-agnostic:** `client/src/xr/engine/SealedRoom.ts` builds geometry from a palette; `RoomSkin.ts` is the skin contract (palette, feature, `logoImage`, `presenceImage`, `audio`, `cast`). **Brand/identity/assets live only in the skin** (`skins/direct2yourdoc-greeting.ts`), never in `engine/`.
- **React layer:** `react/SealedRoomCanvas.tsx` (canvas, stage/fade/exit state, texture application), `RoomScene` (renders room + cast + lighting + audio + host beat + exit), `CastMember.tsx` (rigged GLB loader, Suspense + ErrorBoundary→billboard fallback, de-wax), `RoomLighting.tsx` + `lighting-config.ts`, `RoomAudio.tsx` + `audio-config.ts`, `cast-config.ts`. Pure selectors (`lightingForStage`, `audioForStage`, `castForStage`) are unit-tested.

## 6. Asset pipeline (how the cast/textures are made)

1. `generate_image` (Higgsfield MCP, model `nano_banana_pro`) → a clean full-body A-pose figure or a tileable texture. For **Nate's likeness**, upload the ref: `media_upload` → curl PUT the bytes → `media_confirm` → pass the `media_id` as a `medias` ref.
2. `generate_3d` (`image_to_3d`, `enable_rigging` + `enable_animation` + `animation_action_id: 0` idle + `pose_mode: a-pose`) → rigged animated GLB. Non-bipeds (dogs) rig poorly → generate static (no rigging).
3. `job_display` to poll, download the GLB/PNG, drop into `client/public/models` or `/brand`, wire into the skin.

## 7. GOTCHAS (these bit us — don't relearn them)

- **Duplicate three.js breaks GLTF loading** (mesh renders under a different THREE → silent billboard fallback). Fix = vite `resolve.dedupe: ['three']` **AND** `rm -rf node_modules/.vite`. Do **NOT** hard-`alias` three to a path — that blacked out the whole room.
- **VR audio:** a DOM `<audio>` does NOT play in an immersive session. Use `THREE.Audio` on a listener attached to the XR camera; resume the AudioContext on a gesture; arm on the **XR session start** (not just DOM pointerdown).
- **Never trap the visitor:** every room needs an always-available, in-scene (billboarded, ray/gaze-selectable) exit — DOM buttons don't render in-headset.
- **Seat the viewer:** set the `XROrigin` per stage (office → patient seat facing the doctor), don't leave them at the entrance.
- **Fresh dev server loads GLBs slowly** (~7 MB each) — wait ~20 s before screenshotting or they'll look missing.

## 8. Parked / next up

- **PARKED (Tower-approved, later polish):** woman's-shoes re-gen; **koi/dog "pet pass"** (auto-meshes read as dead/boats — dogs pulled from the scene for now).
- **NEXT (look pass continues):** fabric texture on chairs, richer office wood, a subtle **normal map** for wood depth; then the **document read → sign → dissolve** office showpiece (privacy-showpiece demo only — NOT compliant e-consent; the compliant zero-knowledge variant is the go-live path; see `document-destruct-spec`).
- People stay **stylized-premium** — do NOT chase real-time photoreal humans on a Quest (uncanny + framerate death). Push the ROOM toward photoreal; keep the PEOPLE clean-stylized.
