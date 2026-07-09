import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { direct2YourDocSkin } from "./direct2yourdoc";
import { direct2YourDocCopy } from "./direct2yourdoc.content";
import { arc } from "@/xr/engine/RoomSkin";

const HERE = path.dirname(fileURLToPath(import.meta.url));

const EXPECTED_LABELS = [
  "The Credential",
  "The Ledger",
  "The Second Chair",
  "The Desk",
  "The Hearth",
  "The Door",
  "The Window",
];

describe("direct2YourDocSkin", () => {
  it("carries the production consultation-room palette exactly", () => {
    expect(direct2YourDocSkin.id).toBe("direct2yourdoc");
    expect(direct2YourDocSkin.brand).toBe("Direct2YourDoc");
    expect(direct2YourDocSkin.palette.wall).toBe("#0d1c20");
    expect(direct2YourDocSkin.palette.floor).toBe("#081519");
    expect(direct2YourDocSkin.palette.trim).toBe("#f5c63e");
    expect(direct2YourDocSkin.palette.fire).toBe("#ff9d45");
  });

  it("exposes the 7 room hotspots in exact order", () => {
    expect(direct2YourDocSkin.commandFile.map((o) => o.label)).toEqual(EXPECTED_LABELS);
  });

  it("lays hotspots on the front wall at x = -1.2 + 0.4i, y = 1.4, z = -2.3", () => {
    direct2YourDocSkin.commandFile.forEach((o, i) => {
      expect(o.position[0]).toBeCloseTo(-1.2 + 0.4 * i);
      expect(o.position[1]).toBeCloseTo(1.4);
      expect(o.position[2]).toBeCloseTo(-2.3);
    });
  });

  it("regenerates the same layout via arc()", () => {
    const labels = direct2YourDocSkin.commandFile.map((o) => o.label);
    expect(direct2YourDocSkin.commandFile).toEqual(arc(labels));
  });

  it("serves the founder presence from /brand/, never /manus-storage/", () => {
    expect(direct2YourDocSkin.presenceImage).toBe("/brand/founder-nate-presence.png");
    expect(direct2YourDocSkin.presenceImage).not.toContain("/manus-storage/");
  });

  it("has the presence asset on disk (founder-forward: the plane is never empty)", () => {
    const asset = path.resolve(HERE, "../../../public/brand/founder-nate-presence.png");
    expect(fs.existsSync(asset)).toBe(true);
    // the full-resolution source it was optimized from also ships with the skin
    const source = path.resolve(HERE, "../../../public/brand/founder-nate-office.png");
    expect(fs.existsSync(source)).toBe(true);
  });

  it("is identity-truthful: Nate is founder/host, never the physician", () => {
    expect(direct2YourDocSkin.professional).toBe("Nate Sillyman — Founder");
    expect(direct2YourDocSkin.officeTitle).toBe("You're with the founder.");
    expect(direct2YourDocSkin.professional).not.toMatch(/\b(dr\.?|doctor|physician|md)\b/i);
    expect(direct2YourDocSkin.officeTitle).not.toMatch(/\b(dr\.?|doctor|physician|md)\b/i);
  });
});

describe("direct2YourDocCopy (content manifest)", () => {
  it("has a non-empty entry for every commandFile label", () => {
    for (const obj of direct2YourDocSkin.commandFile) {
      expect(direct2YourDocCopy[obj.label], `missing copy for ${obj.label}`).toBeTruthy();
      expect(direct2YourDocCopy[obj.label].trim().length).toBeGreaterThan(0);
    }
  });

  it("has no orphan keys that are not commandFile labels", () => {
    const labels = new Set(direct2YourDocSkin.commandFile.map((o) => o.label));
    for (const key of Object.keys(direct2YourDocCopy)) {
      expect(labels.has(key), `orphan copy key: ${key}`).toBe(true);
    }
  });

  it("The Credential keeps the truthful introduction line", () => {
    expect(direct2YourDocCopy["The Credential"]).toContain(
      "He isn't your physician — he's the one who makes the introduction.",
    );
  });

  it("The Window carries the honest exclusions verbatim", () => {
    const w = direct2YourDocCopy["The Window"];
    expect(w).toContain("not insurance");
    expect(w).toContain("does not replace your primary care physician");
    expect(w).toContain("no in-person exams");
  });
});
