// Pure in-headset comfort math. No three.js, no React — fully unit-testable.
// The scene layer (SealedRoomCanvas) applies these numbers to the live XR rig.

/** Where must the XR ORIGIN go so the visitor's HEAD lands on `target`?
 *  Real-world walking persists across stage teleports: head = origin + walked offset.
 *  Compensating cancels the walk so a stage swap never spawns someone inside the desk. */
export function compensatedOrigin(
  target: [number, number],
  headLocal: [number, number],
): [number, number] {
  return [target[0] - headLocal[0], target[1] - headLocal[1]];
}

/** Ignore head micro-sway below this angle (radians) so billboards hold still. */
const YAW_DEADZONE = 0.02;
/** Exponential smoothing rate — higher turns faster. ~7 ≈ settles in ~0.4s. */
const YAW_RATE = 7;

/** Frame-rate-independent damped yaw: eases `current` toward `target` along the
 *  SHORTEST arc (wrap-safe) and holds still inside a small deadzone — this is what
 *  turns a 1:1 head-tracked sign from "nervous" into "calm concierge". */
export function dampYawTowards(current: number, target: number, dt: number): number {
  const delta = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  if (Math.abs(delta) < YAW_DEADZONE) return current;
  const step = delta * (1 - Math.exp(-YAW_RATE * dt));
  return current + step;
}

// Door 1 sits at x=1.0 on the front wall (z=−2.5); frames at x=0.44..1.56.
const DOOR_X_MIN = 0.45;
const DOOR_X_MAX = 1.55;
const DOOR_Z_NEAR = -1.7; // begin the threshold beat a step before the door

/** Is a head position physically AT Door 1's threshold in the waiting room?
 *  Walking into the doorway is a first-class way in — never the ray alone. */
export function inDoorZone(x: number, z: number): boolean {
  return x >= DOOR_X_MIN && x <= DOOR_X_MAX && z <= DOOR_Z_NEAR;
}

const BEAT_DISTANCE = 1.7; // metres in front of the viewer
const BEAT_Y = 1.45; // card height
// Keep the beat well inside the 4×5 room and clear of the front-wall furniture.
const BEAT_X_LIMIT = 1.4;
const BEAT_Z_MIN = -1.4;
const BEAT_Z_MAX = 1.8;

/** Spawn the host beat in FRONT of wherever the visitor actually stands (they roam
 *  in-headset), clamped inside the room so it never buries itself in a wall. */
export function beatPlacement(headX: number, headZ: number, yaw: number): [number, number, number] {
  const x = headX - Math.sin(yaw) * BEAT_DISTANCE;
  const z = headZ - Math.cos(yaw) * BEAT_DISTANCE;
  return [
    Math.min(BEAT_X_LIMIT, Math.max(-BEAT_X_LIMIT, x)),
    BEAT_Y,
    Math.min(BEAT_Z_MAX, Math.max(BEAT_Z_MIN, z)),
  ];
}

/** The engine's desk chair exists for the SEATED billboard fallback. A standing
 *  rigged doctor replaces it — showing both puts the doctor inside the chair. */
export function deskChairVisible(stage: string, castCount: number): boolean {
  return !(stage === "office" && castCount > 0);
}
