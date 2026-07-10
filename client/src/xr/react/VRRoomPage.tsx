import { useEffect, useState } from "react";
import { SealedRoomCanvas, xrStore } from "./SealedRoomCanvas";
import { direct2YourDocSkin } from "@/xr/skins/direct2yourdoc";
import { direct2YourDocCopy } from "@/xr/skins/direct2yourdoc.content";
import { devuiRequested } from "@/xr/devui";

type XRSupport = "checking" | "supported" | "unsupported";

export default function VRRoomPage() {
  const [support, setSupport] = useState<XRSupport>("checking");

  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    // Re-read navigator.xr on every attempt: with ?devui=1 the IWER emulator
    // replaces it asynchronously after mount, so a one-shot probe would race it.
    const probe = async () => {
      let ok = false;
      try {
        ok = (await (navigator as any).xr?.isSessionSupported?.("immersive-vr")) === true;
      } catch {
        ok = false;
      }
      if (cancelled) return;
      if (ok) return setSupport("supported");
      if (devuiRequested() && tries++ < 15) return void window.setTimeout(probe, 400);
      setSupport("unsupported");
    };
    probe();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#081519" }}>
      <SealedRoomCanvas
        skin={direct2YourDocSkin}
        xr={support === "supported"}
        content={direct2YourDocCopy}
      />

      <div style={{ position: "absolute", top: 16, left: 16, right: 16, display: "flex", gap: 12, alignItems: "center" }}>
        {support === "supported" && (
          <button
            onClick={() => xrStore.enterVR()}
            style={{ padding: "12px 20px", borderRadius: 9999, border: "1px solid #c9a24b", background: "#0f2a33", color: "#f4e9c8", fontWeight: 600, cursor: "pointer" }}
          >
            Enter the room (VR)
          </button>
        )}
        {support === "unsupported" && (
          <div style={{ padding: "10px 16px", borderRadius: 12, background: "rgba(0,0,0,0.5)", color: "#f4e9c8", maxWidth: 420 }}>
            VR isn’t available on this device. You’re in the desktop walkthrough — drag to look
            around, <strong>WASD</strong> to walk, click the glowing gold plaques.
            Open this page in the <strong>Meta Quest browser</strong> or <strong>Android Chrome</strong> to step inside.
          </div>
        )}
      </div>
    </div>
  );
}
