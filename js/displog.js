let solarChart;
let solarChartDay;
let solarChartDay24;

function renderLogTable(log) {
  if (!Array.isArray(log)) return;

  const max = Math.max(...log.map(e => e.power || 0));
  document.getElementById("peak").textContent = `Top gildi: ${max} W`;

  const recent = log.slice(-10).reverse();

  let html = "<table><tr><th>Tími</th><th>Afl (W)</th><th>Orka</th></tr>";
  recent.forEach(entry => {
    html += `<tr>
      <td>${new Date(entry.timestamp).toLocaleString('is-IS')}</td>
      <td>${entry.power ?? ''}</td>
      <td>${entry.energy ? (entry.energy / 1000).toFixed(2) + ' kWh' : ''}</td>
    </tr>`;
  });
  html += "</table>";
  document.getElementById("logTable").innerHTML = html;

  renderChart(log);
}

function renderChart(log) {
  if (!Array.isArray(log)) return;

  const recent = log.slice(-20);

  const labels = recent.map(entry =>
    new Date(entry.timestamp).toLocaleTimeString('is-IS', {
      hour: '2-digit',
      minute: '2-digit'
    })
  );

  const values = recent.map(entry => entry.power ?? 0);

  const ctx = document.getElementById("solarChart").getContext("2d");

  if (solarChart) solarChart.destroy();

  solarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Afl (W)",
        data: values,
        backgroundColor: "rgba(46, 204, 113, 0.7)",
        borderColor: "rgba(46, 204, 113, 1)",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

// Renders both the trimmed (active hours) and full 24h day charts
// Called from the load() function in index.html
function renderDayChart(production, startTime, intervalSecs) {
  if (!Array.isArray(production) || production.length === 0) return;

  // Build labels for all 96 intervals
  const allLabels = production.map((_, i) => {
    const ts = (startTime + i * intervalSecs) * 1000;
    return new Date(ts).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit', hour12: false });  });

  // --- Chart 1: trimmed to active hours (first → last non-zero) ---
  const firstActive = production.findIndex(v => v > 0);
  const lastActive  = production.map((v, i) => v > 0 ? i : -1).filter(i => i >= 0).pop() ?? firstActive;

  const trimmedLabels = firstActive >= 0 ? allLabels.slice(firstActive, lastActive + 1) : allLabels;
  const trimmedValues = firstActive >= 0 ? production.slice(firstActive, lastActive + 1) : production;

  const ctxDay = document.getElementById("solarChartDay").getContext("2d");
  if (solarChartDay) solarChartDay.destroy();

  solarChartDay = new Chart(ctxDay, {
    type: "bar",
    data: {
      labels: trimmedLabels,
      datasets: [{
        label: "Framleiðsla (Wh)",
        data: trimmedValues,
        backgroundColor: "rgba(245, 166, 35, 0.7)",
        borderColor: "rgba(245, 166, 35, 1)",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, title: { display: true, text: 'Wh' } } }
    }
  });

  // --- Chart 2: full 24h ---
  const ctxDay24 = document.getElementById("solarChartDay24").getContext("2d");
  if (solarChartDay24) solarChartDay24.destroy();

  solarChartDay24 = new Chart(ctxDay24, {
    type: "bar",
    data: {
      labels: allLabels,
      datasets: [{
        label: "Framleiðsla (Wh)",
        data: production,
        backgroundColor: "rgba(245, 166, 35, 0.7)",
        borderColor: "rgba(245, 166, 35, 1)",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, title: { display: true, text: 'Wh' } } }
    }
  });
}
