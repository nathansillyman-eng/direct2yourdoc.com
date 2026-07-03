# Direct2YourDoc — Office Room, Feng Shui Direction, and Live Handoff — Design

_Status: drafted from brainstorming with Nate, 2026-07-03. Not yet built. Splits a much larger platform
vision (see §7) into a buildable first slice._

## 1. Purpose

Design the doctor's-office half of the sealed room and the "live handoff" moment: founder greets the
visitor in-room, then the real doctor takes over live, while keeping the whole thing buildable on top of
the existing skin-agnostic room-factory engine (no engine rewrite).

## 2. Office design direction (feng shui, calm-positive)

- **Emotional target:** calm, positive, reassuring — not clinical-cold, not luxury-flex. A patient should
  feel *at ease* the moment Door 1 opens, the way a well-designed waiting room signals "you are cared
  for" before anyone speaks.
- **Feng shui as a design lens, not decoration:** apply real principles, not aesthetic name-dropping —
  desk not directly facing the door ("command position" for the doctor, seated with a solid wall/bookshelf
  behind them, not a window at their back), a clear unobstructed path from Door 1 to the patient seat,
  soft/rounded furniture edges over sharp corners, balanced natural materials (wood already locked:
  red-oak) plus a living/plant element and warm indirect light rather than the current cool
  credential-wall + hard directional key light.
- **Palette:** stays in the established red-oak family; warm-lifted light (already in progress per
  handoff §4) supports "calm positive" directly — keep pushing that direction rather than introducing a
  new palette.
- **Deliverable:** an updated `RoomSkin.office` palette/layout pass (desk position, seat path, light
  rig warmth) — no new engine code, this is a skin-layer + `lighting-config.ts` change.

## 3. The live-handoff flow

1. Visitor puts on headset. **Founder (Nate's avatar) is already present** in the waiting room —
   matches the existing Phase B cast.
2. Founder gives a short live, real-time greeting/intro (voice + avatar, not pre-scripted — see §4 for
   what that requires).
3. Branch on doctor availability, decided live by the founder/doctor:
   - **A — doctor available now:** the real doctor's avatar comes online in the office. Visitor walks
     through Door 1; the doctor is there to welcome them in. Founder's avatar then exits (removes
     headset / leaves the room), handing the interaction fully to the doctor.
   - **B — doctor not available:** visitor books a return visit **inside the headset**, using a
     lightweight in-room calendar surface — draw/select an X on the day, then an X on the time slot.
     An "book online instead" fallback exists for anyone who'd rather leave the headset and use the
     website.
4. Appointment happens within 48 hours of booking.

## 4. Live presence — what it actually requires (new subsystem)

This is the part that does **not** exist in the current build (today's cast is static, pre-rigged,
non-interactive GLBs). Confirmed with Nate: founder and doctor are both **fully in VR headsets** too —
this is real-time multi-user presence, not a recorded/scripted illusion. That means:

- A **multi-user session layer**: each room instance needs a shared session so 2-3 real people's
  head/hand transforms and voice sync to everyone else in that instance (WebRTC or a managed service
  — e.g. something in the vein of PlayCanvas/Photon/LiveKit-style room sync; needs its own
  spike/eval, not decided here).
- **Voice**: real-time audio between participants in a room instance (separate from the existing
  ambient music bed, which stays as environmental audio).
- **Avatar puppeting**: headset head/hand tracking drives the existing rigged GLB cast bodies
  (replacing today's fixed idle animation for founder/doctor with live-driven poses) — legs/lower body
  can stay proceduralized (standard VR avatar practice) since only head+hands are tracked.
- This is a **separate spec** — flagged, not designed here. It's the biggest net-new engineering piece
  in the whole vision.

## 5. Multi-instance ("service station") architecture

Once live, the founder and doctor need to move between many concurrent one-patient room instances
without re-entering a lobby each time.

- **Model:** one room *definition*, instantiated fresh per patient session (like a game server spinning
  up a match instance) — not physically duplicated rooms.
- **Approach chosen (Nate: "whichever's easier"):** a **backstage control panel**, not an in-world
  hallway of doors. A dashboard, visible only to the founder/doctor (never the patient), listing active
  patient instances; selecting one teleports that operator's live presence into that instance, selecting
  "leave" releases them back to the panel. Simpler to build than a diegetic hallway (no extra
  world-geometry or patient-visible transition to design/render) and matches how the founder needs to
  work operationally (jump patient to patient).
- This reuses the room-factory principle already in place — the *instance* changes, not the engine.

## 6. Customization / branding (offices, other doctors)

Already solved by the existing architecture — explicitly called out in the current engine design
(`engine/` stays skin-agnostic; `RoomSkin.ts` holds palette/feature/cast/audio). Adding a new office
layout or a doctor's own branding is a **new skin file + assets**, not new engine code. No new design
work needed here beyond keeping future skins honest to that contract.

## 7. Explicitly out of scope for this spec (separate specs, in order)

1. **This spec** — office feng-shui direction + live-handoff flow + control-panel instancing (design
   only; buildable without live presence by stubbing the doctor as still-static for now).
2. **Live multi-user presence** (§4) — voice + avatar puppeting + session networking. Biggest lift.
   Needs its own design spec and a technology spike before a spec can even be written responsibly.
3. **Document virtualization + signing + identity verification** (bring in a PDF/CSV/doc, patient signs,
   identity confirmed via Meta credentials + originating paperwork). Security/trust-critical — this
   should go through `security-review` once specced, and ties to the already-parked
   `document-destruct-spec` / "zero-knowledge go-live path" noted in the existing handoff.
4. **Cross-vertical skin reuse** (legal/business professionals). No new engine work implied by §6 —
   this is "write another skin," but the room *content* (what a legal consult room contains) needs its
   own brief when that vertical is prioritized.

## 8. Fidelity note (context, not a decision)

Nate asked how close this can get to true photoreal ("Gordon Ramsay kitchen" bar). On standalone
Quest-class hardware that bar isn't reachable soon — real-time photoreal humans/environments at that
fidelity need either far more powerful untethered chipsets (multi-year-out) or cloud-rendered streaming
(available now, adds latency/infra cost/connectivity dependency). This spec does not change the
existing engine guidance: push the **room** toward photoreal, keep **people** clean-stylized — that
guidance gets more important, not less, once people are live-puppeted rather than static.

## 9. Decisions made in Nate's absence (flag for confirmation, not blocking)

Nate asked for progress while away and delegated judgment calls ("whichever's easier"). Two calls made
here using that same heuristic — flag on his return, don't block on them:

- **Sequencing:** build and ship §1-3/§5/§6 first with the doctor still static (today's pre-scripted
  cast), then layer in live puppeting (§4) as its own follow-on spec once that subsystem is designed
  and spiked. Reason: §4 is the single biggest net-new engineering piece and shouldn't gate a room/UX
  pass that's ready to build now.
- **Booking gesture:** tap-to-select a day cell then a time-slot cell, rendered with an X-mark
  confirmation on selection — not literal freehand-draw/stroke recognition. Same visual outcome
  ("draw an X"), far simpler to build and far more reliable in VR (freehand stroke detection is
  error-prone with controllers/hand-tracking).
