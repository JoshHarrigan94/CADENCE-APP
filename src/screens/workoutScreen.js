import { createTempoEngine } from "../engine/tempoEngine.js";

let tempoEngine = null;
let unsubscribe = null;

export function renderWorkoutScreen(state) {
  const session = state.activeSession;

  return `
    <main class="screen workout-screen">

      <section class="workout-header">
        <p class="eyebrow">Active Session</p>
        <h1>${session.exercise}</h1>
      </section>

      <section class="tempo-instrument">

        <div class="tempo-dial" id="tempo-dial">
          <div>
            <span class="dial-label">Tempo</span>
            <strong id="tempo-count">${session.tempo.join("-")}</strong>
          </div>
        </div>

        <div class="rep-counter">
          <span>Reps</span>
          <strong id="rep-count">0/${session.targetReps}</strong>
        </div>

      </section>

      <section class="phase-panel">
        <p class="eyebrow" id="phase-status">Ready</p>
        <h2 id="phase-label">Ready</h2>
        <p id="phase-cue">
          Start when your hands are set and your body is braced.
        </p>
      </section>

      <section class="session-actions">
        <button class="primary-button" id="start-session-button">
          Start
        </button>

        <button class="secondary-button" id="reset-session-button">
          Reset
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

export function bindWorkoutScreen(state) {
  const session = state.activeSession;

  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }

  tempoEngine = createTempoEngine({
    tempo: session.tempo,
    targetReps: session.targetReps,
  });

  const startButton = document.querySelector("#start-session-button");
  const resetButton = document.querySelector("#reset-session-button");

  startButton?.addEventListener("click", () => {
    const snapshot = tempoEngine.getSnapshot();

    if (snapshot.status === "idle") {
      tempoEngine.start();
      return;
    }

    if (snapshot.status === "running") {
      tempoEngine.pause();
      return;
    }

    if (snapshot.status === "paused") {
      tempoEngine.resume();
    }
  });

  resetButton?.addEventListener("click", () => {
    tempoEngine.reset();
  });

  unsubscribe = tempoEngine.subscribe((snapshot) => {
    updateWorkoutUI(snapshot, state);
  });
}

function updateWorkoutUI(snapshot, state) {
  const tempoCount = document.querySelector("#tempo-count");
  const repCount = document.querySelector("#rep-count");
  const phaseStatus = document.querySelector("#phase-status");
  const phaseLabel = document.querySelector("#phase-label");
  const phaseCue = document.querySelector("#phase-cue");
  const startButton = document.querySelector("#start-session-button");
  const tempoDial = document.querySelector("#tempo-dial");

  state.activeSession.status = snapshot.status;
  state.activeSession.completedReps = snapshot.completedReps;

  if (tempoCount) {
    tempoCount.textContent =
      snapshot.status === "idle"
        ? snapshot.tempo.join("-")
        : snapshot.phaseRemaining;
  }

  if (repCount) {
    repCount.textContent =
      `${snapshot.completedReps}/${snapshot.targetReps}`;
  }

  if (phaseStatus) {
    phaseStatus.textContent = snapshot.status;
  }

  if (phaseLabel) {
    phaseLabel.textContent =
      snapshot.status === "complete"
        ? "Complete"
        : snapshot.phase.label;
  }

  if (phaseCue) {
    phaseCue.textContent =
      snapshot.status === "complete"
        ? "Session complete. Log the work."
        : snapshot.phase.cue;
  }

  if (startButton) {
    startButton.textContent = getStartButtonLabel(snapshot.status);
  }

  if (tempoDial) {
    tempoDial.style.setProperty(
      "--phase-progress",
      `${snapshot.progress * 360}deg`
    );
  }
}

function getStartButtonLabel(status) {
  if (status === "running") return "Pause";
  if (status === "paused") return "Resume";
  if (status === "complete") return "Done";
  return "Start";
}