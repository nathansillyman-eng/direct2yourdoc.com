import * as THREE from "three";

/** A tiling red-oak grain CanvasTexture — a warm base with soft, slightly wavy
 *  vertical grain streaks. Cheap, Quest-friendly, no asset fetch. */
export function makeWoodTexture(baseHex: string): THREE.CanvasTexture {
  const w = 256;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  // Near-neutral base so applying this as `.map` only MODULATES grain — the mesh
  // material's own colour supplies the wood hue (baseHex just nudges the tint).
  const tint = new THREE.Color(baseHex).lerp(new THREE.Color("#d8ccbb"), 0.8);
  ctx.fillStyle = `#${tint.getHexString()}`;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 80; i++) {
    const x = (i * 34) % w;
    const light = i % 2 === 0;
    ctx.globalAlpha = 0.05 + ((i * 13) % 10) / 110;
    ctx.strokeStyle = `#${tint.clone().lerp(new THREE.Color(light ? 0xffffff : 0x6b5a44), 0.5).getHexString()}`;
    ctx.lineWidth = 1 + (i % 3);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 9, h * 0.33, x - 9, h * 0.66, x + 5, h);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}
