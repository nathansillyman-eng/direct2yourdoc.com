# Direct2YourDoc Sealed Room — Gorgeous Waiting Room + Doctor's Office

**Date:** 2026-06-30 · **Owner:** Claude 1 (D2YD sealed-room lane) · **Branch:** `fix/webxr-door-threshold` (worktree `~/medassurance-webxr-doorfix`)

## Goal
A **working AND gorgeous** 1 waiting room + 1 doctor's office in WebXR (Quest 3 primary; desktop preview now; iOS/visionOS as a follow track). Red-oak "greeting" art direction with the waterfall→koi→gold-KM signature. **Stylized-premium, not photoreal.** Full 3D cast via a hybrid pipeline.

## Approved decisions (Nate + Tower/C5)
- **Cast fidelity:** FULL 3D characters, stylized-premium (don't chase in-browser uncanny).
- **Pipeline:** HYBRID — rigged animatable humans + rigged dogs + image→3D generated props/set-dressing.
- **Sequencing:** A-then-B. **Phase A = gorgeous room shell first**, verified; **Phase B = cast + document flow** as its own tracked sub-project.
- **Host = Nate** (the facilitator/connector who makes the introduction — the D2YD thesis made literal).
- **Doctor = de-identified generic network physician.** Zero Andrew/Heslin likeness; variables named `presence`/`doctor`, never `andrew`/`heslin`.
- **Merge discipline:** commit as I go; hand the verify-green branch to Tower (C5) to sequence the merge; **never** merge to `main` myself; never force-push; direct2yourdoc.com go-live stays gated on Nate.

## Canonical constants (RECONCILED — resolves the tower-spec drift)
The WebXR **engine (`engine/SealedRoom.ts`) is the source of truth.** The audio/spatial-UI specs assumed a 5×5×3 room and teal palette; those are **re-anchored to the engine below.** Take the tower specs' *numbers and technique*, not their skin.

| Constant | Canonical value |
|---|---|
| Room footprint | **4 W(x) × 5 D(z) × 3 H(y)**, listener faces −Z, front wall `FRONT = z −2.5` |
| Waiting spawn | `XROrigin` z = 1.6, camera y ≈ 1.55, fov 66 |
| Door 1 | `(1.0, 1.05, −2.43)`, ~1 × 2.1 m + oversized invisible collider (the "stuck in waiting" fix) |
| Waterfall feature | centre x = −0.7 on the front wall — **WAITING ROOM ONLY** |
| Koi pond | base of the waterfall ≈ `(−0.7, 0.04, −1.88)` |
| KM emblem | `(−0.7, 2.02, −2.38)`, skin `logoImage` = `/brand/km-emblem.png` |
| Front desk (waiting) | `(−1.45, 0, −0.1)`, faces into the room |
| Office desk | group `(0, 0, −1.3)`, top ≈ 0.75 m |
| Doctor seat / presence | billboard `(0, 1.1, −2.0)`; doctor's chair `(0, 0, −2.15)` → rigged figure in Phase B |
| Patient sit-anchor | seated facing −Z at ≈ z 0.4 (re-add as the *visitor* seat; the current chair is the doctor's) |
| Document (office) | on desk ≈ `(0.35, 0.79, −1.35)`, tilted ~20° toward the patient |
| **Palette — RED-OAK (overrides the specs' teal)** | wall `#7a4a2c` · floor `#6b3f26` · trim/gold `#c9a24b` · water `#5fb6cf` · accent lavender `#6c4f93` |

## Per-room design

### Waiting room (the greeting)
- **Signature:** waterfall → koi pond → gold KM emblem feature wall (front wall, x = −0.7); polished red-oak walls/floor, gold base + crown rings, warm ceiling fixture; wood reception front desk + dark-lavender accent chairs.
- **Lighting (calm-neutral ~4800 K):** hemisphere + warm key (directional, castShadow) + cool fill + gold rim; plus a **cool water-shimmer** light at the waterfall — the fireplace-flicker *technique* recolored to water caustics (cyan `#5fb6cf`, gentle ~7 Hz breathing, **never orange**).
- **Feature-wall craft:** replace the box-koi with simple fish silhouettes; real KM emblem texture; better scrolling water (caustic texture + subtle normal); pond ripple.
- **Cast (Phase B):** Nate mid-handshake with the husband; the pregnant woman beside them; a generic doctor walking out reading a chart; two teddy-cut Pomeranians (one white, one black) jumping to greet.

### Doctor's office (through Door 1)
- **Warm, intimate consult room (~3200 K):** red-oak, grounding rug, wood desk with gold edge band, doctor's chair. **The office does NOT get the waterfall** — gate the feature to the waiting stage (it currently renders in both, a bug). Office back wall behind the doctor = a warm **credential + bookshelf** wall; warm lamp(s) with subtle intensity breathing (flicker technique on a *warm* light, no orange fire); optional small tabletop fountain (brand water echo) + a sleeping Pomeranian on the floor (matches the audio bed).
- **De-identified doctor presence:** billboard now (`d2yd-doctor-presence.png`, silhouette fallback); rigged 3D figure in Phase B. Seated behind the desk; patient seat faces −Z at conversational distance (~1.5–2 m).
- **Command-file hotspots** (Records/Visits/Labs/Meds/Messages) as gently glowing framed cards on the front wall.
- **Document read → sign → deliver → dissolve** (Phase B; see below).

## Lighting (adopt the tower rig, recolored to red-oak)
- Renderer already `ACESFilmicToneMapping` + exposure 1.05 + SRGB. Add a drei `<Environment>` low-res HDRI at intensity ~0.25 for **spec/IBL only** (this is what makes gold read as gold).
- Per-room rigs per `lighting-spec.md` §A/§B, recolored to red-oak warmth. **One** realtime shadow-caster per room (the key), `mapSize 1024`, PCFSoft, bias tuned; drei `<ContactShadows>` (`frames:1`, baked once) under desk/seating/feature.
- **Transition:** reuse `FADE_MS` black fade; while black, lerp hemisphere + key color/intensity from cool-neutral (waiting) → warm (office), and ramp the office warm light up "as you arrive."

## Materials (the biggest "gorgeous" lever)
The current room is flat-lit primitives in the right palette — the gap to gorgeous is **lighting + materials + feature craft.**
- **Red-oak wood:** grain via map + normal + roughness (or high-quality procedural) instead of flat color; polished floor sheen.
- **Gold trim:** raise metalness (~0.85) so the `<Environment>` gives real reflections (currently 0.45, no env).
- **Water:** scrolling caustic texture (`makeWaterTexture` exists) + subtle normal + emissive; koi as shaped meshes.
- **Furniture:** bevel/round edges now; swap select pieces to generated/GLB in Phase B.
- **Budget:** everything stays in the lazy `/room` chunk; Quest poly/texture budget; KTX2/Draco on any GLB; instance repeated props.

## Phase B — full 3D cast (hybrid) [its own sub-project, spec'd after A verifies green]
- **Rigged glTF humans** (Ready-Player-Me-style) + Mixamo idle/gesture clips: host (Nate look — dark suit, **gold suspenders**, emerald tie), pregnant woman + husband, de-identified doctor (white coat, generic). **Rigged Pomeranians ×2.**
- **Generated props** (image→3D via `generate_3d`): hero waterfall sculpture element, 3D gold KM emblem, front-desk objects, orchids, credential frames.
- **Engine `cast` renderer:** a generic system that reads a **character manifest** from the skin (asset URLs + placements + clip names). Engine stays brand-free; identity + cast live in `direct2yourdoc-greeting.ts`.
- **Animation:** subtle idle (breath/weight-shift) on everyone; host handshake loop; dogs jump-to-greet loop; doctor slow walk-out; sleeping dog in the office.

## Document sign / destruct (Phase B, office) — with the legal flag
- **UX:** read → wax-seal sign → ~15 s delivery trajectory (page folds, streams away as a gold-light ribbon) → receipt card → dissolve into embers; line: *"This room keeps no copy. Yours is the only one."*
- **CRITICAL correctness:** destruction is **delivery-gated** — driven by an actual `DELIVERED` receipt event (2xx + integrity-checked content hash), **never a blind 15 s timer.** Never destroy before the patient's copy is provably out; on failure, retry/fallback, do not destroy.
- **⚠️ LEGAL FLAG (`document-destruct-spec.md` §5):** the "room forgets everything" build is a **PRIVACY SHOWPIECE / experience demo — NOT compliant e-consent or a records system.** HIPAA/state retention + ESIGN/UETA accessibility require a retained, reproducible record. Do **not** represent variant (a) as compliant to Nate, investors, or patients. Go-live path = variant **(b) zero-knowledge retention**: provider stores only an encrypted blob it can't read + a minimal signed receipt (hash/timestamp/consent-type); the patient holds the key. **Demo (a); (b) is required for any real clinical signing.**

## Ambient audio (`audio-spec.md`, re-anchored to 4×5×3)
- Waiting: `waiting_tone` bed + a gentle **waterfall** water loop (positional at the feature) + optional slow clock.
- Office: `office_tone` bed + tabletop **fountain** + sleeping **dog** (no barking) + faint warm air. Mix: beds ≤ −22 dB, positional −16…−20 dB, **nothing masks the presence voice**; duck ambience −6 dB when the doctor speaks.
- Add an `audio` field to `RoomSkin` (source → {url, pos, gain}); files in `client/public/audio/d2yd/` as `.ogg` + `.mp3`. I can **generate** the 5 loops (generative audio) or fall back to CC0/Pixabay.

## Testing & verification
- Keep **19 vitest green**; add pure-logic tests for: greeting-skin fields (`feature`/`water`/`logoImage`/cast manifest), **feature gated to the waiting stage**, canonical constants, cast-placement math. (Engine returns THREE groups — assert structure/positions/material colors as the existing tests do; no WebGL in unit tests.)
- **Visual:** render `/room` on port 5183 in my worktree, screenshot desktop (waiting + office), iterate to gorgeous; then Quest 3 on-device via `docs/QUEST-TEST.md`.
- **Acceptance (`demo-scope-and-platform-split.md` §1):** both rooms exist & lit (no black voids/unlit faces); traverse via Door 1 with a comfort fade; presence reads as "a person is here"; ambient beds present and never mask the voice; sit facing the doctor; document read + sign + seal; an always-available exit.

## Guardrails
All work on `fix/webxr-door-threshold` in `~/medassurance-webxr-doorfix`; commit as I go; never merge to `main` (Tower sequences merges); never force-push; go-live gated on Nate. Engine stays skin-agnostic — brand/identity/assets live only in the greeting skin + generated assets.

## Resolved decisions (Nate, 2026-06-30)
1. **Room stays 4×5×3** (engine canonical). Confirmed — keep.
2. **Office feature = warm credential + bookshelf wall** behind the doctor (no orange fireplace; brand motif stays *water*, exclusive to the waiting-room waterfall).
3. **Ambient audio built last in Phase A** — nail the visual pass (lighting + materials) first, then generate + wire the 5 loops.
