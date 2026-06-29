import { describe, it, expect } from "vitest";
import { advanceStage, FADE_MS } from "./locomotion";

describe("advanceStage", () => {
  it("advances waiting -> office", () => {
    expect(advanceStage("waiting")).toBe("office");
  });
  it("is terminal at office (v1 is linear)", () => {
    expect(advanceStage("office")).toBe("office");
  });
});

describe("FADE_MS", () => {
  it("is a comfortable, non-zero fade", () => {
    expect(FADE_MS).toBeGreaterThanOrEqual(200);
    expect(FADE_MS).toBeLessThanOrEqual(800);
  });
});
