// SealedRoom engine — reusable room tech. No brand/medical identity. No specific assets.
import * as THREE from "three";
import type { RoomSkin } from "./RoomSkin";

export const PRESENCE_HEIGHT = 1.6; // metres, fixed; width follows the texture
// Matches the shipped founder portrait (896x1200) so the untextured fallback
// plane has the same footprint as the loaded one (no pop when the texture lands).
export const PRESENCE_FALLBACK_ASPECT = 896 / 1200;

/** Width/height aspect of a texture's backing image, or the fallback aspect. */
export function presenceAspect(texture?: THREE.Texture): number {
  const img = texture?.image as { width?: number; height?: number } | undefined;
  return img?.width && img?.height ? img.width / img.height : PRESENCE_FALLBACK_ASPECT;
}

/**
 * A seated "presence" behind the desk. Stage 1: neutral volume. Stage 2/live:
 * the React layer loads skin.presenceImage (or a WebRTC video texture) and passes
 * it in here. The engine itself loads nothing. The plane is sized to the
 * texture's true aspect so the portrait is never squeezed or stretched.
 */
export function buildPresence(skin: RoomSkin, texture?: THREE.Texture): THREE.Group {
  const g = new THREE.Group();
  g.name = "presence";

  const mat = new THREE.MeshBasicMaterial({
    color: texture ? 0xffffff : new THREE.Color(skin.palette.trim),
    map: texture ?? null,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(PRESENCE_HEIGHT * presenceAspect(texture), PRESENCE_HEIGHT),
    mat,
  );
  planeMesh.name = "presence-plane";
  planeMesh.position.set(0, 1.1, -2.0); // seated, behind the desk, facing the visitor
  planeMesh.userData.billboard = true; // React layer keeps it facing the camera
  g.add(planeMesh);

  return g;
}
