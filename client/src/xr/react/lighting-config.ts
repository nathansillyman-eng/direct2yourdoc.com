import type { RoomStage, RoomPalette } from "@/xr/engine/RoomSkin";

export interface LightSpec {
  color: string;
  intensity: number;
  position: [number, number, number];
}
export interface FeatureLight extends LightSpec {
  distance: number;
  decay: number;
  flicker: "water" | "warm";
  base: number; // mean intensity the flicker oscillates around
  amp: number; // oscillation amplitude
}
export interface RoomLightingConfig {
  ambient: number;
  hemisphere: { sky: string; ground: string; intensity: number };
  key: LightSpec & { castShadow: boolean };
  fill: LightSpec;
  rim: LightSpec;
  feature: FeatureLight;
}

/** Pure per-stage lighting numbers. Waiting = calm-neutral ~4800K; office = warm ~3200K.
 *  The feature light is a COOL water shimmer (waiting) or a WARM breathing lamp (office) —
 *  the flicker technique, never an orange fire (brand motif is water). */
export function lightingForStage(stage: RoomStage, palette: RoomPalette): RoomLightingConfig {
  if (stage === "office") {
    return {
      ambient: 0.42,
      hemisphere: { sky: "#43342a", ground: "#241811", intensity: 0.55 },
      key: { color: "#ffdcae", intensity: 1.5, position: [2.5, 4, 2.5], castShadow: true },
      fill: { color: "#e9c58a", intensity: 6, position: [-2, 2.2, 1] },
      rim: { color: palette.trim, intensity: 0.45, position: [-1, 3, -3.5] },
      feature: {
        color: "#ffcaa0", intensity: 2.6, position: [1.5, 1.7, -0.4],
        distance: 5, decay: 2, flicker: "warm", base: 2.6, amp: 0.35,
      },
    };
  }
  return {
    ambient: 0.72,
    hemisphere: { sky: "#efe6da", ground: "#3a2a1c", intensity: 1.05 },
    key: { color: "#fff2df", intensity: 1.85, position: [3, 4.5, 2], castShadow: true },
    fill: { color: "#d7e2e0", intensity: 1.6, position: [-3, 2.5, 1] },
    rim: { color: palette.trim, intensity: 0.45, position: [0, 3, -4] },
    feature: {
      color: palette.water ?? "#5fb6cf", intensity: 3.4, position: [-0.7, 1.1, -2.2],
      distance: 4.5, decay: 2, flicker: "water", base: 3.4, amp: 0.6,
    },
  };
}
