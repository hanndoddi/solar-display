function renderLogTable(log) {
  let html = "<table border='1'><tr><th>Tími</th><th>Afl</th><th>Orka</th></tr>";
  log.forEach(entry => {
    html += `<tr>
      <td>${new Date(entry.timestamp).toLocaleString('is-IS')}</td>
      <td>${entry.power}</td>
      <td>${entry.energy}</td>
    </tr>`;
  });
  html += "</table>";
  document.getElementById("logTable").innerHTML = html;
}
