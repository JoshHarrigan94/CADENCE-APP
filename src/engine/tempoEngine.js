export function createTempoEngine(config = {}) {
  const tempo = config.tempo || [3, 1, 1, 1];
  const targetReps = config.targetReps || 8;

    const phases = [
    {
      id: "eccentric",
      label: "Lower",
      seconds: tempo[0],
      cue: "Slow descent. Ribs down. Elbows track clean.",
    },
    {
      id: "bottom",
      label: "Hold",
      seconds: tempo[1],
      cue: "Chest close. Brace. No collapse.",
    },
    {
      id: "concentric",
      label: "Drive",
      seconds: tempo[2],
      cue: "Press the floor away. Move as one piece.",
    },
    {
      id: "top",
      label: "Lock",
      seconds: tempo[3],
      cue: "Own the top. Scapula controlled. Breathe.",
    },
  ];

  let status = "idle";
  let currentRep = 1;
  let currentPhaseIndex = 0;
  let phaseRemaining = phases[0].seconds;
  let intervalId = null;

  const listeners = new Set();

  function getSnapshot() {
    const phase = phases[currentPhaseIndex];

    return {
      status,
      tempo,
      targetReps,
      currentRep,
      completedReps: currentRep - 1,
      currentPhaseIndex,
      phase,
      phaseRemaining,
      progress:
        phase.seconds > 0
          ? 1 - phaseRemaining / phase.seconds
          : 1,
      isComplete: status === "complete",
    };
  }

  function emit() {
    const snapshot = getSnapshot();
    listeners.forEach((listener) => listener(snapshot));
  }

  function start() {
    if (status === "running") return;

    status = "running";
    emit();

    intervalId = window.setInterval(tick, 1000);
  }

  function pause() {
    if (status !== "running") return;

    status = "paused";
    window.clearInterval(intervalId);
    intervalId = null;
    emit();
  }

  function resume() {
    if (status !== "paused") return;

    status = "running";
    emit();

    intervalId = window.setInterval(tick, 1000);
  }

  function reset() {
    window.clearInterval(intervalId);

    status = "idle";
    currentRep = 1;
    currentPhaseIndex = 0;
    phaseRemaining = phases[0].seconds;
    intervalId = null;

    emit();
  }

  function complete() {
    window.clearInterval(intervalId);

    status = "complete";
    intervalId = null;

    emit();
  }

  function tick() {
    if (status !== "running") return;

    phaseRemaining -= 1;

    if (phaseRemaining <= 0) {
      advancePhase();
    }

    emit();
  }

  function advancePhase() {
    const isLastPhase =
      currentPhaseIndex === phases.length - 1;

    if (!isLastPhase) {
      currentPhaseIndex += 1;
      phaseRemaining = phases[currentPhaseIndex].seconds;
      return;
    }

    const isLastRep = currentRep >= targetReps;

    if (isLastRep) {
      complete();
      return;
    }

    currentRep += 1;
    currentPhaseIndex = 0;
    phaseRemaining = phases[0].seconds;
  }

  function subscribe(listener) {
    listeners.add(listener);
    listener(getSnapshot());

    return () => {
      listeners.delete(listener);
    };
  }

  return {
    start,
    pause,
    resume,
    reset,
    complete,
    subscribe,
    getSnapshot,
  };
}