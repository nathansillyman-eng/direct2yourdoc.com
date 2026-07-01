import { describe, it, expect } from "vitest";
import { audioForStage } from "./audio-config";
import type { RoomSkin } from "@/xr/engine/RoomSkin";

const skin = {
  audio: {
    waiting: {
      bed: "/audio/d2yd/d2yd_waiting_tone.mp3",
      sources: [{ url: "/audio/d2yd/d2yd_waiting_waterfall.mp3", position: [-0.7, 1, -2.2], gain: 0.5 }],
    },
    office: { bed: "/audio/d2yd/d2yd_office_tone.mp3", sources: [] },
  },
} as unknown as RoomSkin;

describe("audioForStage", () => {
  it("returns the waiting bed + positional sources", () => {
    const a = audioForStage("waiting", skin);
    expect(a.bed).toContain("waiting_tone");
    expect(a.sources).toHaveLength(1);
  });
  it("returns an empty result when the skin has no audio", () => {
    const a = audioForStage("office", {} as RoomSkin);
    expect(a.bed).toBeUndefined();
    expect(a.sources).toEqual([]);
  });
});
