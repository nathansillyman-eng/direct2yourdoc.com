// SealedRoom engine — reusable room tech. No brand/medical identity. No specific assets.
import * as THREE from "three";
import type { RoomMaterialSlot, RoomStage, RoomSkin } from "./RoomSkin";

const W = 4; // room width  (x)
const D = 5; // room depth  (z)
const H = 3; // room height (y)

export type RoomMaterialTextures = Partial<
  Record<RoomMaterialSlot, THREE.Texture>
>;

function skinMaterial(
  skin: RoomSkin,
  slot: RoomMaterialSlot,
  fallbackColor: string,
  textures: RoomMaterialTextures,
  options: {
    side?: THREE.Side;
    roughness?: number;
    metalness?: number;
    emissive?: string;
    emissiveIntensity?: number;
  } = {}
): THREE.MeshStandardMaterial {
  const spec = skin.materials?.[slot];
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(spec?.color ?? fallbackColor),
    map: textures[slot] ?? null,
    side: options.side ?? THREE.FrontSide,
    roughness: spec?.roughness ?? options.roughness ?? 0.78,
    metalness: spec?.metalness ?? options.metalness ?? 0,
    emissive: new THREE.Color(spec?.emissive ?? options.emissive ?? "#000000"),
    emissiveIntensity:
      spec?.emissiveIntensity ?? options.emissiveIntensity ?? 0,
  });
}

function panel(
  name: string,
  w: number,
  h: number,
  material: THREE.Material
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
  m.name = name;
  return m;
}

/** Build the sealed room for a stage. Pure: returns a Group, loads nothing. */
export function buildSealedRoom(
  stage: RoomStage,
  skin: RoomSkin,
  textures: RoomMaterialTextures = {}
): THREE.Group {
  const g = new THREE.Group();
  g.name = `sealed-room:${stage}`;
  const p = skin.palette;

  const wallMat = skinMaterial(skin, "wall", p.wall, textures, {
    side: THREE.DoubleSide,
    roughness: 0.92,
  });
  const floorMat = skinMaterial(skin, "floor", p.floor, textures, {
    side: THREE.DoubleSide,
    roughness: 0.88,
  });
  const trimMat = skinMaterial(skin, "trim", p.trim, textures, {
    roughness: 0.45,
    metalness: 0.25,
  });
  const hearthMat = skinMaterial(skin, "hearth", p.fire, textures, {
    emissive: p.fire,
    emissiveIntensity: 0.6,
    roughness: 0.72,
  });

  const floor = panel("floor", W, D, floorMat);
  floor.rotation.x = -Math.PI / 2;
  g.add(floor);

  const ceiling = panel("ceiling", W, D, wallMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = H;
  g.add(ceiling);

  const wallN = panel("wall-n", W, H, wallMat); // front (-z)
  wallN.position.set(0, H / 2, -D / 2);
  g.add(wallN);

  const wallS = panel("wall-s", W, H, wallMat); // back (+z)
  wallS.position.set(0, H / 2, D / 2);
  wallS.rotation.y = Math.PI;
  g.add(wallS);

  const wallW = panel("wall-w", D, H, wallMat);
  wallW.position.set(-W / 2, H / 2, 0);
  wallW.rotation.y = Math.PI / 2;
  g.add(wallW);

  const wallE = panel("wall-e", D, H, wallMat);
  wallE.position.set(W / 2, H / 2, 0);
  wallE.rotation.y = -Math.PI / 2;
  g.add(wallE);

  // Hearth: a glowing trim block on the front wall (the warm anchor).
  const hearth = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.6, 0.2),
    hearthMat
  );
  hearth.name = "hearth";
  hearth.position.set(0, 0.3, -D / 2 + 0.11);
  g.add(hearth);

  // Door 1: the threshold to the office, on the front wall.
  const door = new THREE.Mesh(new THREE.BoxGeometry(1, 2.1, 0.12), trimMat);
  door.name = "door-1";
  door.position.set(1.0, 1.05, -D / 2 + 0.07);
  door.userData.interactive = true;
  g.add(door);

  if (stage === "office") {
    const deskMat = skinMaterial(skin, "desk", p.trim, textures, {
      roughness: 0.82,
    });
    const desk = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.75, 0.7), deskMat);
    desk.name = "desk";
    desk.position.set(0, 0.375, -1.4);
    g.add(desk);

    const chair = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.9, 0.6),
      skinMaterial(skin, "chair", p.wall, textures, { roughness: 0.84 })
    );
    chair.name = "chair";
    chair.position.set(0, 0.45, 0.4);
    g.add(chair);

    const hotspotMat = skinMaterial(skin, "hotspot", p.trim, textures, {
      emissive: p.fire,
      emissiveIntensity: 0.15,
      roughness: 0.42,
      metalness: 0.3,
    });

    for (const obj of skin.commandFile) {
      // 0.4 m wide plaque: narrower than the 7-across arc() spacing (3.2/6 ≈ 0.533 m)
      // so adjacent hotspots never overlap (overlap = double-fire on one click).
      const hot = new THREE.Mesh(
        new THREE.PlaneGeometry(0.4, 0.28),
        hotspotMat
      );
      hot.name = `hotspot:${obj.label}`;
      hot.position.set(...obj.position);
      hot.userData.label = obj.label;
      hot.userData.interactive = true;
      g.add(hot);
    }
  }

  return g;
}
