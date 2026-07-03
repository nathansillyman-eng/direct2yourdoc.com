import { describe, it, expect } from "vitest";
import { lightingForStage } from "./lighting-config";

const palette = { wall: "#7a4a2c", floor: "#6b3f26", trim: "#c9a24b", fire: "#3aa0b5", water: "#5fb6cf" };

describe("lightingForStage", () => {
  it("waiting is cooler/brighter with a cool water feature light", () => {
    const l = lightingForStage("waiting", palette);
    expect(l.feature.flicker).toBe("water");
    expect(l.feature.color).toBe("#5fb6cf");
    expect(l.key.intensity).toBeGreaterThan(lightingForStage("office", palette).key.intensity);
  });
  it("office is warm with a warm breathing feature light and casts a key shadow", () => {
    const l = lightingForStage("office", palette);
    expect(l.feature.flicker).toBe("warm");
    expect(l.key.castShadow).toBe(true);
  });
  it("office reads calm-positive: a soft key (not a harsh clinical spot) and lifted ambient fill", () => {
    const l = lightingForStage("office", palette);
    expect(l.key.intensity).toBeLessThanOrEqual(1.3);
    expect(l.ambient).toBeGreaterThanOrEqual(0.48);
  });
});
