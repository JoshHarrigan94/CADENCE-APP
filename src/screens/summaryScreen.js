import { analyseSession } from "../engine/progressionEngine.js";
import { saveState } from "../data/storage.js";

export function renderSummaryScreen(state) {
  const session = state.lastSession || state.activeSession;
  const analysis = analyseSession(session);

  const completion =
    session.targetReps > 0
      ? Math.round((session.completedReps / session.targetReps) * 100)
      : 0;

  const totalTime = estimateTotalTime(session);
  const timeUnderTension = estimateTimeUnderTension(session);

  return `
    <main class="screen summary-screen">

      <header class="cadence-topbar">
        <span class="topbar-time">06:28</span>
        <strong>CADENCE</strong>
        <button class="topbar-done" data-route="home">Done</button>
      </header>

      <section class="summary-header">
        <h1>Session Complete</h1>
        <span></span>
      </section>

      <section class="summary-table">

        ${renderSummaryRow("Total Reps", session.completedReps)}
        ${renderSummaryRow("Total Time", totalTime)}
        ${renderSummaryRow("Time Under Tension", timeUnderTension)}
        ${renderSummaryRow("Avg Tempo", session.tempo.join("-"))}
        ${renderSummaryRow("Sets Completed", "1 / 1")}
        ${renderSummaryRow("Tempo Compliance", `${completion}%`)}
        ${renderSummaryRow("Difficulty", analysis.rating)}

      </section>

      <section class="performance-strip">
        <p>Performance</p>

        <div class="performance-bars">
          ${renderPerformanceBars(completion)}
        </div>
      </section>

      <section class="summary-actions">
        <button class="primary-button" id="apply-progression-button">
          Apply Next Session
        </button>

        <button class="secondary-button" data-route="history">
          View History
        </button>

        <button class="secondary-button" data-route="workout">
          Train Again
        </button>
      </section>

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

function renderSummaryRow(label, value) {
  return `
    <div class="summary-row">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function renderPerformanceBars(completion) {
  const activeBars = Math.round((completion / 100) * 24);

  return Array.from({ length: 28 })
    .map((_, index) => {
      const isActive = index < activeBars;

      return `
        <span class="${isActive ? "is-active" : ""}"></span>
      `;
    })
    .join("");
}

function estimateTotalTime(session) {
  const repSeconds = session.tempo.reduce(
    (total, seconds) => total + seconds,
    0
  );

  const totalSeconds = repSeconds * session.completedReps;

  return formatDuration(totalSeconds);
}

function estimateTimeUnderTension(session) {
  const tensionSeconds =
    session.tempo[0] + session.tempo[1] + session.tempo[2];

  const totalSeconds = tensionSeconds * session.completedReps;

  return formatDuration(totalSeconds);
}

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}