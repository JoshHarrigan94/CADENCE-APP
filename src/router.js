import { state } from "./state.js";

import { renderHomeScreen } from "./screens/homeScreen.js";

import {
  renderAssessmentScreen,
  bindAssessmentScreen,
} from "./screens/assessmentScreen.js";

import {
  renderPlanScreen,
  bindPlanScreen,
} from "./screens/planScreen.js";

import {
  renderWorkoutScreen,
  bindWorkoutScreen,
  cleanupWorkoutScreen,
} from "./screens/workoutScreen.js";

import {
  renderSummaryScreen,
  bindSummaryScreen,
} from "./screens/summaryScreen.js";

import { renderHistoryScreen } from "./screens/historyScreen.js";

const routes = {
  home: renderHomeScreen,
  assessment: renderAssessmentScreen,
  plan: renderPlanScreen,
  workout: renderWorkoutScreen,
  summary: renderSummaryScreen,
  history: renderHistoryScreen,
};

let customNavigationBound = false;

export function navigate(screen) {
  if (!routes[screen]) {
    console.warn(`Screen "${screen}" does not exist.`);
    return;
  }

  if (state.currentScreen === "workout" && screen !== "workout") {
    cleanupWorkoutScreen();
  }

  state.currentScreen = screen;
  renderApp();
}

export function renderApp() {
  const app = document.querySelector("#app");

  if (!app) return;

  bindCustomNavigation();

  const screenRenderer = routes[state.currentScreen];

  app.innerHTML = screenRenderer(state);

  bindNavigation();
  bindCurrentScreen();
}

function bindNavigation() {
  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      navigate(button.dataset.route);
    });
  });
}

function bindCustomNavigation() {
  if (customNavigationBound) return;

  window.addEventListener("cadence:navigate", (event) => {
    navigate(event.detail);
  });

  customNavigationBound = true;
}

function bindCurrentScreen() {
  if (state.currentScreen === "workout") {
    bindWorkoutScreen(state);
  }

  if (state.currentScreen === "assessment") {
    bindAssessmentScreen(state);
  }

  if (state.currentScreen === "plan") {
    bindPlanScreen(state);
  }

  if (state.currentScreen === "summary") {
    bindSummaryScreen(state);
  }
}