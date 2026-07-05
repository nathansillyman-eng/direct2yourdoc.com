import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { buildSealedRoom } from "./SealedRoom";
import { neutralSkin, type RoomSkin } from "./RoomSkin";

const skin: RoomSkin = {
  ...neutralSkin,
  id: "test",
  palette: { wall: "#102030", floor: "#0a0a0a", trim: "#405060", fire: "#ff8800" },
  commandFile: [
    { label: "Records", position: [-1, 1.4, -2.3] },
    { label: "Labs", position: [1, 1.4, -2.3] },
  ],
};

const greeting: RoomSkin = {
  ...neutralSkin,
  id: "greeting-test",
  feature: "waterfall",
  logoImage: "/brand/km-emblem.png",
  palette: { wall: "#7a4a2c", floor: "#6b3f26", trim: "#c9a24b", fire: "#3aa0b5", accent: "#6c4f93", water: "#5fb6cf" },
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

  it("builds without throwing for the neutral skin (no brand, empty command file)", () => {
    expect(() => buildSealedRoom("office", neutralSkin)).not.toThrow();
    const g = buildSealedRoom("office", neutralSkin);
    expect(g.children.filter((c) => c.name.startsWith("hotspot:"))).toHaveLength(0);
  });
});

describe("feature wall is waiting-room only", () => {
  it("puts the waterfall + koi + emblem in the waiting room", () => {
    const g = buildSealedRoom("waiting", greeting);
    for (const n of ["waterfall", "koi-pond", "km-emblem"]) expect(names(g)).toContain(n);
  });
  it("does NOT put the waterfall in the office", () => {
    const g = buildSealedRoom("office", greeting);
    for (const n of ["waterfall", "koi-pond", "km-emblem"]) expect(names(g)).not.toContain(n);
  });
  it("stocks the pool with SWIMMING koi — tagged with pond bounds for the React layer (v2, 2026-07-04: static koi were pulled as dead clutter; life is motion)", () => {
    const g = buildSealedRoom("waiting", greeting);
    expect(g.getObjectByName("koi-pond")).toBeTruthy();
    for (const k of [0, 1, 2]) {
      const koi = g.getObjectByName(`koi-${k}`)!;
      expect(koi).toBeTruthy();
      expect(koi.userData.koi).toBe(k);
      const pond = koi.userData.pond;
      expect(pond.rx).toBeGreaterThan(0);
      expect(pond.rz).toBeGreaterThan(0);
      expect(koi.getObjectByName(`koi-${k}-tail`)).toBeTruthy(); // wag pivot for the swim
    }
    // Koi belong to the GREETING pond only — never the classic hearth room.
    expect(buildSealedRoom("waiting", skin).getObjectByName("koi-0")).toBeFalsy();
  });
});

describe("office back wall + seating", () => {
  it("gives the office a credential + bookshelf back wall", () => {
    const g = buildSealedRoom("office", greeting);
    expect(names(g)).toContain("bookshelf");
    expect(names(g)).toContain("credential-1");
    expect(names(g)).toContain("credential-2");
    const w = buildSealedRoom("waiting", greeting);
    expect(names(w)).not.toContain("bookshelf");
  });
  it("adds a patient sit-anchor seat facing the doctor in the office", () => {
    const g = buildSealedRoom("office", greeting);
    const seat = g.getObjectByName("patient-seat");
    expect(seat).toBeTruthy();
    expect(seat!.position.z).toBeCloseTo(0.4, 1);
  });
  it("adds a living plant element to the office (feng-shui calm-positive direction)", () => {
    const g = buildSealedRoom("office", greeting);
    expect(names(g)).toContain("office-plant");
    const w = buildSealedRoom("waiting", greeting);
    expect(names(w)).not.toContain("office-plant");
  });
});
