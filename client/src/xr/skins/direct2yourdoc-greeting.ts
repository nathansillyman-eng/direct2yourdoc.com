// Direct2YourDoc — GREETING skin. The premium "red-oak + waterfall" reception
// direction (Nate-approved 2026-06-30). Brand/identity lives here, never in engine/.
import { arc, type RoomSkin } from "@/xr/engine/RoomSkin";

const COMMAND_FILE = ["Records", "Visits", "Labs", "Meds", "Messages"];

export const direct2YourDocGreetingSkin: RoomSkin = {
  id: "direct2yourdoc-greeting",
  brand: "Direct2YourDoc",
  tagline: "A private visit, in person — anywhere.",
  // A REPRESENTATIVE concierge physician from the network — never a named person.
  professional: "Your concierge physician",
  officeTitle: "The Office",
  // Polished RED OAK base, gold trim, water-cyan glow; lavender is an ACCENT only.
  palette: {
    wall: "#7a4a2c",
    floor: "#6b3f26",
    trim: "#c9a24b",
    fire: "#3aa0b5",
    wood: "#7a4a2c",
    accent: "#6c4f93", // dark rich lavender — sparingly
    water: "#5fb6cf",
  },
  commandFile: arc(COMMAND_FILE),
  // Waterfall feature wall (koi pond + KM emblem) instead of the hearth.
  feature: "waterfall",
  logoImage: "/brand/km-emblem.png",
  presenceImage: "/manus-storage/d2yd-doctor-presence.png",
};
