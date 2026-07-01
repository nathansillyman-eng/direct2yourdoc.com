# Phase B, Slice 1 — Pipeline Proof: One Rigged Doctor

**Date:** 2026-07-01 · **Owner:** Claude 1 · **Branch:** new `feat/webxr-cast-phase-b` off the current `fix/webxr-door-threshold` tip (keeps Phase A free to merge independently; Tower sequences all merges).

## Goal
Prove the **image → rigged 3D → animated → loaded-in-room** pipeline end-to-end by replacing the office's flat billboard "presence" with a **rigged, subtly-animated de-identified 3D physician**, verified on desktop (then Quest). Once this works, the rest of the cast + props are the same steps repeated.

## The pipeline (the thing we're validating)
1. **Source image** — `generate_image`: a de-identified seated concierge physician — generic, warm, premium, white coat + emerald tie, a *broad-network archetype*, **never Andrew/Heslin/any named person**. (Fallback: reuse the existing `d2yd-doctor-presence.png`.)
2. **Rig + animate** — `generate_3d` `image_to_3d` with rigging on + `enable_animation` + a subtle seated/idle clip (found via `animation_actions`).
3. **Download** the GLB → `client/public/models/d2yd-doctor.glb`.
4. **Load in-room** — a new React `CastMember` (`useGLTF` + `useAnimations`) plays the idle clip; seated at the presence anchor (~`(0, 1.05, −2.0)`, behind the desk). **The billboard presence stays as the automatic fallback** if the GLB is missing/fails — the office never breaks.
5. **Skin manifest** — add a `cast` field to `RoomSkin` (model URL, clip, position, rotation, scale). TDD the pure `castForStage` selector; the GLB load/animation is visual-verified.

## Architecture (keeps the room-factory principle)
Engine stays skin-agnostic — the `cast` manifest lives in the greeting skin, `CastMember` renders it. No branded asset names in `engine/`. Vars named `presence`/`doctor`, never `andrew`/`heslin`.

## Success criteria
- De-identified doctor **3D model, subtly moving**, seated behind the desk, on desktop.
- No console errors; `pnpm build` clean (GLB in the lazy `/room` chunk); 28+ tests green (+ the new selector test).
- Billboard fallback intact when the GLB is absent.
- Then: quick Quest on-device look (scale/quality at true IPD).

## Risks & mitigations
- **Mesh too heavy for Quest** → decimate / cap texture size; keep one animated skinned mesh for the proof.
- **Generated human rig looks rough** → accept stylized-premium; if the rig is bad, fall back to a static posed mesh + gentle transform bob (still reads as 3D). Capture what we learn.
- **Credits** → generate one image + one 3D at a time; preflight cost with `get_cost`.

## Scale-out (after the proof is green — NOT this slice)
Host (Nate look: suit, gold suspenders, emerald tie), pregnant couple, two teddy-cut Pomeranians, generated furniture/props, then the read→sign→dissolve document showpiece (with the compliant zero-knowledge variant flagged for real deployment).

## Guardrails
New branch off the Phase-A tip; commit as I go; never merge to `main` (Tower sequences); never force-push; go-live gated on Nate.
