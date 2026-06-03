export function renderHistoryScreen(state) {
  const historyMarkup = state.history.length
    ? state.history.map(renderHistoryItem).join("")
    : `
      <section class="placeholder-panel">
        <h2>No sessions yet.</h2>
        <p>
          Complete or end a session and it will appear here.
        </p>
      </section>
    `;

  return `
    <main class="screen">

      <section class="page-header">
        <p class="eyebrow">History</p>
        <h1>Your training log.</h1>
        <p>
          A local record of your Cadence sessions on this device.
        </p>
      </section>

      <section class="history-list">
        ${historyMarkup}
      </section>

      <nav class="bottom-nav">
        <button data-route="home">Home</button>
        <button data-route="plan">Plan</button>
        <button data-route="workout">Workout</button>
      </nav>

    </main>
  `;
}

function renderHistoryItem(session) {
  const date = new Date(session.date);

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });

  const formattedTime = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
    <article class="history-card">
      <div>
        <p class="eyebrow">${formattedDate} · ${formattedTime}</p>
        <h2>${session.exercise}</h2>
        <p>
          ${session.completedReps}/${session.targetReps} reps ·
          ${session.tempo.join("-")} tempo
        </p>
      </div>

      <strong>
        ${Math.round((session.completedReps / session.targetReps) * 100)}%
      </strong>
    </article>
  `;
}