export function renderHistoryScreen(state) {
  return `
    <main class="screen">

      <section class="page-header">
        <p class="eyebrow">History</p>
        <h1>Your training log.</h1>
        <p>
          Sessions will appear here once storage is added.
        </p>
      </section>

      <section class="placeholder-panel">
        <h2>${state.history.length} sessions logged</h2>
        <p>No saved sessions yet.</p>
      </section>

      <nav class="bottom-nav">
        <button data-route="home">Home</button>
        <button data-route="plan">Plan</button>
        <button data-route="workout">Workout</button>
      </nav>

    </main>
  `;
}