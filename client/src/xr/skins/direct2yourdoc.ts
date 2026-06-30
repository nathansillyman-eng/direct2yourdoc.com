// Direct2YourDoc skin — the MEDICAL FACE. Brand/identity lives here, never in engine/.
import { arc, type RoomSkin } from "@/xr/engine/RoomSkin";

const COMMAND_FILE = ["Records", "Visits", "Labs", "Meds", "Messages"];

export const direct2YourDocSkin: RoomSkin = {
  id: "direct2yourdoc",
  brand: "Direct2YourDoc",
  tagline: "A private visit, in person — anywhere.",
  // A REPRESENTATIVE concierge physician from the network — a generic role, never a
  // specific named person. The presence image is a look, not an individual's portrait.
  professional: "Your concierge physician",
  officeTitle: "The Office",
  // teal-navy walls, deep floor, gold trim, warm hearth
  palette: { wall: "#0f2a33", floor: "#081519", trim: "#c9a24b", fire: "#1f8a6b" },
  commandFile: arc(COMMAND_FILE),
  // Seated presence: a representative network physician (no named identity). The
  // React layer loads this as a billboard; a live WebRTC video can take the slot later.
  presenceImage: "/manus-storage/d2yd-doctor-presence.png",
};
