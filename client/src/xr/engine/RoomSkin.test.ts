import { describe, it, expect } from "vitest";
import { neutralSkin, arc, type RoomObject } from "./RoomSkin";

describe("arc", () => {
  it("returns one RoomObject per label", () => {
    const objs = arc(["A", "B", "C"]);
    expect(objs).toHaveLength(3);
    expect(objs.map((o: RoomObject) => o.label)).toEqual(["A", "B", "C"]);
  });

  it("spreads labels symmetrically across x and keeps them on the front wall", () => {
    const objs = arc(["A", "B", "C"]);
    const xs = objs.map((o) => o.position[0]);
    expect(xs[0]).toBeLessThan(0);
    expect(Math.abs(xs[1])).toBeLessThan(1e-9); // middle centered
    expect(xs[2]).toBeGreaterThan(0);
    objs.forEach((o) => expect(o.position[2]).toBeCloseTo(-2.3)); // front wall
  });

  it("handles a single label at center", () => {
    const objs = arc(["Solo"]);
    expect(objs[0].position[0]).toBeCloseTo(0);
  });
});

describe("neutralSkin", () => {
  it("is a complete, brandless RoomSkin", () => {
    expect(neutralSkin.id).toBe("neutral");
    expect(neutralSkin.palette).toMatchObject({
      wall: expect.any(String),
      floor: expect.any(String),
      trim: expect.any(String),
      fire: expect.any(String),
    });
    expect(neutralSkin.commandFile).toEqual([]);
    expect(neutralSkin.presenceImage).toBeUndefined();
  });
});
