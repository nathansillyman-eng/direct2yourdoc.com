import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { buildPresence } from "./presence";
import { neutralSkin } from "./RoomSkin";

function plane(g: THREE.Group): THREE.Mesh {
  return g.getObjectByName("presence-plane") as THREE.Mesh;
}

describe("buildPresence", () => {
  it("returns a group with a presence plane positioned behind the desk", () => {
    const g = buildPresence(neutralSkin);
    const p = plane(g);
    expect(p).toBeTruthy();
    expect(p.position.z).toBeLessThan(-1.4); // behind the desk (desk at z=-1.4)
  });

  it("uses a neutral material (no map) when no texture is supplied", () => {
    const g = buildPresence(neutralSkin);
    const mat = plane(g).material as THREE.MeshBasicMaterial;
    expect(mat.map).toBeNull();
  });

  it("applies the supplied texture as the plane's map", () => {
    const tex = new THREE.Texture();
    const g = buildPresence(neutralSkin, tex);
    const mat = plane(g).material as THREE.MeshBasicMaterial;
    expect(mat.map).toBe(tex);
    expect(mat.transparent).toBe(true);
  });

  it("does not throw when the skin has no doctorImage", () => {
    expect(() => buildPresence(neutralSkin)).not.toThrow();
  });
});
