export function renderHomeScreen(state) {
  const sessionsThisWeek = state.history.length;
  const currentPlan = state.activePlan || "No Plan";
  const assessmentStatus = state.assessment.completed ? "Ready" : "Assess";

  return `
    <main class="screen home-screen">

      <header class="cadence-topbar">
        <span class="topbar-time">06:24</span>
        <strong>CADENCE</strong>
        <button class="topbar-menu" data-route="plan">☰</button>
      </header>

      <section class="home-hero">
        <p class="eyebrow">Training Instrument</p>
        <h1>Own the rep.</h1>
        <span></span>
      </section>

      <section class="home-command-panel">

        <div class="command-row">
          <span>Current Plan</span>
          <strong>${currentPlan}</strong>
        </div>

        <div class="command-row">
          <span>Assessment</span>
          <strong>${assessmentStatus}</strong>
        </div>

        <div class="command-row">
          <span>Sessions Logged</span>
          <strong>${sessionsThisWeek}</strong>
        </div>

      </section>

      <section class="home-actions">
        <button class="primary-button" data-route="workout">
          Start Session
        </button>

        <button class="secondary-button" data-route="assessment">
          Assessment
        </button>

        <button class="secondary-button" data-route="history">
          History
        </button>
      </section>

      <section class="home-strip">
        <span>Tempo ${state.activeSession.tempo.join("-")}</span>
        <span>${state.activeSession.targetReps} Reps</span>
      </section>

      <div class="page-dots">
        <span class="is-active"></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

    </main>
  `;
}