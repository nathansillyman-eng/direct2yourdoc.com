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
    wall:  "#0d1c20", // deep teal-navy — the /direct2yourdoc prototype bg
    floor: "#081519", // near-black teal — same hex as the /room Suspense fallback, so the route fade dissolves into the floor
    trim:  "#f5c63e", // D2YD gold — prototype-page gold / portal-gold energy
    fire:  "#ff9d45", // hearth ember — warm amber tuned toward the gold trim
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
