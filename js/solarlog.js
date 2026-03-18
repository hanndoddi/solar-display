const API_ROOT = "https://solar-proxy.hanndoddi.workers.dev";

// Fetch solar data, update live display, log to backend, refresh table
async function fetchAndLog() {
  try {
    const res = await fetch(`${API_ROOT}/today?public=true`);
    const data = await res.json();

    const power = data.latest_power?.value ?? '--';
    const time  = data.latest_power?.time
      ? new Date(data.latest_power.time * 1000).toLocaleString('is-IS')
      : '';

    // Update live display
    document.getElementById('power').textContent = power;
    document.getElementById('time').textContent = time ? 'Uppfært: ' + time : '';

    // Log entry to backend
    const entry = {
      timestamp: Date.now(),
      power: data.latest_power?.value ?? '',
      energy: ''
    };
    await fetch(`${API_ROOT}/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    });

    // Refresh the history table + chart
    fetchLogHistory();

  } catch (err) {
    document.getElementById('power').textContent = '--';
    document.getElementById('time').textContent = 'Gat ekki sótt gögn';
    console.error('fetchAndLog error:', err);
  }
}

// Fetch log history from backend and render
function fetchLogHistory() {
  fetch(`${API_ROOT}/log`)
    .then(res => res.json())
    .then(renderLogTable)
    .catch(err => console.error('fetchLogHistory error:', err));
}

// Run on load, then every 5 minutes
document.addEventListener("DOMContentLoaded", function () {
  fetchAndLog();
  setInterval(fetchAndLog, 5 * 60 * 1000);
});
