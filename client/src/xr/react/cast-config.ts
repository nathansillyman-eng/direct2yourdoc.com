import type { CastEntry, RoomSkin, RoomStage } from "@/xr/engine/RoomSkin";

/** Pure selector: the rigged cast for a stage, or an empty list if the skin has none. */
export function castForStage(stage: RoomStage, skin: RoomSkin): CastEntry[] {
  return skin.cast?.[stage] ?? [];
}
