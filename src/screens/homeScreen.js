export function renderHomeScreen(state) {
  return `
    <main class="screen home-screen">

      <section class="hero-panel">
        <p class="eyebrow">Cadence</p>

        <h1>Train the rep.</h1>

        <p class="lede">
          A tactical tempo coach for controlled push-up progressions,
          cleaner reps, and measurable strength development.
        </p>

        <div class="hero-actions">
          <button class="primary-button" data-route="assessment">
            Start Assessment
          </button>

          <button class="secondary-button" data-route="workout">
            Start Session
          </button>
        </div>
      </section>

      <section class="status-grid">

        <article class="status-card">
          <span>Current Plan</span>
          <strong>${state.activePlan || "Not selected"}</strong>
        </article>

        <article class="status-card">
          <span>Assessment</span>
          <strong>${state.assessment.completed ? "Complete" : "Not done"}</strong>
        </article>

        <article class="status-card">
          <span>Sessions</span>
          <strong>${state.history.length}</strong>
        </article>

      </section>

      <nav class="bottom-nav">
        <button data-route="home">Home</button>
        <button data-route="plan">Plan</button>
        <button data-route="history">History</button>
      </nav>

    </main>
  `;
}