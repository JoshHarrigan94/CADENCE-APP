import { saveState } from "../data/storage.js";

export function renderAssessmentScreen(state) {
  return `
    <main class="screen">

      <section class="page-header">
        <p class="eyebrow">Assessment</p>
        <h1>Find your starting point.</h1>
        <p>
          Enter your current clean max push-ups. Cadence will prescribe
          a starting tempo session.
        </p>
      </section>

      <section class="placeholder-panel">
        <label class="form-field">
          <span>Clean max reps</span>
          <input id="max-pushups-input" type="number" min="1" value="${state.assessment.maxPushUps || 10}" />
        </label>

        <button class="primary-button" id="save-assessment-button">
          Save Assessment
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

export function bindAssessmentScreen(state) {
  const button = document.querySelector("#save-assessment-button");
  const input = document.querySelector("#max-pushups-input");

  button?.addEventListener("click", () => {
    const maxPushUps = Number(input.value || 0);

    state.assessment.completed = true;
    state.assessment.maxPushUps = maxPushUps;
    state.assessment.qualityScore = "manual";

    const prescription = prescribeFromMax(maxPushUps);

    state.activePlan = prescription.planName;
    state.activeSession.targetReps = prescription.targetReps;
    state.activeSession.tempo = prescription.tempo;

    saveState(state);

    window.dispatchEvent(
      new CustomEvent("cadence:navigate", {
        detail: "plan",
      })
    );
  });
}

function prescribeFromMax(maxPushUps) {
  if (maxPushUps < 8) {
    return {
      planName: "Foundation Control",
      targetReps: 5,
      tempo: [4, 1, 1, 1],
    };
  }

  if (maxPushUps < 20) {
    return {
      planName: "Tempo Base",
      targetReps: 8,
      tempo: [3, 1, 1, 1],
    };
  }

  if (maxPushUps < 40) {
    return {
      planName: "Density Control",
      targetReps: 12,
      tempo: [3, 1, 1, 0],
    };
  }

  return {
    planName: "Strength Endurance",
    targetReps: 16,
    tempo: [2, 0, 1, 0],
  };
}