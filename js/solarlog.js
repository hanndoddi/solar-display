const API_ROOT = "https://solar-proxy.hanndoddi.workers.dev";

// Fetch solar data from Cloudflare proxy
async function fetchSolarData() {
  const res = await fetch(`${API_ROOT}/today?public=true`);
  const data = await res.json();
  return {
    timestamp: Date.now(),
    power: data.latest_power?.value ?? '',
    energy: ''
  };
}

// Log solar data to backend and refresh the table
async function logSolarData() {
  const entry = await fetchSolarData();
  await fetch(`${API_ROOT}/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry)
  });
  fetchLogHistory();
}

// Fetch log history from backend
function fetchLogHistory() {
  fetch(`${API_ROOT}/log`)
    .then(res => res.json())
    .then(renderLogTable);
}

// Run on page load and every 5 minutes
document.addEventListener("DOMContentLoaded", function () {
  logSolarData();
  fetchLogHistory();
});
setInterval(logSolarData, 5 * 60 * 1000);
