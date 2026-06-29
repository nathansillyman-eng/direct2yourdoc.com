// SealedRoom engine — reusable room tech. No brand/medical identity. No specific assets.
import * as THREE from "three";
import type { RoomStage, RoomSkin } from "./RoomSkin";

const W = 4; // room width  (x)
const D = 5; // room depth  (z)
const H = 3; // room height (y)

function panel(name: string, w: number, h: number, color: string): THREE.Mesh {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(color), side: THREE.DoubleSide }),
  );
  m.name = name;
  return m;
}

/** Build the sealed room for a stage. Pure: returns a Group, loads nothing. */
export function buildSealedRoom(stage: RoomStage, skin: RoomSkin): THREE.Group {
  const g = new THREE.Group();
  g.name = `sealed-room:${stage}`;
  const p = skin.palette;

  const floor = panel("floor", W, D, p.floor);
  floor.rotation.x = -Math.PI / 2;
  g.add(floor);

  const ceiling = panel("ceiling", W, D, p.wall);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = H;
  g.add(ceiling);

  const wallN = panel("wall-n", W, H, p.wall); // front (-z)
  wallN.position.set(0, H / 2, -D / 2);
  g.add(wallN);

  const wallS = panel("wall-s", W, H, p.wall); // back (+z)
  wallS.position.set(0, H / 2, D / 2);
  wallS.rotation.y = Math.PI;
  g.add(wallS);

  const wallW = panel("wall-w", D, H, p.wall);
  wallW.position.set(-W / 2, H / 2, 0);
  wallW.rotation.y = Math.PI / 2;
  g.add(wallW);

  const wallE = panel("wall-e", D, H, p.wall);
  wallE.position.set(W / 2, H / 2, 0);
  wallE.rotation.y = -Math.PI / 2;
  g.add(wallE);

  // Hearth: a glowing trim block on the front wall (the warm anchor).
  const hearth = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.6, 0.2),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(p.fire),
      emissive: new THREE.Color(p.fire),
      emissiveIntensity: 0.6,
    }),
  );
  hearth.name = "hearth";
  hearth.position.set(0, 0.3, -D / 2 + 0.11);
  g.add(hearth);

  // Door 1: the threshold to the office, on the front wall.
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2.1, 0.12),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(p.trim) }),
  );
  door.name = "door-1";
  door.position.set(1.0, 1.05, -D / 2 + 0.07);
  door.userData.interactive = true;
  g.add(door);

  if (stage === "office") {
    const deskMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(p.trim) });
    const desk = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.75, 0.7), deskMat);
    desk.name = "desk";
    desk.position.set(0, 0.375, -1.4);
    g.add(desk);

    const chair = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.9, 0.6),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(p.wall) }),
    );
    chair.name = "chair";
    chair.position.set(0, 0.45, 0.4);
    g.add(chair);

    for (const obj of skin.commandFile) {
      const hot = new THREE.Mesh(
        new THREE.PlaneGeometry(0.5, 0.32),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(p.trim),
          emissive: new THREE.Color(p.fire),
          emissiveIntensity: 0.15,
        }),
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
