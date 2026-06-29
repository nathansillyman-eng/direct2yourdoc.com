import { defineConfig } from "vitest/config";
import path from "node:path";

// Engine builders are pure (no WebGLRenderer, no DOM) — run them in node.
export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "client/src") },
  },
  test: {
    environment: "node",
    include: ["client/src/**/*.test.ts"],
  },
});
