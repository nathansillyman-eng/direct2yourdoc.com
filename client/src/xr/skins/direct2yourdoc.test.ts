import { describe, it, expect } from "vitest";
import { direct2YourDocSkin } from "./direct2yourdoc";
import { arc } from "@/xr/engine/RoomSkin";

describe("direct2YourDocSkin", () => {
  it("is a complete RoomSkin with the brand palette", () => {
    expect(direct2YourDocSkin.id).toBe("direct2yourdoc");
    expect(direct2YourDocSkin.palette.wall).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(direct2YourDocSkin.palette.fire).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it("exposes the patient command file as arced room objects", () => {
    expect(direct2YourDocSkin.commandFile.length).toBeGreaterThanOrEqual(4);
    // command file is laid out with arc() — every entry sits on the front wall
    direct2YourDocSkin.commandFile.forEach((o) => expect(o.position[2]).toBeCloseTo(-2.3));
  });

  it("declares a presence image path under manus-storage", () => {
    expect(direct2YourDocSkin.presenceImage).toContain("/manus-storage/");
  });

  it("regenerates the same layout via arc()", () => {
    const labels = direct2YourDocSkin.commandFile.map((o) => o.label);
    expect(direct2YourDocSkin.commandFile).toEqual(arc(labels));
  });
});
