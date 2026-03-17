function renderLogTable() {
  const log = JSON.parse(localStorage.getItem("solarLog")) || [];
  let html = "<table border='1'><tr><th>Tími</th><th>Afl</th><th>Orka</th></tr>";
  log.forEach(entry => {
    html += `<tr>
      <td>${entry.timestamp}</td>
      <td>${entry.power}</td>
      <td>${entry.energy}</td>
    </tr>`;
  });
  html += "</table>";
  document.getElementById("logTable").innerHTML = html;
}

document.addEventListener("DOMContentLoaded", renderLogTable);
