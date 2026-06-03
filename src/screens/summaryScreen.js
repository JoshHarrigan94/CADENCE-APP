import { analyseSession } from "../engine/progressionEngine.js";
import { saveState } from "../data/storage.js";

export function renderSummaryScreen(state) {
  const session = state.lastSession || state.activeSession;
  const analysis = analyseSession(session);

  const completion =
    session.targetReps > 0
      ? Math.round((session.completedReps / session.targetReps) * 100)
      : 0;

  return `
    <main class="screen">

      <section class="page-header">
        <p class="eyebrow">Summary</p>
        <h1>Session logged.</h1>
        <p>
          Cadence has read the signal and prepared your next prescription.
        </p>
      </section>

      <section class="status-grid">

        <article class="status-card">
          <span>Completion</span>
          <strong>${completion}%</strong>
        </article>

        <article class="status-card">
          <span>Signal</span>
          <strong>${analysis.rating}</strong>
        </article>

        <article class="status-card">
          <span>Decision</span>
          <strong>${analysis.decision}</strong>
        </article>

        <article class="status-card">
          <span>Next Target</span>
          <strong>${analysis.nextSession.targetReps} reps</strong>
        </article>

      </section>

      <section class="phase-panel" data-rating="${analysis.rating.toLowerCase()}">
        <p class="eyebrow">Coach</p>
        <h2>${analysis.decision}</h2>
        <p>${analysis.message}</p>
      </section>

      <button class="primary-button" id="apply-progression-button">
        Apply Next Session
      </button>

      <button class="secondary-button" data-route="history">
        View History
      </button>

      <button class="secondary-button" data-route="workout">
        Train Again Without Changes
      </button>

    </main>
  `;
}

export function bindSummaryScreen(state) {
  const button = document.querySelector("#apply-progression-button");

  button?.addEventListener("click", () => {
    const session = state.lastSession || state.activeSession;
    const analysis = analyseSession(session);

    state.activeSession = {
      ...analysis.nextSession,
      id: undefined,
      date: undefined,
    };

    saveState(state);

    window.dispatchEvent(
      new CustomEvent("cadence:navigate", {
        detail: "workout",
      })
    );
  });
}