import { state } from "./state.js";
import { renderApp } from "./router.js";
import { loadSavedState } from "./data/storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const saved = loadSavedState();

  if (saved) {
    state.assessment = saved.assessment || state.assessment;
    state.activePlan = saved.activePlan || state.activePlan;
    state.activeSession = saved.activeSession || state.activeSession;
    state.lastSession = saved.lastSession || state.lastSession;
    state.history = saved.history || [];
  }

  renderApp();
});