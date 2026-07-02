import { describe, it, expect } from "vitest";
import { castForStage } from "./cast-config";
import type { RoomSkin } from "@/xr/engine/RoomSkin";

const skin = {
  cast: { office: [{ model: "/models/d2yd-doctor.glb", position: [0, 0, -2.2] as [number, number, number] }] },
} as unknown as RoomSkin;

describe("castForStage", () => {
  it("returns the office cast", () => {
    const c = castForStage("office", skin);
    expect(c).toHaveLength(1);
    expect(c[0].model).toContain("doctor");
  });
  it("returns [] when a stage or the skin has no cast", () => {
    expect(castForStage("waiting", skin)).toEqual([]);
    expect(castForStage("office", {} as RoomSkin)).toEqual([]);
  });
});
