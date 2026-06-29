// Direct2YourDoc skin — the MEDICAL FACE. Brand/identity lives here, never in engine/.
import { arc, type RoomSkin } from "@/xr/engine/RoomSkin";

const COMMAND_FILE = ["Records", "Visits", "Labs", "Meds", "Messages"];

export const direct2YourDocSkin: RoomSkin = {
  id: "direct2yourdoc",
  brand: "Direct2YourDoc",
  tagline: "A private visit, in person — anywhere.",
  professional: "Dr. Heslin",
  officeTitle: "The Office",
  // teal-navy walls, deep floor, gold trim, warm hearth
  palette: { wall: "#0f2a33", floor: "#081519", trim: "#c9a24b", fire: "#1f8a6b" },
  commandFile: arc(COMMAND_FILE),
  // the seated concierge-doctor presence (the skin carries the medical identity); produced in Stage 2
  presenceImage: "/manus-storage/d2yd-doctor-presence.png",
};
