import { describe, it, expect } from "vitest";
import {
  emptyDispatcherState,
  createInstance,
  enterInstance,
  leaveActiveInstance,
  closeInstance,
} from "./roomInstances";

describe("roomInstances dispatcher", () => {
  it("starts empty with no active instance", () => {
    const state = emptyDispatcherState();
    expect(state.instances).toEqual([]);
    expect(state.activeInstanceId).toBeNull();
  });

  it("creates a waiting instance without changing the active instance", () => {
    const state = createInstance(emptyDispatcherState(), "p1", "Jane D.");
    expect(state.instances).toEqual([{ id: "p1", patientLabel: "Jane D.", status: "waiting" }]);
    expect(state.activeInstanceId).toBeNull();
  });

  it("entering an instance marks it in-session and active", () => {
    let state = createInstance(emptyDispatcherState(), "p1", "Jane D.");
    state = enterInstance(state, "p1");
    expect(state.activeInstanceId).toBe("p1");
    expect(state.instances.find((i) => i.id === "p1")!.status).toBe("in-session");
  });

  it("entering a second instance auto-releases the first back to waiting", () => {
    let state = createInstance(emptyDispatcherState(), "p1", "Jane D.");
    state = createInstance(state, "p2", "Sam R.");
    state = enterInstance(state, "p1");
    state = enterInstance(state, "p2");
    expect(state.activeInstanceId).toBe("p2");
    expect(state.instances.find((i) => i.id === "p1")!.status).toBe("waiting");
    expect(state.instances.find((i) => i.id === "p2")!.status).toBe("in-session");
  });

  it("entering an unknown instance id throws", () => {
    expect(() => enterInstance(emptyDispatcherState(), "missing")).toThrow(
      "roomInstances: no instance with id \"missing\"",
    );
  });

  it("leaving the active instance clears active and returns it to waiting", () => {
    let state = createInstance(emptyDispatcherState(), "p1", "Jane D.");
    state = enterInstance(state, "p1");
    state = leaveActiveInstance(state);
    expect(state.activeInstanceId).toBeNull();
    expect(state.instances.find((i) => i.id === "p1")!.status).toBe("waiting");
  });

  it("leaving with no active instance is a no-op", () => {
    const state = createInstance(emptyDispatcherState(), "p1", "Jane D.");
    expect(leaveActiveInstance(state)).toEqual(state);
  });

  it("closing an instance removes it and clears active if it was active", () => {
    let state = createInstance(emptyDispatcherState(), "p1", "Jane D.");
    state = enterInstance(state, "p1");
    state = closeInstance(state, "p1");
    expect(state.instances).toEqual([]);
    expect(state.activeInstanceId).toBeNull();
  });
});
