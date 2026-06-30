// SealedRoom engine — reusable room tech. No brand/medical identity. No specific assets.
import * as THREE from "three";
import type { RoomSkin } from "./RoomSkin";

/**
 * A seated "presence" behind the desk. Stage 1: neutral volume. Stage 2/live:
 * the React layer loads skin.presenceImage (or a WebRTC video texture) and passes
 * it in here. The engine itself loads nothing.
 */
export function buildPresence(skin: RoomSkin, texture?: THREE.Texture): THREE.Group {
  const g = new THREE.Group();
  g.name = "presence";

  const mat = new THREE.MeshBasicMaterial({
    // With a texture: show it true-colour. Without (Stage 1): a soft dark silhouette
    // that reads as "a person sits here" — NOT a bright placeholder slab. The real
    // seated presence (image or WebRTC video) replaces this in Stage 2.
    color: texture ? 0xffffff : new THREE.Color(skin.palette.wall).multiplyScalar(1.5),
    map: texture ?? null,
    transparent: true,
    opacity: texture ? 1 : 0.92,
    side: THREE.DoubleSide,
  });
  const planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.6), mat);
  planeMesh.name = "presence-plane";
  planeMesh.position.set(0, 1.1, -2.0); // seated, behind the desk, facing the visitor
  planeMesh.userData.billboard = true; // React layer keeps it facing the camera
  g.add(planeMesh);

  return g;
}
