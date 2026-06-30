# Direct2YourDoc WebXR — on-device Quest 3 test runbook

The sealed room (`/room`) is verified in a desktop browser. The only remaining
Stage-1 gap is an **on-device test on a Quest 3** (needs the headset — can't be
automated). This is the runbook.

## Why a tunnel is needed

WebXR `immersive-vr` only starts in a **secure context (HTTPS)**. `localhost` is
secure but the Quest isn't localhost, and the LAN dev server is plain HTTP — the
Quest browser will refuse to enter VR. So we expose the dev server over HTTPS.

## Fastest path — Cloudflare quick tunnel (no account)

```bash
# terminal 1 — dev server (LAN + localhost, port 5183)
cd ~/medassurance-webxr-doorfix
corepack pnpm@10.4.1 dev -- --port 5183

# terminal 2 — HTTPS tunnel to it
cloudflared tunnel --url http://localhost:5183
# → prints a https://<random>.trycloudflare.com URL
```

On the **Quest 3**: open the **Meta Quest Browser** → go to
`https://<random>.trycloudflare.com/room` → tap **“Enter the room (VR).”**

Alternatives:
- `ngrok http 5183` (needs a free ngrok account) — same idea.
- **Netlify branch deploy preview**: open a PR for `fix/webxr-door-threshold`; use
  the *Deploy Preview* HTTPS URL + `/room`. This does **not** publish to production.

## On-device checklist

- [ ] `immersive-vr` supported → the **“Enter the room (VR)”** button shows (not the
      “VR isn’t available” notice).
- [ ] **Scale/height** feels right standing in the waiting room; gold trim, hearth
      niche, and Door 1 read correctly.
- [ ] **Door 1 is reachable**: point the controller ray at the door (or anywhere on
      its oversized invisible collider) and select → the **host beat** opens. Confirm
      you can’t get “stuck” (the whole point of the collider fix).
- [ ] **Host beat**: the founder billboard faces you; the welcome card is legible at
      standing distance; the **“Meet your doctor”** pill is selectable by ray/gaze;
      selecting it fades → office.
- [ ] **Office**: the network physician billboards toward you, seated behind the
      desk; record-card wall + hearth glow present.
- [ ] **Comfort**: fades are smooth, framerate steady (no judder), billboards track
      your head without jitter, no discomfort.
- [ ] Note anything off: ray length, text legibility at IPD, presence scale, the
      host-beat dim plane, controller model.

## Known tuning likely needed on-device

Placement/scale for the host beat and the presences was tuned to the **desktop FOV**.
At true VR IPD/scale the billboard distances and the dim plane may need adjustment —
capture notes/photos and we tune from there.

## State

Branch `fix/webxr-door-threshold` (pushed to `origin`). Stack: React 19 + Vite,
`three` + `@react-three/fiber@9` + `drei@10` + `@react-three/xr@6`. Route `/room`
is a lazy chunk; the medical bundle is untouched.
