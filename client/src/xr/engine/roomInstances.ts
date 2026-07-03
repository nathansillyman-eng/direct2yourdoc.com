// Room-instance dispatcher — pure logic (spec 2026-07-03-office-live-handoff-design.md §5).
// One room DEFINITION, instantiated fresh per patient session. The founder/doctor's live
// presence hops between instances via this dispatcher (a backstage control panel), never
// a physical in-world hallway/door — chosen as the simpler build. No rendering, no
// networking: this module only tracks which instance is "active" (who the operator is
// currently present in) and each instance's status.

export type RoomInstanceStatus = "waiting" | "in-session" | "closed";

export interface RoomInstanceRecord {
  id: string;
  patientLabel: string;
  status: RoomInstanceStatus;
}

export interface DispatcherState {
  instances: RoomInstanceRecord[];
  activeInstanceId: string | null;
}

export function emptyDispatcherState(): DispatcherState {
  return { instances: [], activeInstanceId: null };
}

function findOrThrow(state: DispatcherState, id: string): RoomInstanceRecord {
  const instance = state.instances.find((i) => i.id === id);
  if (!instance) throw new Error(`roomInstances: no instance with id "${id}"`);
  return instance;
}

export function createInstance(state: DispatcherState, id: string, patientLabel: string): DispatcherState {
  return {
    ...state,
    instances: [...state.instances, { id, patientLabel, status: "waiting" }],
  };
}

export function enterInstance(state: DispatcherState, id: string): DispatcherState {
  findOrThrow(state, id);
  const instances = state.instances.map((instance) => {
    if (instance.id === id) return { ...instance, status: "in-session" as const };
    if (instance.id === state.activeInstanceId && instance.status === "in-session") {
      return { ...instance, status: "waiting" as const };
    }
    return instance;
  });
  return { instances, activeInstanceId: id };
}

export function leaveActiveInstance(state: DispatcherState): DispatcherState {
  if (state.activeInstanceId === null) return state;
  const activeId = state.activeInstanceId;
  const instances = state.instances.map((instance) =>
    instance.id === activeId ? { ...instance, status: "waiting" as const } : instance,
  );
  return { instances, activeInstanceId: null };
}

export function closeInstance(state: DispatcherState, id: string): DispatcherState {
  findOrThrow(state, id);
  return {
    instances: state.instances.filter((i) => i.id !== id),
    activeInstanceId: state.activeInstanceId === id ? null : state.activeInstanceId,
  };
}
