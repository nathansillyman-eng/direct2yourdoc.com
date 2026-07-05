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
  // Synthesized placeholder ambient beds (gentle water in the waiting room, warm air in
  // the office). Drop-in replaceable with CC0/produced .mp3s per docs/superpowers specs.
  audio: {
    music: "/audio/d2yd/dockside-doctor.mp3", // Nate's jazz cut ("Dockside Doctor")
    waiting: { bed: "/audio/d2yd/d2yd_waiting.wav" },
    office: { bed: "/audio/d2yd/d2yd_office.wav" },
  },
  // Rigged de-identified network physician (image→3D, auto-rigged, idle clip). Stands
  // behind the desk; the seated billboard presence is the automatic fallback.
  cast: {
    // The greeting tableau: Nate (host) welcoming a pregnant couple, two Pomeranians.
    // Everyone faces +Z toward the entering visitor (spawn at z≈1.6). Positions tuned live.
    // Group clusters to the RIGHT so the waterfall + KM emblem stay a clear backdrop
    // on the left; pulled forward for depth separation from the water wall. Dogs are
    // parked — the auto-generated quadruped meshes read as "dead"; need a proper pet pass.
    waiting: [
      { model: "/models/d2yd-host.glb", clip: "Armature|Idle|baselayer", position: [1.15, 0, -0.5], rotationY: -0.5, scale: 1 },
      { model: "/models/d2yd-woman.glb", clip: "Armature|Idle|baselayer", position: [0.3, 0, -0.35], rotationY: 0.1, scale: 1 },
      { model: "/models/d2yd-husband.glb", clip: "Armature|Idle|baselayer", position: [0.75, 0, -0.9], rotationY: -0.15, scale: 1 },
    ],
    office: [
      {
        model: "/models/d2yd-doctor.glb",
        clip: "Armature|Idle|baselayer",
        // Standing BEHIND the desk (back edge z=−1.7), clear of the desk chair at
        // z=−2.15 — the old −2.25 stood him inside the chair's volume (in-headset
        // report 2026-07-04). The React layer hides the chair when he's present.
        position: [0, 0, -2.0],
        rotationY: 0,
        scale: 1,
      },
    ],
  },
};
