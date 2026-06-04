const STORAGE_KEY = "cadence-app-state-v1";

export function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        assessment: state.assessment,
        activePlan: state.activePlan,
        activeSession: state.activeSession,
        lastSession: state.lastSession,
        history: state.history,
      })
    );
  } catch {
    console.warn("Cadence could not save state.");
  }
}

export function createSessionRecord(session) {
  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    exercise: session.exercise,
    tempo: [...session.tempo],
    targetReps: session.targetReps,
    completedReps: session.completedReps,
    status: session.status,
  };
}