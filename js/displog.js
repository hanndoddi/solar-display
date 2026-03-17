function renderLogTable() {
  const log = JSON.parse(localStorage.getItem("solarlog")) || [];

  // Create basic HTML table
  let html = "<table border='1'><tr><th>Tími</th><th>Afl</th><th>Orka</th></tr>";
  for (const entry of log) {
    html += `<tr>
      <td>${entry.timestamp}</td>
      <td>${entry.power}</td>
      <td>${entry.energy}</td>
    </tr>`;
  }
  html += "</table>";

  // Put the table in a target div
  document.getElementById("logTable").innerHTML = html;
}

// Call renderLogTable on page load or after logging
document.addEventListener("DOMContentLoaded", renderLogTable);
