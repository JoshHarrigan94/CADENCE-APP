export function renderAssessmentScreen() {
  return `
    <main class="screen">

      <section class="page-header">
        <p class="eyebrow">Assessment</p>
        <h1>Find your starting point.</h1>
        <p>
          This screen will later capture max reps, rep quality,
          tempo control, and readiness.
        </p>
      </section>

      <section class="placeholder-panel">
        <h2>Assessment module coming next.</h2>
        <p>
          For now, this is a placeholder so the app structure is stable.
        </p>

        <button class="primary-button" data-route="plan">
          Continue to Plan
        </button>
      </section>

      <nav class="bottom-nav">
        <button data-route="home">Home</button>
        <button data-route="plan">Plan</button>
        <button data-route="workout">Workout</button>
      </nav>

    </main>
  `;
}