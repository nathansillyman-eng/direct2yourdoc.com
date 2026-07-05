import { describe, expect, it } from "vitest";
import {
  compensatedOrigin,
  dampYawTowards,
  inDoorZone,
  beatPlacement,
  deskChairVisible,
} from "./xr-comfort";

describe("compensatedOrigin", () => {
  it("places the origin so the HEAD lands on the target, cancelling walked offset", () => {
    // Head has physically drifted +1.2m toward the front wall (−z) and 0.3 right.
    expect(compensatedOrigin([0, 0.4], [0.3, -1.2])).toEqual([-0.3, 1.6]);
  });
  it("is the identity when the visitor has not moved", () => {
    expect(compensatedOrigin([0, 1.6], [0, 0])).toEqual([0, 1.6]);
  });
});

describe("dampYawTowards", () => {
  it("moves toward the target without overshooting", () => {
    const next = dampYawTowards(0, 1, 0.016);
    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThan(1);
  });
  it("converges to within the deadzone of the target over time", () => {
    let yaw = 0;
    for (let i = 0; i < 240; i++) yaw = dampYawTowards(yaw, 1.4, 1 / 72);
    expect(Math.abs(yaw - 1.4)).toBeLessThan(0.021); // parks inside the anti-jitter deadzone
  });
  it("takes the SHORT way around the wrap (no 350° spin for a 10° turn)", () => {
    const next = dampYawTowards(Math.PI - 0.05, -Math.PI + 0.05, 0.016);
    // Shortest arc is +0.1 rad across the seam — yaw must INCREASE past +π side,
    // i.e. the result stays near +π, not swing toward 0.
    expect(Math.abs(next)).toBeGreaterThan(Math.PI - 0.06);
  });
  it("ignores micro-jitter inside the deadzone", () => {
    expect(dampYawTowards(1.0, 1.0 + 0.005, 0.016)).toBe(1.0);
  });
});

describe("inDoorZone", () => {
  it("is true directly at Door 1's threshold (door centred at x=1.0 on the front wall)", () => {
    expect(inDoorZone(1.0, -2.0)).toBe(true);
  });
  it("is false in the middle of the waiting room", () => {
    expect(inDoorZone(0, 0)).toBe(false);
  });
  it("is false near the front wall but away from the door (the waterfall side)", () => {
    expect(inDoorZone(-0.7, -2.1)).toBe(false);
  });
});

describe("beatPlacement", () => {
  it("spawns the host beat ~1.7m ahead of the viewer, at card height", () => {
    const [x, y, z] = beatPlacement(0, 1.6, 0); // yaw 0 faces −z
    expect(x).toBeCloseTo(0, 5);
    expect(y).toBeCloseTo(1.45, 5);
    expect(z).toBeCloseTo(1.6 - 1.7, 5);
  });
  it("clamps inside the room when the viewer stands at the front wall", () => {
    const [x, , z] = beatPlacement(1.0, -2.2, 0);
    expect(z).toBeGreaterThanOrEqual(-1.4); // never inside the front wall / door
    expect(Math.abs(x)).toBeLessThanOrEqual(1.4);
  });
});

describe("deskChairVisible", () => {
  it("hides the engine desk chair when a standing 3D cast occupies the office", () => {
    expect(deskChairVisible("office", 1)).toBe(false);
  });
  it("keeps the chair for the seated billboard fallback (no cast)", () => {
    expect(deskChairVisible("office", 0)).toBe(true);
  });
  it("never touches the chair outside the office", () => {
    expect(deskChairVisible("waiting", 3)).toBe(true);
  });
});
