# MedAssurance / Direct2YourDoc — Claude Code Handoff

## Project Overview

This is the website for **MedAssurance** (brand/platform) powered by **Direct2YourDoc** (patient-facing app/front door), built for Dr. Andrew Heslin, M.D.O.

- **Main site** (`/`): Premium concierge medical service landing page for MedAssurance
- **Prototype page** (`/direct2yourdoc`): MVP prototype for the Direct2YourDoc virtual private doctor's office app

**Live domain:** [direct2yourdoc.com](https://direct2yourdoc.com) (hosted on Manus)

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite 7 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Routing | Wouter (lightweight React router) |
| Animation | Framer Motion |
| Icons | Lucide React |
| Package Manager | **pnpm** (do not substitute npm or yarn) |
| Backend (placeholder) | Express (minimal — serves static files only, no API routes yet) |

---

## Project Structure

```
medassur/
├── client/
│   ├── index.html              ← HTML entry, Google Fonts loaded here
│   ├── public/                 ← Favicon only — NO images here
│   └── src/
│       ├── App.tsx             ← Routes (/ and /direct2yourdoc)
│       ├── index.css           ← All design tokens, CSS variables, global styles
│       ├── pages/
│       │   ├── Home.tsx        ← Main MedAssurance landing page (assembles components)
│       │   ├── Direct2YourDoc.tsx  ← Full Direct2YourDoc prototype (self-contained)
│       │   └── NotFound.tsx
│       └── components/
│           ├── Navigation.tsx      ← Sticky nav with scroll-aware dark/transparent states
│           ├── HeroSection.tsx     ← Cinematic dark hero with Dr. Heslin portrait
│           ├── StatsBar.tsx        ← Social proof stats bridge section
│           ├── ServicesSection.tsx ← Editorial numbered services list
│           ├── ValueSection.tsx    ← "Best friend who's a doctor" narrative
│           ├── HowItWorksSection.tsx
│           ├── AboutSection.tsx    ← Dr. Heslin credentials
│           ├── MembershipSection.tsx
│           ├── ContactSection.tsx  ← Inquiry form (currently frontend-only, no email send)
│           └── Footer.tsx
├── server/
│   └── index.ts                ← Express static file server (placeholder only)
├── shared/
│   └── const.ts                ← Shared constants
├── patches/
│   └── wouter@3.7.1.patch      ← pnpm patch override — MUST be preserved
├── package.json
├── pnpm-lock.yaml              ← MUST be preserved for reproducible installs
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── components.json             ← shadcn/ui config
└── .prettierrc
```

---

## Commands

```bash
# Install dependencies (pnpm only)
pnpm install

# Start dev server (localhost:3000)
pnpm run dev

# Type-check without building
pnpm run check

# Production build
pnpm run build

# Run production build locally
pnpm run start

# Format code
pnpm run format
```

---

## Environment Variables

The app reads the following env variables. In development, Manus injects them automatically. For external hosting, create a `.env` file at the project root:

```env
# Manus platform variables (injected automatically on Manus hosting)
VITE_APP_ID=
VITE_FRONTEND_FORGE_API_KEY=
VITE_FRONTEND_FORGE_API_URL=
VITE_OAUTH_PORTAL_URL=
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=

# Server
PORT=3000
NODE_ENV=development
```

> **Note:** None of these are currently required for the site to render. The frontend is fully static — the env vars are Manus platform hooks. For Cloudflare Pages deployment, you can leave them blank or omit them entirely.

---

## Deployment

**Current host:** Manus (medassur-gkcmvqzr.manus.space + direct2yourdoc.com)
**Publish method:** Manus Management UI → Publish button (no CLI deploy step)

**For Cloudflare Pages deployment:**

| Setting | Value |
|---|---|
| Framework preset | None (or Vite) |
| Build command | `pnpm install && pnpm run build` |
| Build output directory | `dist/public` |
| Node.js version | 22 |

---

## Image Assets

All images are hosted on Manus CDN and referenced via `/manus-storage/` paths in the code. These paths resolve correctly on Manus hosting. For external hosting, you will need to either:
1. Re-upload the images to your own CDN and update the paths, or
2. Use the full CDN URLs (ask Manus to export public URLs for each asset)

Key assets used:
- `logo-medassurance-only_813a4b1e.png` — MedAssurance logo (house+cross mark + wordmark)
- `logo-d2yd-v2_f04f7f38.png` — Direct2YourDoc logo (gold fireplace version)
- `d2yd-hero-poster_0bcac802.png` — Direct2YourDoc hero background
- `d2yd-waiting-room_1f40a156.png` — Virtual waiting room concept image
- `d2yd-patient-command_714f0b2d.png` — Patient command file concept image

---

## Design System

**Fonts:** Cormorant Garamond (headlines) + DM Sans (body/UI) — loaded via Google Fonts in `client/index.html`

**Key CSS variables** (defined in `client/src/index.css`):
- `--charcoal` — primary dark background (#0f0f0d equivalent)
- `--linen` — warm off-white section backgrounds
- `--forest-green` — primary brand/CTA color
- `--aged-bronze` — accent/label color (gold)
- `--parchment` — warm text on dark backgrounds

**Design philosophy:** "Quiet Luxury Clinic" — walnut, fireplace, parchment, brass. No hospital-blue SaaS. No cartoon. Asymmetric editorial layouts, not centered card grids.

---

## Known Limitations / Next Steps

1. **Contact forms are frontend-only** — both the MedAssurance inquiry form and the Direct2YourDoc request form show a success state but do not send emails. Wire to Formspree, Resend, or a backend route.
2. **No Terms of Service or Privacy Policy pages** — required before collecting real user data.
3. **HIPAA compliance layer needed** — once any health information is collected, a full HIPAA-compliant backend (encrypted storage, audit logs, BAA with vendors) is required.
4. **Direct2YourDoc prototype is UI-only** — the waiting room, appointment ledger, and patient command file are interactive mockups, not connected to any backend.
5. **`/manus-storage/` image paths** — will need to be updated for non-Manus hosting (see Image Assets section above).

---

## Important: Read Code Over Summary

This handoff document is a guide, not ground truth. If anything in this document conflicts with what the code actually does, **trust the code**. The source files in `client/src/` are the authoritative reference for what is built and how it works.

---

*Generated: June 27, 2026 | Project: medassur | Version: 7f8a57b3*
