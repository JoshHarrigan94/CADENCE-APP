export function analyseSession(session) {
  const completion =
    session.targetReps > 0
      ? session.completedReps / session.targetReps
      : 0;

  if (completion >= 1) {
    return {
      rating: "Green",
      decision: "Progress",
      message: "You completed the prescription. Add a small dose next time.",
      nextSession: progressSession(session),
    };
  }

  if (completion >= 0.75) {
    return {
      rating: "Amber",
      decision: "Repeat",
      message: "You were close. Repeat this prescription before increasing.",
      nextSession: repeatSession(session),
    };
  }

  return {
    rating: "Red",
    decision: "Regress",
    message: "The dose was too high today. Reduce the target and rebuild quality.",
    nextSession: regressSession(session),
  };
}

function progressSession(session) {
  return {
    ...session,
    status: "idle",
    completedReps: 0,
    targetReps: session.targetReps + 1,
  };
}

function repeatSession(session) {
  return {
    ...session,
    status: "idle",
    completedReps: 0,
  };
}

function regressSession(session) {
  return {
    ...session,
    status: "idle",
    completedReps: 0,
    targetReps: Math.max(3, session.targetReps - 2),
  };
}