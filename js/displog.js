let solarChart;

function renderLogTable(log) {
  if (!Array.isArray(log)) return;

  const max = Math.max(...log.map(e => e.power || 0));
  document.getElementById("peak").textContent = `Top gildi: ${max} W`;

  const recent = log.slice(-10).reverse();

  let html = "<table><tr><th>Tími</th><th>Afl</th><th>Orka</th></tr>";
  recent.forEach(entry => {
    html += `<tr>
      <td>${new Date(entry.timestamp).toLocaleString('is-IS')}</td>
      <td>${entry.power ?? ""}</td>
      <td>${entry.energy ?? ""}</td>
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

  if (solarChart) {
    solarChart.destroy();
  }

  solarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Afl (W)",
        data: values
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
