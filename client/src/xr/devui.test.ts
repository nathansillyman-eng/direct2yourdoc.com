import { describe, it, expect } from "vitest";
import { devuiRequested } from "./devui";

describe("devuiRequested", () => {
  it("is ON only for exactly ?devui=1", () => {
    expect(devuiRequested("?devui=1")).toBe(true);
    expect(devuiRequested("?foo=bar&devui=1")).toBe(true);
  });

  it("is OFF by default and for anything that is not devui=1", () => {
    expect(devuiRequested("")).toBe(false);
    expect(devuiRequested("?")).toBe(false);
    expect(devuiRequested("?devui=0")).toBe(false);
    expect(devuiRequested("?devui=true")).toBe(false);
    expect(devuiRequested("?devui")).toBe(false);
    expect(devuiRequested("?foo=1")).toBe(false);
  });

  it("defaults to OFF when there is no window (node/SSR)", () => {
    expect(devuiRequested()).toBe(false);
  });
});
