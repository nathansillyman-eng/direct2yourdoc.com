import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { RoomSkin, RoomStage } from "@/xr/engine/RoomSkin";
import { audioForStage } from "./audio-config";

/** Ambient beds that play INSIDE the WebXR session. A THREE.AudioListener is attached
 *  to the (XR) camera so sound routes to the headset — a plain HTML <audio> element
 *  does NOT play through an immersive session on Quest. Must render inside the Canvas.
 *  Gesture-gated via `enabled`: the AudioContext starts suspended and is resumed on the
 *  first user gesture (desktop pointer / enter-VR). Low gain so nothing masks a voice. */
export function RoomAudio({ skin, stage, enabled }: { skin: RoomSkin; stage: RoomStage; enabled: boolean }) {
  const { camera } = useThree();
  const listenerRef = useRef<THREE.AudioListener | null>(null);
  const audioRef = useRef<THREE.Audio | null>(null);
  const musicRef = useRef<THREE.Audio | null>(null);

  // One listener on the active camera for the component's lifetime.
  useEffect(() => {
    const listener = new THREE.AudioListener();
    camera.add(listener);
    listenerRef.current = listener;
    return () => {
      camera.remove(listener);
      listenerRef.current = null;
    };
  }, [camera]);

  // Load + play the stage's bed once enabled (and swap it on stage change).
  useEffect(() => {
    const listener = listenerRef.current;
    if (!listener || !enabled) return;
    void listener.context.resume?.(); // suspended until a user gesture

    const { bed } = audioForStage(stage, skin);
    if (!bed) return;

    let alive = true;
    const audio = new THREE.Audio(listener);
    new THREE.AudioLoader().load(bed, (buf) => {
      if (!alive) return;
      audio.setBuffer(buf);
      audio.setLoop(true);
      audio.setVolume(0.14); // very low bed — a hush, never competes with a voice
      if (!audio.isPlaying) audio.play();
    });
    audioRef.current = audio;

    return () => {
      alive = false;
      try {
        audioRef.current?.stop();
      } catch {
        /* not yet playing */
      }
      audioRef.current = null;
    };
  }, [skin, stage, enabled]);

  // Continuous low music bed — plays across BOTH rooms and does NOT restart on stage
  // change (deps intentionally omit `stage`), so the jazz/lounge feel is unbroken.
  useEffect(() => {
    const listener = listenerRef.current;
    const url = skin.audio?.music;
    if (!listener || !enabled || !url) return;
    void listener.context.resume?.();

    let alive = true;
    const music = new THREE.Audio(listener);
    new THREE.AudioLoader().load(url, (buf) => {
      if (!alive) return;
      music.setBuffer(buf);
      music.setLoop(true);
      music.setVolume(0.18); // warm featured bed, still under a spoken voice
      if (!music.isPlaying) music.play();
    });
    musicRef.current = music;

    return () => {
      alive = false;
      try {
        musicRef.current?.stop();
      } catch {
        /* not yet playing */
      }
      musicRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return null;
}
