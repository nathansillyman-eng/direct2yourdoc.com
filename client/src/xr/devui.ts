// IWER/DevUI emulator rig is strictly opt-in. Without ?devui=1 the XR store is
// created with emulate:false, which disables BOTH the localhost auto-injection
// and the permanent Meta+Alt+E hotkey listener that @pmndrs/xr otherwise
// registers on every hostname (production included).

/** True only when the page was loaded with ?devui=1. */
export function devuiRequested(
  search: string = typeof window === "undefined" ? "" : window.location.search,
): boolean {
  return new URLSearchParams(search).get("devui") === "1";
}
