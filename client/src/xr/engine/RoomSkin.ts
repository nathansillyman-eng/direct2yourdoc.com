// SealedRoom engine — reusable room tech. No brand/medical identity. No specific assets.

export type RoomStage = "waiting" | "office";

export interface RoomPalette {
  wall: string;
  floor: string;
  trim: string;
  fire: string;
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
  /** Optional. The engine never fetches this; the React layer loads it and passes a texture. */
  doctorImage?: string;
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
