import { createTempoEngine } from "../engine/tempoEngine.js";
import {
  unlockAudio,
  playStartCue,
  playPauseCue,
  playCompleteCue,
  playPhaseTick,
} from "../engine/audioEngine.js";
import {
  saveState,
  createSessionRecord,
} from "../data/storage.js";
let tempoEngine = null;
let unsubscribe = null;

let animationFrameId = null;
let displayedProgress = 0;
let targetProgress = 0;

export function renderWorkoutScreen(state) {
  const session = state.activeSession;

  return `
    <main class="screen workout-screen">

      <header class="cadence-topbar">
        <span class="topbar-time">06:24</span>
        <strong>CADENCE</strong>
        <button class="topbar-menu" data-route="home">☰</button>
      </header>

      <section class="instrument-stage">

        <div class="tempo-dial" id="tempo-dial">
          <div class="dial-needle" id="dial-needle"></div>

          <div class="dial-core">
            <span class="dial-label" id="phase-mini-label">Tempo</span>
            <strong id="tempo-count">${session.tempo.join("-")}</strong>
            <small>Seconds</small>
          </div>
        </div>

      </section>

      <section class="session-readout">

        <div class="readout-cell">
          <span>Rep</span>
          <strong id="rep-count">0/${session.targetReps}</strong>
        </div>

        <div class="readout-pulse">⌁</div>

        <div class="readout-cell">
          <span>Set</span>
          <strong>01</strong>
        </div>

      </section>

      <section class="phase-panel" id="phase-panel">
        <p class="eyebrow" id="phase-status">Ready</p>
        <h2 id="phase-label">Set your position.</h2>
        <p id="phase-cue">
          Hands planted. Body braced. One clean line.
        </p>

        <div class="rep-progress-track">
          <div class="rep-progress-fill" id="rep-progress-fill"></div>
        </div>
      </section>

      <section class="session-strip">
        <span>Tempo ${session.tempo.join("-")}</span>
        <span>Rest 90s</span>
      </section>

      <section class="session-actions">
        <button class="primary-button" id="start-session-button">
          Start
        </button>

        <button class="secondary-button" id="reset-session-button">
          Reset
        </button>

        <button class="secondary-button" id="end-session-button">
          End
        </button>
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

export function bindWorkoutScreen(state) {
  let lastPhaseId = null;
let lastStatus = null;
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
    const endButton = document.querySelector("#end-session-button");
    startButton?.addEventListener("click", async () => {
    await unlockAudio();

    const snapshot = tempoEngine.getSnapshot();

    if (snapshot.status === "idle") {
      playStartCue();
      tempoEngine.start();
      return;
    }

    if (snapshot.status === "running") {
      playPauseCue();
      tempoEngine.pause();
      return;
    }

    if (snapshot.status === "paused") {
      playStartCue();
      tempoEngine.resume();
      return;
    }

    if (snapshot.status === "complete") {
      tempoEngine.reset();
    }
  });

  resetButton?.addEventListener("click", () => {
    tempoEngine.reset();
  });

    unsubscribe = tempoEngine.subscribe((snapshot) => {
    updateWorkoutUI(snapshot, state);

    if (
      snapshot.status === "running" &&
      snapshot.phase.id !== lastPhaseId
    ) {
      playPhaseTick(snapshot.phase.id);
    }

    if (
      snapshot.status === "complete" &&
      lastStatus !== "complete"
    ) {
      playCompleteCue();
    }

    lastPhaseId = snapshot.phase.id;
    lastStatus = snapshot.status;
  });
  
    endButton?.addEventListener("click", () => {
  const snapshot = tempoEngine.getSnapshot();

  const hasStarted =
    snapshot.status !== "idle" ||
    snapshot.completedReps > 0;

  if (!hasStarted) {
    window.dispatchEvent(
      new CustomEvent("cadence:navigate", {
        detail: "home",
      })
    );

    return;
  }

  state.activeSession.status = snapshot.status;
  state.activeSession.completedReps = snapshot.completedReps;

  const record = createSessionRecord(state.activeSession);

  const alreadySaved =
    state.lastSession &&
    state.lastSession.exercise === record.exercise &&
    state.lastSession.completedReps === record.completedReps &&
    state.lastSession.targetReps === record.targetReps &&
    state.lastSession.tempo.join("-") === record.tempo.join("-");

  if (!alreadySaved) {
    state.history.unshift(record);
    state.lastSession = record;
    saveState(state);
  }

  window.dispatchEvent(
    new CustomEvent("cadence:navigate", {
      detail: "summary",
    })
  );
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
  const dialNeedle = document.querySelector("#dial-needle");
  const phasePanel = document.querySelector("#phase-panel");
  const repProgressFill = document.querySelector("#rep-progress-fill");
  const phaseMiniLabel = document.querySelector("#phase-mini-label");
  const repMiniLabel = document.querySelector("#rep-mini-label");

  state.activeSession.status = snapshot.status;
  state.activeSession.completedReps = snapshot.completedReps;

  const repProgress =
    snapshot.targetReps > 0
      ? snapshot.completedReps / snapshot.targetReps
      : 0;

  const phaseDegrees = Math.max(
    0,
    Math.min(360, snapshot.progress * 360)
  );

  if (tempoCount) {
    tempoCount.textContent =
      snapshot.status === "idle"
        ? snapshot.tempo.join("-")
        : snapshot.status === "complete"
          ? "✓"
          : snapshot.phaseRemaining;
  }

  if (repCount) {
    repCount.textContent =
      `${snapshot.completedReps}/${snapshot.targetReps}`;
  }

  if (phaseStatus) {
    phaseStatus.textContent = formatStatus(snapshot.status);
  }

  if (phaseLabel) {
    phaseLabel.textContent = getPhaseLabel(snapshot);
  }

  if (phaseCue) {
    phaseCue.textContent = getPhaseCue(snapshot);
  }

  if (startButton) {
    startButton.textContent = getStartButtonLabel(snapshot.status);
  }

    if (tempoDial) {
    tempoDial.dataset.phase = snapshot.phase.id;
    tempoDial.dataset.status = snapshot.status;

    targetProgress = phaseDegrees;

    if (!animationFrameId) {
      animateDialProgress();
    }
  }

  if (phasePanel) {
    phasePanel.dataset.phase = snapshot.phase.id;
    phasePanel.dataset.status = snapshot.status;
  }

  if (repProgressFill) {
    repProgressFill.style.transform =
      `scaleX(${repProgress})`;
  }

  if (phaseMiniLabel) {
    phaseMiniLabel.textContent =
      snapshot.status === "idle"
        ? "Tempo"
        : snapshot.status === "complete"
          ? "Complete"
          : snapshot.phase.label;
  }

  if (repMiniLabel) {
    repMiniLabel.textContent =
      snapshot.status === "complete"
        ? "Session done"
        : `Rep ${snapshot.currentRep}`;
  }
}

function animateDialProgress() {
  const tempoDial = document.querySelector("#tempo-dial");
  const dialNeedle = document.querySelector("#dial-needle");

  const difference = targetProgress - displayedProgress;

  displayedProgress += difference * 0.14;

  if (Math.abs(difference) < 0.4) {
    displayedProgress = targetProgress;
  }

  if (tempoDial) {
    tempoDial.style.setProperty(
      "--phase-progress",
      `${displayedProgress}deg`
    );
  }

  if (dialNeedle) {
    dialNeedle.style.transform =
      `translateX(-50%) rotate(${displayedProgress}deg)`;
  }

  if (Math.abs(targetProgress - displayedProgress) > 0.4) {
    animationFrameId = requestAnimationFrame(animateDialProgress);
  } else {
    animationFrameId = null;
  }
}

function getPhaseLabel(snapshot) {
  if (snapshot.status === "idle") return "Set your position.";
  if (snapshot.status === "paused") return "Paused.";
  if (snapshot.status === "complete") return "Session complete.";

  return snapshot.phase.label;
}

function getPhaseCue(snapshot) {
  if (snapshot.status === "idle") {
    return "Hands planted. Body braced. One clean line.";
  }

  if (snapshot.status === "paused") {
    return "Hold the session. Resume when ready.";
  }

  if (snapshot.status === "complete") {
    return "Good work. Save the signal and review the session.";
  }

  return snapshot.phase.cue;
}

function getStartButtonLabel(status) {
  if (status === "running") return "Pause";
  if (status === "paused") return "Resume";
  if (status === "complete") return "Reset";
  return "Start";
}

function formatStatus(status) {
  if (status === "idle") return "Ready";
  if (status === "running") return "Working";
  if (status === "paused") return "Paused";
  if (status === "complete") return "Complete";
  return status;
}

export function cleanupWorkoutScreen() {
  if (tempoEngine) {
    tempoEngine.pause();
  }

  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  tempoEngine = null;
  displayedProgress = 0;
  targetProgress = 0;
}