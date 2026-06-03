import { saveState } from "../data/storage.js";

const plans = [
  {
    id: "foundation",
    name: "Foundation Control",
    type: "Base",
    description: "Slow controlled reps for lower max-rep athletes.",
    targetReps: 5,
    tempo: [4, 1, 1, 1],
  },
  {
    id: "tempo-base",
    name: "Tempo Base",
    type: "Control",
    description: "The default Cadence prescription for clean strength.",
    targetReps: 8,
    tempo: [3, 1, 1, 1],
  },
  {
    id: "density",
    name: "Density Control",
    type: "Volume",
    description: "Build repeatable output without losing position.",
    targetReps: 12,
    tempo: [3, 1, 1, 0],
  },
  {
    id: "endurance",
    name: "Strength Endurance",
    type: "Capacity",
    description: "Higher-rep work with a faster but still honest tempo.",
    targetReps: 16,
    tempo: [2, 0, 1, 0],
  },
];

export function renderPlanScreen(state) {
  return `
    <main class="screen">

      <section class="page-header">
        <p class="eyebrow">Plan</p>
        <h1>Choose the prescription.</h1>
        <p>
          Current plan: <strong>${state.activePlan || "None selected"}</strong>
        </p>
      </section>

      <section class="plan-list">
        ${plans.map((plan) => renderPlanCard(plan, state)).join("")}
      </section>

      <nav class="bottom-nav">
        <button data-route="home">Home</button>
        <button data-route="assessment">Assess</button>
        <button data-route="history">History</button>
      </nav>

    </main>
  `;
}

function renderPlanCard(plan, state) {
  const isActive = state.activePlan === plan.name;

  return `
    <article class="plan-card ${isActive ? "is-active" : ""}">
      <p class="eyebrow">${plan.type}</p>
      <h2>${plan.name}</h2>
      <p>${plan.description}</p>

      <p class="plan-meta">
        ${plan.targetReps} reps · ${plan.tempo.join("-")} tempo
      </p>

      <button
        class="secondary-button"
        data-plan-id="${plan.id}"
      >
        ${isActive ? "Selected" : "Select"}
      </button>
    </article>
  `;
}

export function bindPlanScreen(state) {
  document.querySelectorAll("[data-plan-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const plan = plans.find((item) => item.id === button.dataset.planId);

      if (!plan) return;

      state.activePlan = plan.name;
      state.activeSession.exercise = "Push-Up";
      state.activeSession.targetReps = plan.targetReps;
      state.activeSession.completedReps = 0;
      state.activeSession.status = "idle";
      state.activeSession.tempo = [...plan.tempo];

      saveState(state);

      window.dispatchEvent(
        new CustomEvent("cadence:navigate", {
          detail: "workout",
        })
      );
    });
  });
}