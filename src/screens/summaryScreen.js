export function renderSummaryScreen(state) {
  const session = state.lastSession || state.activeSession;

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
          Cadence has saved the work. Review the signal, then return
          to training.
        </p>
      </section>

      <section class="status-grid">

        <article class="status-card">
          <span>Exercise</span>
          <strong>${session.exercise}</strong>
        </article>

        <article class="status-card">
          <span>Completion</span>
          <strong>${completion}%</strong>
        </article>

        <article class="status-card">
          <span>Reps</span>
          <strong>${session.completedReps}/${session.targetReps}</strong>
        </article>

        <article class="status-card">
          <span>Tempo</span>
          <strong>${session.tempo.join("-")}</strong>
        </article>

      </section>

      <button class="primary-button" data-route="workout">
        Train Again
      </button>

      <button class="secondary-button" data-route="history">
        View History
      </button>

    </main>
  `;
}