import type { RoomSkin, RoomStage } from "@/xr/engine/RoomSkin";

export interface StageAudio {
  bed?: string;
  sources: { url: string; position: [number, number, number]; gain: number }[];
}

/** Pure selector: the ambient audio for a stage, or an empty result if the skin has none. */
export function audioForStage(stage: RoomStage, skin: RoomSkin): StageAudio {
  const a = skin.audio?.[stage];
  return { bed: a?.bed, sources: a?.sources ?? [] };
}
