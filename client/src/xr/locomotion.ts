import type { RoomStage } from "@/xr/engine/RoomSkin";

/** Comfort: every stage swap fades to black over this duration. */
export const FADE_MS = 400;

/** v1 is a single linear flow: waiting -> office, then terminal. */
export function advanceStage(stage: RoomStage): RoomStage {
  return stage === "waiting" ? "office" : "office";
}
