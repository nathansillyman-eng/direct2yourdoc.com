// SealedRoom engine — reusable room tech. No brand/medical identity. No specific assets.
// Everything is palette-driven so a skin re-themes the whole room without touching geometry.
import * as THREE from "three";
import type { RoomStage, RoomSkin } from "./RoomSkin";

const W = 4; // room width  (x)
const D = 5; // room depth  (z)
const H = 3; // room height (y)
const FRONT = -D / 2; // front wall plane (z)

function box(
  name: string,
  size: [number, number, number],
  mat: THREE.Material,
  pos: [number, number, number],
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(...size), mat);
  m.name = name;
  m.position.set(...pos);
  return m;
}

function plane(name: string, w: number, h: number, mat: THREE.Material): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  m.name = name;
  return m;
}

/** Build the sealed room for a stage. Pure: returns a Group, loads nothing. */
export function buildSealedRoom(stage: RoomStage, skin: RoomSkin): THREE.Group {
  const g = new THREE.Group();
  g.name = `sealed-room:${stage}`;
  const p = skin.palette;

  // ---- palette-driven materials -------------------------------------------
  // floor colour MUST stay exactly palette.floor (engine contract / test).
  const floorMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(p.floor),
    roughness: 0.32,
    metalness: 0.1, // faint sheen so the room reads as a real polished floor
  });
  const wallMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(p.wall),
    roughness: 0.96,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });
  const ceilMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(p.wall).multiplyScalar(0.45),
    roughness: 1,
    side: THREE.DoubleSide,
  });
  // Real metallic gold: with the procedural environment in the React layer this
  // catches light and gives a genuine sheen instead of a flat tan block.
  const goldMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(p.trim),
    roughness: 0.35,
    metalness: 0.45, // reads as warm gold under the light rig (no env map needed)
    emissive: new THREE.Color(p.trim),
    emissiveIntensity: 0.14,
  });
  const woodMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(p.floor).lerp(new THREE.Color(p.trim), 0.1),
    roughness: 0.72,
    metalness: 0.05,
  });
  const doorMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(p.wall).multiplyScalar(0.7),
    roughness: 0.5,
    metalness: 0.25,
  });

  // Greeting skin: polished wood + a water feature wall instead of the hearth.
  const greeting = skin.feature === "waterfall";
  if (greeting) {
    // Red-oak panelling reads as polished wood, not matte plaster.
    wallMat.roughness = 0.5;
    wallMat.metalness = 0.08;
    floorMat.roughness = 0.2;
    floorMat.metalness = 0.12;
  }
  const accentMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(p.accent ?? p.fire), // lavender accent (sparingly)
    roughness: 0.55,
    metalness: 0.05,
  });
  const waterCol = new THREE.Color(p.water ?? "#6fb6cf");

  // ---- shell --------------------------------------------------------------
  const floor = plane("floor", W, D, floorMat);
  floor.rotation.x = -Math.PI / 2;
  g.add(floor);

  const ceiling = plane("ceiling", W, D, ceilMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = H;
  g.add(ceiling);

  const wallN = plane("wall-n", W, H, wallMat); // front (-z)
  wallN.position.set(0, H / 2, FRONT);
  g.add(wallN);

  const wallS = plane("wall-s", W, H, wallMat); // back (+z)
  wallS.position.set(0, H / 2, D / 2);
  wallS.rotation.y = Math.PI;
  g.add(wallS);

  const wallW = plane("wall-w", D, H, wallMat);
  wallW.position.set(-W / 2, H / 2, 0);
  wallW.rotation.y = Math.PI / 2;
  g.add(wallW);

  const wallE = plane("wall-e", D, H, wallMat);
  wallE.position.set(W / 2, H / 2, 0);
  wallE.rotation.y = -Math.PI / 2;
  g.add(wallE);

  // Gold baseboard + crown rings — instantly read "designed room", not a box.
  const ring = (nm: string, y: number, h: number) => {
    g.add(box(`${nm}-n`, [W, h, 0.05], goldMat, [0, y, FRONT + 0.03]));
    g.add(box(`${nm}-s`, [W, h, 0.05], goldMat, [0, y, D / 2 - 0.03]));
    g.add(box(`${nm}-w`, [0.05, h, D], goldMat, [-W / 2 + 0.03, y, 0]));
    g.add(box(`${nm}-e`, [0.05, h, D], goldMat, [W / 2 - 0.03, y, 0]));
  };
  ring("base", 0.06, 0.12);
  ring("crown", H - 0.06, 0.08);

  // Warm ceiling fixture (also the visual source of the key light).
  const fixture = box(
    "ceiling-light",
    [1.2, 0.05, 1.2],
    new THREE.MeshStandardMaterial({
      color: 0xfff3da,
      emissive: new THREE.Color(0xfff0d0),
      emissiveIntensity: 1.1,
    }),
    [0, H - 0.05, -0.4],
  );
  g.add(fixture);

  // ---- feature wall: hearth (default) OR a waterfall + koi pond (greeting) --
  // Waiting-room only — the office gets its own warm credential wall (Task 2).
  if (stage === "waiting" && greeting) {
    const FX = -0.7; // feature centre x (door sits on the right at x=1.0)
    // Pale stone backing behind the water.
    g.add(
      box(
        "waterfall-stone",
        [1.7, 2.5, 0.08],
        new THREE.MeshStandardMaterial({ color: new THREE.Color("#c7cfd4"), roughness: 0.85 }),
        [FX, 1.25, FRONT + 0.04],
      ),
    );
    // The water sheet — the React layer scrolls an animated texture onto this
    // (tagged via userData.waterfall). Engine loads nothing.
    const water = plane(
      "waterfall",
      1.5,
      2.2,
      new THREE.MeshStandardMaterial({
        color: waterCol,
        emissive: waterCol,
        emissiveIntensity: 0.28,
        roughness: 0.18,
        metalness: 0.0,
        transparent: true,
        opacity: 0.94,
      }),
    );
    water.position.set(FX, 1.25, FRONT + 0.1);
    water.userData.waterfall = true;
    g.add(water);
    // Gold frame around the feature.
    g.add(box("wf-frame-l", [0.07, 2.55, 0.12], goldMat, [FX - 0.84, 1.25, FRONT + 0.08]));
    g.add(box("wf-frame-r", [0.07, 2.55, 0.12], goldMat, [FX + 0.84, 1.25, FRONT + 0.08]));
    g.add(box("wf-frame-top", [1.75, 0.07, 0.12], goldMat, [FX, 2.52, FRONT + 0.08]));
    // KM emblem above the water (React applies skin.logoImage if provided).
    const emblem = plane(
      "km-emblem",
      0.62,
      0.62,
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(p.trim),
        emissive: new THREE.Color(p.trim),
        emissiveIntensity: 0.5,
        roughness: 0.4,
        metalness: 0.5,
        transparent: true,
      }),
    );
    emblem.position.set(FX, 2.02, FRONT + 0.12);
    emblem.userData.logo = true;
    g.add(emblem);
    // Koi pond basin at the base of the waterfall.
    const pond = plane(
      "koi-pond",
      1.7,
      0.95,
      new THREE.MeshStandardMaterial({ color: new THREE.Color("#0c2a30"), roughness: 0.08, metalness: 0.3 }),
    );
    pond.rotation.x = -Math.PI / 2;
    pond.position.set(FX, 0.04, FRONT + 0.62);
    g.add(pond);
    g.add(box("pond-rim-f", [1.84, 0.09, 0.06], goldMat, [FX, 0.07, FRONT + 1.09]));
    g.add(box("pond-rim-l", [0.06, 0.09, 1.0], goldMat, [FX - 0.89, 0.07, FRONT + 0.62]));
    g.add(box("pond-rim-r", [0.06, 0.09, 1.0], goldMat, [FX + 0.89, 0.07, FRONT + 0.62]));
    // Two koi — each a shaped fish (flat body + tail), not a bare box.
    const koi = (nm: string, colorHex: string, x: number, z: number, ry: number) => {
      const k = new THREE.Group();
      k.name = nm;
      k.position.set(x, 0.06, z);
      k.rotation.y = ry;
      const fishMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(colorHex), roughness: 0.5 });
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), fishMat);
      body.name = `${nm}-body`;
      body.scale.set(1.9, 0.5, 1.0); // long, flat fish body
      k.add(body);
      const tail = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.16, 4), fishMat);
      tail.name = `${nm}-tail`;
      tail.rotation.z = Math.PI / 2;
      tail.position.set(-0.22, 0, 0);
      tail.scale.set(1, 0.5, 1);
      k.add(tail);
      g.add(k);
    };
    koi("koi-1", "#e8743b", FX - 0.25, FRONT + 0.5, 0.4);
    koi("koi-2", "#f2f2f2", FX + 0.32, FRONT + 0.74, -0.8);
  } else if (stage === "waiting") {
    g.add(
      box(
        "hearth-surround",
        [1.5, 1.0, 0.12],
        new THREE.MeshStandardMaterial({ color: new THREE.Color(p.wall).multiplyScalar(0.6), roughness: 0.9 }),
        [-0.95, 0.55, FRONT + 0.06],
      ),
    );
    g.add(
      box(
        "hearth",
        [1.15, 0.62, 0.06],
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(p.fire),
          emissive: new THREE.Color(p.fire),
          emissiveIntensity: 0.9,
        }),
        [-0.95, 0.5, FRONT + 0.1],
      ),
    );
    g.add(box("hearth-mantel", [1.6, 0.1, 0.22], goldMat, [-0.95, 1.12, FRONT + 0.11]));
  }

  // ---- Door 1: the threshold to the office, on the front wall --------------
  const door = box("door-1", [1, 2.1, 0.12], doorMat, [1.0, 1.05, FRONT + 0.07]);
  door.userData.interactive = true;
  g.add(door);
  g.add(box("door-frame-l", [0.08, 2.26, 0.16], goldMat, [0.44, 1.13, FRONT + 0.07]));
  g.add(box("door-frame-r", [0.08, 2.26, 0.16], goldMat, [1.56, 1.13, FRONT + 0.07]));
  g.add(box("door-frame-top", [1.2, 0.08, 0.16], goldMat, [1.0, 2.22, FRONT + 0.07]));
  g.add(box("door-handle", [0.06, 0.18, 0.06], goldMat, [1.38, 1.0, FRONT + 0.14]));
  // A soft threshold glow on the floor — hints the door leads somewhere.
  if (stage === "waiting") {
    g.add(
      box(
        "door-glow",
        [0.9, 0.02, 0.3],
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(p.fire),
          emissive: new THREE.Color(p.fire),
          emissiveIntensity: 0.7,
        }),
        [1.0, 0.02, FRONT + 0.34],
      ),
    );

    // Greeting reception: a wood front desk + a pair of lavender accent chairs.
    if (greeting) {
      const fd = new THREE.Group();
      fd.name = "front-desk";
      fd.position.set(-1.45, 0, -0.1);
      fd.rotation.y = Math.PI / 2; // face into the room
      fd.add(box("fd-body", [1.5, 1.05, 0.6], woodMat, [0, 0.52, 0]));
      fd.add(box("fd-top", [1.6, 0.08, 0.72], goldMat, [0, 1.08, 0]));
      fd.add(box("fd-kick", [1.5, 0.08, 0.62], goldMat, [0, 0.06, 0]));
      g.add(fd);

      const accentChair = (nm: string, x: number, z: number, ry: number) => {
        const c = new THREE.Group();
        c.name = nm;
        c.position.set(x, 0, z);
        c.rotation.y = ry;
        c.add(box(`${nm}-seat`, [0.62, 0.14, 0.6], accentMat, [0, 0.44, 0]));
        c.add(box(`${nm}-back`, [0.62, 0.62, 0.12], accentMat, [0, 0.78, -0.24]));
        c.add(box(`${nm}-arm-l`, [0.1, 0.3, 0.56], accentMat, [-0.27, 0.55, 0]));
        c.add(box(`${nm}-arm-r`, [0.1, 0.3, 0.56], accentMat, [0.27, 0.55, 0]));
        g.add(c);
      };
      accentChair("accent-chair-1", W / 2 - 0.45, 0.5, -Math.PI / 2);
      accentChair("accent-chair-2", W / 2 - 0.45, 1.5, -Math.PI / 2);
    }
  }

  // ---- office furnishings --------------------------------------------------
  if (stage === "office") {
    // Rug grounds the meeting (tonal blend of wall + floor).
    const rug = plane(
      "rug",
      2.7,
      2.1,
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(p.wall).lerp(new THREE.Color(p.floor), 0.4),
        roughness: 0.98,
      }),
    );
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.012, -1.4);
    g.add(rug);

    // Warm back wall behind the doctor: a red-oak bookshelf + framed credentials.
    const shelf = new THREE.Group();
    shelf.name = "bookshelf";
    shelf.position.set(-1.15, 0, FRONT + 0.12); // left of the doctor, on the front wall
    shelf.add(box("shelf-case", [1.5, 1.9, 0.28], woodMat, [0, 0.98, 0]));
    for (let i = 0; i < 3; i++) {
      shelf.add(box(`shelf-plank-${i}`, [1.44, 0.04, 0.26], goldMat, [0, 0.5 + i * 0.55, 0.02]));
      // A row of book spines as slim colour blocks (tonal, premium, not primary).
      for (let b = 0; b < 7; b++) {
        const tint = new THREE.Color(p.wall).lerp(new THREE.Color(p.trim), (b % 3) * 0.18 + 0.1);
        shelf.add(
          box(`book-${i}-${b}`, [0.14, 0.34, 0.2], new THREE.MeshStandardMaterial({ color: tint, roughness: 0.8 }),
            [-0.6 + b * 0.19, 0.72 + i * 0.55, 0.03]),
        );
      }
    }
    g.add(shelf);

    const credential = (nm: string, x: number) => {
      const c = new THREE.Group();
      c.name = nm;
      c.position.set(x, 1.7, FRONT + 0.06);
      c.add(box(`${nm}-frame`, [0.5, 0.62, 0.04], goldMat, [0, 0, 0]));
      c.add(box(`${nm}-mat`, [0.42, 0.54, 0.02],
        new THREE.MeshStandardMaterial({ color: new THREE.Color("#f4ecd8"), roughness: 0.9 }), [0, 0, 0.02]));
      g.add(c);
    };
    credential("credential-1", 0.55);
    credential("credential-2", 1.15);

    // Desk — top, gold edge band, modesty panel, side gables.
    const desk = new THREE.Group();
    desk.name = "desk";
    desk.position.set(0, 0, -1.3);
    desk.add(box("desk-top", [1.7, 0.08, 0.8], woodMat, [0, 0.74, 0]));
    desk.add(box("desk-edge", [1.76, 0.04, 0.86], goldMat, [0, 0.7, 0]));
    desk.add(box("desk-front", [1.6, 0.62, 0.06], woodMat, [0, 0.4, 0.37]));
    desk.add(box("desk-left", [0.06, 0.7, 0.78], woodMat, [-0.82, 0.36, 0]));
    desk.add(box("desk-right", [0.06, 0.7, 0.78], woodMat, [0.82, 0.36, 0]));
    g.add(desk);

    // Chair behind the desk (where the seated presence sits) — FIX: the old
    // chair sat at z=+0.4, looming on top of the camera. It belongs back here.
    const chairMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(p.wall).multiplyScalar(1.35),
      roughness: 0.7,
      metalness: 0.08,
    });
    const chair = new THREE.Group();
    chair.name = "chair";
    chair.position.set(0, 0, -2.15);
    chair.add(box("chair-seat", [0.6, 0.1, 0.58], chairMat, [0, 0.5, 0]));
    chair.add(box("chair-back", [0.6, 0.72, 0.08], chairMat, [0, 0.92, -0.25]));
    chair.add(box("chair-post", [0.08, 0.46, 0.08], chairMat, [0, 0.26, 0]));
    chair.add(box("chair-base", [0.5, 0.05, 0.5], chairMat, [0, 0.04, 0]));
    g.add(chair);

    // The VISITOR's seat — faces the doctor (−Z), conversational distance in front of the desk.
    const patientSeat = new THREE.Group();
    patientSeat.name = "patient-seat";
    patientSeat.position.set(0, 0, 0.4);
    patientSeat.add(box("ps-seat", [0.62, 0.12, 0.6], accentMat, [0, 0.46, 0]));
    patientSeat.add(box("ps-back", [0.62, 0.62, 0.12], accentMat, [0, 0.8, 0.26])); // back behind the sitter (+Z)
    patientSeat.add(box("ps-arm-l", [0.1, 0.3, 0.56], accentMat, [-0.27, 0.57, 0]));
    patientSeat.add(box("ps-arm-r", [0.1, 0.3, 0.56], accentMat, [0.27, 0.57, 0]));
    g.add(patientSeat);

    // Command-file hotspots — framed, gently glowing cards on the front wall.
    for (const obj of skin.commandFile) {
      const card = new THREE.Group();
      card.name = `hotspot:${obj.label}`;
      card.position.set(...obj.position);
      card.userData.label = obj.label;
      card.userData.interactive = true;
      card.add(box("hs-frame", [0.56, 0.38, 0.03], goldMat, [0, 0, -0.012]));
      const face = plane(
        "hs-face",
        0.5,
        0.32,
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(p.wall).multiplyScalar(1.3),
          emissive: new THREE.Color(p.fire),
          emissiveIntensity: 0.22,
          roughness: 0.5,
        }),
      );
      face.position.set(0, 0, 0.006);
      card.add(face);
      g.add(card);
    }
  }

  return g;
}
