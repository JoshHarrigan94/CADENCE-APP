export function renderWorkoutScreen(state) {
  const session = state.activeSession;

  return `
    <main class="screen workout-screen">

      <section class="workout-header">
        <p class="eyebrow">Active Session</p>
        <h1>${session.exercise}</h1>
      </section>

      <section class="tempo-instrument">

        <div class="tempo-dial">
          <span class="dial-label">Tempo</span>
          <strong>${session.tempo.join("-")}</strong>
        </div>

        <div class="rep-counter">
          <span>Reps</span>
          <strong>${session.completedReps}/${session.targetReps}</strong>
        </div>

      </section>

      <section class="phase-panel">
        <p class="eyebrow">Current Phase</p>
        <h2>Ready</h2>
        <p>
          The live tempo engine will be connected in a later pass.
        </p>
      </section>

      <section class="session-actions">
        <button class="primary-button">
          Start
        </button>

        <button class="secondary-button" data-route="summary">
          End Session
        </button>
      </section>

      <nav class="bottom-nav">
        <button data-route="home">Home</button>
        <button data-route="plan">Plan</button>
        <button data-route="history">History</button>
      </nav>

    </main>
  `;
}