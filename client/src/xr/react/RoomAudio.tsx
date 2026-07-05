import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { RoomSkin, RoomStage } from "@/xr/engine/RoomSkin";
import { audioForStage, musicPlaylist } from "./audio-config";

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
  // With ONE track it loops seamlessly; with a PLAYLIST it rotates track-to-track and
  // wraps (founder QA 2026-07-05: a single song on infinite repeat = headache).
  useEffect(() => {
    const listener = listenerRef.current;
    const playlist = musicPlaylist(skin);
    if (!listener || !enabled || playlist.length === 0) return;
    void listener.context.resume?.();

    let alive = true;
    const music = new THREE.Audio(listener);
    musicRef.current = music;

    const playTrack = (i: number) => {
      new THREE.AudioLoader().load(playlist[i], (buf) => {
        if (!alive) return;
        music.setBuffer(buf);
        music.setLoop(playlist.length === 1); // solo track: gapless native loop
        music.setVolume(0.18); // warm featured bed, still under a spoken voice
        music.onEnded = () => {
          music.isPlaying = false; // three.js contract: mirror the default onEnded
          if (!alive || playlist.length === 1) return;
          playTrack((i + 1) % playlist.length); // rotate, wrap after the last track
        };
        if (!music.isPlaying) music.play();
      });
    };
    playTrack(0);

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
