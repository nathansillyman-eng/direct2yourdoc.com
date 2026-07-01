import { useEffect, useRef } from "react";
import type { RoomSkin, RoomStage } from "@/xr/engine/RoomSkin";
import { audioForStage } from "./audio-config";

/** Ambient beds for the sealed room. Plain HTML5 <audio> loops — no spatialization in
 *  v1 (positions are carried in the config for a future PositionalAudio upgrade). Gated
 *  on a user gesture so it respects browser autoplay policy. Gains stay low so nothing
 *  masks a spoken presence. Renders no DOM; manages audio elements imperatively. */
export function RoomAudio({ stage, skin, enabled }: { stage: RoomStage; skin: RoomSkin; enabled: boolean }) {
  const els = useRef<HTMLAudioElement[]>([]);

  useEffect(() => {
    // Tear down the previous stage's audio.
    els.current.forEach((a) => {
      a.pause();
      a.src = "";
    });
    els.current = [];
    if (!enabled) return;

    const cfg = audioForStage(stage, skin);
    const make = (url: string, vol: number) => {
      const a = new Audio(url);
      a.loop = true;
      a.volume = vol;
      a.play().catch(() => {}); // ignore autoplay rejection; re-enabled on the next gesture
      els.current.push(a);
    };
    if (cfg.bed) make(cfg.bed, 0.2); // low bed — never competes with a voice
    cfg.sources.forEach((s) => make(s.url, Math.min(0.5, s.gain)));

    return () => {
      els.current.forEach((a) => {
        a.pause();
        a.src = "";
      });
      els.current = [];
    };
  }, [stage, skin, enabled]);

  return null;
}
