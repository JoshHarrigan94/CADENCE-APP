export function renderPlanScreen() {
  return `
    <main class="screen">

      <section class="page-header">
        <p class="eyebrow">Plan</p>
        <h1>Choose the prescription.</h1>
        <p>
          Later this will show adaptive push-up progressions based on
          assessment, capacity, and rep quality.
        </p>
      </section>

      <section class="plan-list">

        <article class="plan-card">
          <p class="eyebrow">Foundation</p>
          <h2>Tempo Base</h2>
          <p>Build clean reps with controlled eccentric timing.</p>
          <button class="secondary-button" data-route="workout">
            Select
          </button>
        </article>

        <article class="plan-card">
          <p class="eyebrow">Strength</p>
          <h2>Density Control</h2>
          <p>Progress total volume while protecting technical quality.</p>
          <button class="secondary-button" data-route="workout">
            Select
          </button>
        </article>

      </section>

      <nav class="bottom-nav">
        <button data-route="home">Home</button>
        <button data-route="assessment">Assess</button>
        <button data-route="history">History</button>
      </nav>

    </main>
  `;
}