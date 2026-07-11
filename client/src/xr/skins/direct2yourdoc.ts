// Direct2YourDoc consultation room — PRODUCTION skin v1 (founder-forward).
// Brand identity lives HERE, never in engine/**. Palette = "Luminous Clinic"
// hexes already shipped in the D2YD codebase.
//
// Identity truthfulness: Nate is the FOUNDER and host — never presented as the
// physician. When a physician presence asset lands (Stage 2), the swap is three
// strings + one path in this one file.
import { arc, type RoomSkin } from "@/xr/engine/RoomSkin";

export const direct2YourDocSkin: RoomSkin = {
  id: "direct2yourdoc",
  brand: "Direct2YourDoc",
  tagline: "Your Doctor. Your Home. Now.",
  professional: "Nate Sillyman — Founder",
  officeTitle: "You're with the founder.",
  palette: {
    wall: "#0d1c20", // deep teal-navy — the /direct2yourdoc prototype bg
    floor: "#081519", // near-black teal — same hex as the /room Suspense fallback, so the route fade dissolves into the floor
    trim: "#f5c63e", // D2YD gold — prototype-page gold / portal-gold energy
    fire: "#ff9d45", // hearth ember — warm amber tuned toward the gold trim
  },
  materials: {
    wall: {
      color: "#7a4f32",
      texture: "/brand/xr-walnut-panel.svg",
      repeat: [3, 1.6],
      roughness: 0.9,
      emissive: "#2a1a12",
      emissiveIntensity: 0.18,
    },
    floor: {
      color: "#5b3824",
      texture: "/brand/xr-herringbone-floor.svg",
      repeat: [2.2, 2.8],
      roughness: 0.86,
      emissive: "#1e120c",
      emissiveIntensity: 0.12,
    },
    trim: {
      color: "#d6aa3a",
      texture: "/brand/xr-aged-brass.svg",
      repeat: [2, 1],
      roughness: 0.42,
      metalness: 0.35,
      emissive: "#4c3510",
      emissiveIntensity: 0.12,
    },
    hearth: {
      color: "#b46532",
      texture: "/brand/xr-hearth-stone.svg",
      repeat: [1.25, 0.8],
      roughness: 0.74,
      emissive: "#ff8f3d",
      emissiveIntensity: 0.5,
    },
    desk: {
      color: "#6a422b",
      texture: "/brand/xr-walnut-panel.svg",
      repeat: [1.1, 0.45],
      roughness: 0.82,
      emissive: "#24160f",
      emissiveIntensity: 0.12,
    },
    chair: {
      color: "#17282b",
      texture: "/brand/xr-walnut-panel.svg",
      repeat: [0.8, 0.8],
      roughness: 0.9,
    },
    hotspot: {
      color: "#f5c63e",
      texture: "/brand/xr-aged-brass.svg",
      repeat: [0.8, 0.3],
      roughness: 0.36,
      metalness: 0.45,
      emissive: "#ff9d45",
      emissiveIntensity: 0.18,
    },
  },
  commandFile: arc([
    "The Credential",
    "The Ledger",
    "The Second Chair",
    "The Desk",
    "The Hearth",
    "The Door",
    "The Window",
  ]),
  // EXISTING founder portrait (sips-optimized from /art-source/founder-nate-office.png).
  // NEVER /manus-storage/* — the dev storage proxy intercepts that path.
  presenceImage: "/brand/founder-nate-presence.png",
};
