export const state = {
  currentScreen: "home",

  user: {
    name: null,
    level: "unknown",
  },

  assessment: {
    completed: false,
    maxPushUps: null,
    qualityScore: null,
  },

  activePlan: null,

  activeSession: {
    status: "idle",
    exercise: "Push-Up",
    tempo: [3, 1, 1, 1],
    targetReps: 8,
    completedReps: 0,
  },

  history: [],
};