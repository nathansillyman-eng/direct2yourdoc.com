// Koi swim math — pure, unit-space, testable. The previous koi were STATIC and read
// as dead clutter (pulled 2026-07-03). Life comes from MOTION: each koi cruises its
// own slow ellipse under the pond surface with a gentle tail wag. The caller maps
// unit space onto the real pond basin and builds/animates the meshes.

export const KOI_COUNT = 3;

export interface KoiPose {
  x: number; // unit-ellipse space, |(x,z)| ≤ 1
  z: number;
  yaw: number; // heading along the swim path (radians)
  wag: number; // tail deflection, ± bounded
}

// Per-koi character: different lap speeds, radii, directions and phases so the
// school never stacks or reads as synchronized clockwork.
const SPEED = [0.24, 0.31, 0.19];
const RADIUS = [0.82, 0.6, 0.72];
const SQUASH = [0.62, 0.75, 0.55]; // z-radius as a fraction of x-radius
const DIR = [1, -1, 1];
const PHASE = [0, 2.3, 4.4];
const WAG_HZ = [1.6, 2.1, 1.4];
const WAG_AMP = 0.38;

/** Where is koi `k` at time `t` (seconds), in unit pond space? */
export function koiPose(t: number, k: number): KoiPose {
  const i = k % KOI_COUNT;
  const a = DIR[i] * (t * SPEED[i] * Math.PI * 2) + PHASE[i];
  const rx = RADIUS[i];
  const rz = RADIUS[i] * SQUASH[i];
  const x = Math.cos(a) * rx;
  const z = Math.sin(a) * rz;
  // Path tangent: d/da (cos·rx, sin·rz) = (−sin·rx, cos·rz), scaled by direction.
  const dx = -Math.sin(a) * rx * DIR[i];
  const dz = Math.cos(a) * rz * DIR[i];
  return {
    x,
    z,
    yaw: Math.atan2(dx, dz),
    wag: Math.sin(t * WAG_HZ[i] * Math.PI * 2 + PHASE[i]) * WAG_AMP,
  };
}
