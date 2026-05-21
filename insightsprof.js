const expenses = JSON.parse(localStorage.getItem("proExpenses")) || [];
const salary = parseInt(localStorage.getItem("salary")) || 0;

let totalSpent = 0;
const catMap = {};
const dateMap = {};

expenses.forEach(e => {
  const amt = parseInt(e.amount) || 0;
  totalSpent += amt;
  catMap[e.category] = (catMap[e.category] || 0) + amt;
  dateMap[e.date] = (dateMap[e.date] || 0) + amt;
});

const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];
const highDay = Object.entries(dateMap).sort((a, b) => b[1] - a[1])[0];

document.getElementById("statTotalIncome").textContent = "₹" + salary.toLocaleString("en-IN");
document.getElementById("statTopExpense").textContent = topCat ? topCat[0] : "—";
document.getElementById("statHighDay").textContent = highDay ? `${highDay[0]} (₹${parseInt(highDay[1]).toLocaleString("en-IN")})` : "—";

const dailyEl = document.getElementById("dailyExpenseList");
const todayStr = new Date().toLocaleDateString("en-IN");
const todayExp = expenses.filter(e => e.date === todayStr);
let todayTotal = 0;
if (todayExp.length === 0) {
  dailyEl.innerHTML = "<p style='color:#888'>No expenses today.</p>";
} else {
  dailyEl.innerHTML = todayExp.map(e => {
    todayTotal += parseInt(e.amount) || 0;
    return `<div class="expense-row"><span>${e.category}</span><span>₹${parseInt(e.amount).toLocaleString("en-IN")}</span></div>`;
  }).join("") + `<hr><div class="expense-row"><b>Total</b><b>₹${todayTotal.toLocaleString("en-IN")}</b></div>`;
}

const lineLabels = Object.keys(dateMap).slice(-7);
const lineData = lineLabels.map(d => dateMap[d]);

new Chart(document.getElementById("lineChart"), {
  type: "line",
  data: {
    labels: lineLabels.length ? lineLabels : ["No data"],
    datasets: [{
      data: lineData.length ? lineData : [0],
      borderColor: "#6c63ff",
      backgroundColor: "rgba(108,99,255,0.2)",
      fill: true,
      tension: 0.4
    }]
  },
  options: { plugins: { legend: { display: false } } }
});

const pieLabels = Object.keys(catMap);
const pieData = Object.values(catMap);
const colors = ["#6c63ff", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"];

new Chart(document.getElementById("pieChart"), {
  type: "doughnut",
  data: {
    labels: pieLabels.length ? pieLabels : ["No data"],
    datasets: [{ data: pieData.length ? pieData : [1], backgroundColor: colors }]
  }
});

const heatmap = document.getElementById("heatmap");
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();
const daysInMonth = new Date(year, month + 1, 0).getDate();
const monthMap = {};
expenses.forEach(e => {
  const d = new Date(e.date.split("/").reverse().join("-"));
  if (d.getMonth() === month && d.getFullYear() === year) {
    const day = d.getDate();
    monthMap[day] = (monthMap[day] || 0) + (parseInt(e.amount) || 0);
  }
});
const maxVal = Math.max(...Object.values(monthMap), 1);
const firstDay = new Date(year, month, 1).getDay();
heatmap.innerHTML = "";
for (let i = 0; i < firstDay; i++) heatmap.innerHTML += `<div></div>`;
for (let d = 1; d <= daysInMonth; d++) {
  const amt = monthMap[d] || 0;
  let cls = "light";
  const ratio = amt / maxVal;
  if (ratio > 0.66) cls = "dark";
  else if (ratio > 0.33) cls = "medium";
  const day = document.createElement("div");
  day.classList.add("day", cls);
  day.textContent = d;
  day.title = "₹" + amt;
  heatmap.appendChild(day);
}
