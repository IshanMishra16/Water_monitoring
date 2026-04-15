// ==============================
// GLOBAL DATA
// ==============================
let data = JSON.parse(localStorage.getItem("data")) || [];
let chart = null;


// ==============================
// LOGIN
// ==============================
function login() {
  const u = document.getElementById("user").value;
  const p = document.getElementById("pass").value;

  if (u === "admin" && p === "admin123") {
    localStorage.setItem("loggedIn", "true");
    window.location = "dashboard.html";
  } else {
    document.getElementById("error").innerText = "Wrong credentials";
  }
}


// ==============================
// LOGOUT
// ==============================
function logout() {
  localStorage.removeItem("loggedIn");
  window.location = "index.html";
}


// ==============================
// NAVIGATION
// ==============================
function goAnalysis() {
  window.location = "analysis.html";
}

function goDashboard() {
  window.location = "dashboard.html";
}


// ==============================
// ADD DATA (WITH TIMESTAMP 🔥)
// ==============================
function addData() {
  const temp = Number(document.getElementById("temp").value);
  const ph   = Number(document.getElementById("ph").value);
  const tds  = Number(document.getElementById("tds").value);
  const turb = Number(document.getElementById("turb").value);

  if ([temp, ph, tds, turb].some(v => isNaN(v))) {
    alert("Please fill all fields correctly!");
    return;
  }

  // 🔥 TIMESTAMP
  const now = new Date();
  const timestamp = now.toLocaleString();

  data.push({ temp, ph, tds, turb, time: timestamp });

  localStorage.setItem("data", JSON.stringify(data));

  renderTable();

  ["temp","ph","tds","turb"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}


// ==============================
// TABLE RENDER (WITH TIME)
// ==============================
function renderTable() {
  const tbody = document.getElementById("tableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  data.forEach(d => {
    tbody.innerHTML += `
      <tr>
        <td>${d.time || "—"}</td>
        <td>${d.temp}</td>
        <td>${d.ph}</td>
        <td>${d.tds}</td>
        <td>${d.turb}</td>
      </tr>
    `;
  });
}


// ==============================
// ANALYSIS
// ==============================
function analyze() {
  const param = document.getElementById("param").value;

  const values = data
    .map(d => Number(d[param]))
    .filter(v => !isNaN(v));

  if (values.length === 0) return;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;

  document.getElementById("min").innerText = min.toFixed(2);
  document.getElementById("max").innerText = max.toFixed(2);
  document.getElementById("avg").innerText = avg.toFixed(2);

  drawChart(values);
}

function clearData() {
  const confirmDelete = confirm("Are you sure you want to delete all data?");

  if (!confirmDelete) return;

  data = []; // memory clear
  localStorage.removeItem("data"); // storage clear

  renderTable();

  alert("All data deleted!");
}
// ==============================
// CHART
// ==============================
function drawChart(values) {
  const ctx = document.getElementById("chart");
  if (!ctx) return;

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: values.map((_, i) => "Reading " + (i + 1)),
      datasets: [{
        label: "Values",
        data: values,
        tension: 0.3
      }]
    }
  });
}


// ==============================
// PAGE LOAD
// ==============================
window.onload = () => {
  const isLoginPage = document.getElementById("user");

  if (!isLoginPage) {
    const loggedIn = localStorage.getItem("loggedIn");

    if (!loggedIn) {
      window.location = "index.html";
      return;
    }
  }

  renderTable();

  if (document.getElementById("param")) {
    analyze();
  }
};