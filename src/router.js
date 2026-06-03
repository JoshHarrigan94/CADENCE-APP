import { state } from "./state.js";

import { renderHomeScreen } from "./screens/homeScreen.js";
import { renderAssessmentScreen } from "./screens/assessmentScreen.js";
import { renderPlanScreen } from "./screens/planScreen.js";
import {
  renderWorkoutScreen,
  bindWorkoutScreen,
} from "./screens/workoutScreen.js";
import { renderSummaryScreen } from "./screens/summaryScreen.js";
import { renderHistoryScreen } from "./screens/historyScreen.js";

const routes = {
  home: renderHomeScreen,
  assessment: renderAssessmentScreen,
  plan: renderPlanScreen,
  workout: renderWorkoutScreen,
  summary: renderSummaryScreen,
  history: renderHistoryScreen,
};

export function navigate(screen) {
  if (!routes[screen]) {
    console.warn(`Screen "${screen}" does not exist.`);
    return;
  }

  state.currentScreen = screen;
  renderApp();
}

export function renderApp() {
  const app = document.querySelector("#app");

  if (!app) return;

  const screenRenderer = routes[state.currentScreen];

  app.innerHTML = screenRenderer(state);
  bindNavigation();
    window.addEventListener("cadence:navigate", (event) => {
    navigate(event.detail);
  }, { once: true });
  if (state.currentScreen === "workout") {
    bindWorkoutScreen(state);
  }
}

function bindNavigation() {
  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      const route = button.dataset.route;
      navigate(route);
    });
  });
}