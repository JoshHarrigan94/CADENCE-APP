export function renderSummaryScreen(state) {
  return `
    <main class="screen">

      <section class="page-header">
        <p class="eyebrow">Summary</p>
        <h1>Session complete.</h1>
        <p>
          Later this will show rep quality, completion, tempo accuracy,
          and progression guidance.
        </p>
      </section>

      <section class="status-grid">

        <article class="status-card">
          <span>Exercise</span>
          <strong>${state.activeSession.exercise}</strong>
        </article>

        <article class="status-card">
          <span>Target</span>
          <strong>${state.activeSession.targetReps} reps</strong>
        </article>

        <article class="status-card">
          <span>Tempo</span>
          <strong>${state.activeSession.tempo.join("-")}</strong>
        </article>

      </section>

      <button class="primary-button" data-route="home">
        Return Home
      </button>

    </main>
  `;
}