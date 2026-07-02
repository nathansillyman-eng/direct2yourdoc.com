// SealedRoom engine — reusable room tech. No brand/medical identity. No specific assets.

export type RoomStage = "waiting" | "office";

export interface RoomPalette {
  wall: string;
  floor: string;
  trim: string;
  fire: string;
  /** Optional richer palette used by feature skins (default: derived from the four core
   *  colours so existing skins keep working unchanged). */
  wood?: string; // warm wood (e.g. red oak) for panelled walls / desks
  accent?: string; // a secondary accent (e.g. lavender) used sparingly
  water?: string; // waterfall / pond tint
}

export interface RoomObject {
  label: string;
  position: [number, number, number];
}

export interface RoomSkin {
  id: string;
  brand: string;
  tagline: string;
  professional: string;
  officeTitle: string;
  palette: RoomPalette;
  commandFile: RoomObject[];
  /** Optional presence image (e.g. the seated professional). Generic on purpose — NOT
   *  medical-specific. The engine never fetches it; the React layer loads it and passes a texture. */
  presenceImage?: string;
  /** Waiting-room feature wall. "hearth" (default) = the original glowing niche;
   *  "waterfall" = a water feature wall with a basin/koi pond and a brand emblem. */
  feature?: "hearth" | "waterfall";
  /** Optional brand emblem texture for the feature wall (e.g. the KM monogram). */
  logoImage?: string;
  /** Optional ambient audio. The engine never loads these; the React layer plays them. */
  audio?: {
    /** A continuous low music bed that plays across both rooms (under the ambience). */
    music?: string;
    waiting?: { bed?: string; sources?: { url: string; position: [number, number, number]; gain: number }[] };
    office?: { bed?: string; sources?: { url: string; position: [number, number, number]; gain: number }[] };
  };
  /** Optional rigged 3D cast placed per stage. The engine loads nothing; the React layer does. */
  cast?: { waiting?: CastEntry[]; office?: CastEntry[] };
}

/** A rigged character (GLB) placed in the room. */
export interface CastEntry {
  model: string; // GLB URL
  clip?: string; // animation clip name; defaults to the first clip in the GLB
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
}

const FRONT_WALL_Z = -2.3;
const HOTSPOT_Y = 1.4;
const HOTSPOT_SPAN = 2.4; // total width the labels spread across, in metres

/** Lay command-file labels out evenly along the front wall (twin of Swift RoomSkin.arc). */
export function arc(labels: string[]): RoomObject[] {
  const n = labels.length;
  return labels.map((label, i) => {
    const x = n === 1 ? 0 : (i / (n - 1) - 0.5) * HOTSPOT_SPAN;
    return { label, position: [x, HOTSPOT_Y, FRONT_WALL_Z] as [number, number, number] };
  });
}

export const neutralSkin: RoomSkin = {
  id: "neutral",
  brand: "Sealed Room",
  tagline: "A private space.",
  professional: "",
  officeTitle: "Office",
  palette: { wall: "#2a2f3a", floor: "#1c2029", trim: "#3a4150", fire: "#c8762e" },
  commandFile: [],
};
