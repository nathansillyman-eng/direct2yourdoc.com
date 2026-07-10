import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { buildSealedRoom } from "./SealedRoom";
import { arc, neutralSkin, type RoomSkin } from "./RoomSkin";

const skin: RoomSkin = {
  ...neutralSkin,
  id: "test",
  palette: { wall: "#102030", floor: "#0a0a0a", trim: "#405060", fire: "#ff8800" },
  commandFile: [
    { label: "Records", position: [-1, 1.4, -2.3] },
    { label: "Labs", position: [1, 1.4, -2.3] },
  ],
};

function names(g: THREE.Group): string[] {
  return g.children.map((c) => c.name);
}

describe("buildSealedRoom", () => {
  it("builds the shell + closed door in the waiting stage", () => {
    const g = buildSealedRoom("waiting", skin);
    for (const n of ["floor", "ceiling", "wall-n", "wall-s", "wall-e", "wall-w", "hearth", "door-1"]) {
      expect(names(g)).toContain(n);
    }
    // No office furniture in the waiting room.
    expect(names(g)).not.toContain("desk");
    expect(names(g).some((n) => n.startsWith("hotspot:"))).toBe(false);
  });

  it("adds desk, chair, and one hotspot per command-file entry in the office stage", () => {
    const g = buildSealedRoom("office", skin);
    expect(names(g)).toContain("desk");
    expect(names(g)).toContain("chair");
    const hotspots = g.children.filter((c) => c.name.startsWith("hotspot:"));
    expect(hotspots).toHaveLength(2);
    expect(hotspots.map((h) => h.userData.label).sort()).toEqual(["Labs", "Records"]);
  });

  it("applies palette colours to the floor and walls", () => {
    const g = buildSealedRoom("waiting", skin);
    const floor = g.getObjectByName("floor") as THREE.Mesh;
    const mat = floor.material as THREE.MeshStandardMaterial;
    expect(`#${mat.color.getHexString()}`).toBe("#0a0a0a");
  });

  it("keeps hotspot plaques narrower than the tightest arc() spacing (no overlap => no double-fire)", () => {
    // 7 labels is the densest shipped layout; one click must never hit two plaques.
    const labels = ["A", "B", "C", "D", "E", "F", "G"];
    const dense: RoomSkin = { ...skin, commandFile: arc(labels) };
    const xs = dense.commandFile.map((o) => o.position[0]);
    const minSpacing = Math.min(...xs.slice(1).map((x, i) => x - xs[i]));
    const g = buildSealedRoom("office", dense);
    for (const h of g.children.filter((c) => c.name.startsWith("hotspot:"))) {
      const geo = (h as THREE.Mesh).geometry as THREE.PlaneGeometry;
      expect(geo.parameters.width).toBeLessThan(minSpacing);
    }
  });

  it("builds without throwing for the neutral skin (no brand, empty command file)", () => {
    expect(() => buildSealedRoom("office", neutralSkin)).not.toThrow();
    const g = buildSealedRoom("office", neutralSkin);
    expect(g.children.filter((c) => c.name.startsWith("hotspot:"))).toHaveLength(0);
  });
});
