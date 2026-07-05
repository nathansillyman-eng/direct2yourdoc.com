import { describe, expect, it } from "vitest";
import { koiPose, KOI_COUNT } from "./koi";

describe("koiPose", () => {
  it("keeps every koi inside the unit pond ellipse at all times", () => {
    for (let k = 0; k < KOI_COUNT; k++) {
      for (let t = 0; t < 40; t += 0.25) {
        const p = koiPose(t, k);
        // unit-space ellipse: x²+z² ≤ 1 (mapped to the real pond by the caller)
        expect(p.x * p.x + p.z * p.z).toBeLessThanOrEqual(1.0001);
      }
    }
  });
  it("faces along its direction of travel (yaw matches the path tangent)", () => {
    const t = 3.2;
    const a = koiPose(t, 0);
    const b = koiPose(t + 0.02, 0);
    const heading = Math.atan2(b.x - a.x, b.z - a.z);
    // wrap-safe angular difference
    const diff = Math.atan2(Math.sin(heading - a.yaw), Math.cos(heading - a.yaw));
    expect(Math.abs(diff)).toBeLessThan(0.2);
  });
  it("gives each koi its own phase so they never stack", () => {
    const a = koiPose(5, 0);
    const b = koiPose(5, 1);
    const d = Math.hypot(a.x - b.x, a.z - b.z);
    expect(d).toBeGreaterThan(0.15);
  });
  it("wags the tail within a gentle bound", () => {
    for (let t = 0; t < 10; t += 0.1) {
      expect(Math.abs(koiPose(t, 0).wag)).toBeLessThanOrEqual(0.45);
    }
  });
});
