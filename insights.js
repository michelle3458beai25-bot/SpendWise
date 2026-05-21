
const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
const money = parseInt(localStorage.getItem("money")) || 0;

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
const topCatName = topCat ? topCat[0] : "—";

const highDay = Object.entries(dateMap).sort((a, b) => b[1] - a[1])[0];
const highDayStr = highDay ? `${highDay[0]} (₹${parseInt(highDay[1]).toLocaleString("en-IN")})` : "—";

document.getElementById("statTotalSpent").textContent = "₹" + totalSpent.toLocaleString("en-IN");
document.getElementById("statTopCat").textContent = topCatName;
document.getElementById("statHighDay").textContent = highDayStr;

const dailyEl = document.getElementById("dailyExpenseList");
if (expenses.length === 0) {
  dailyEl.innerHTML = "<p style='color:#888'>No expenses yet.</p>";
} else {
  const todayStr = new Date().toLocaleDateString("en-IN");
  const todayExp = expenses.filter(e => e.date === todayStr);
  let total = 0;
  if (todayExp.length === 0) {
    dailyEl.innerHTML = "<p style='color:#888'>No expenses today.</p>";
  } else {
    dailyEl.innerHTML = todayExp.map(e => {
      total += parseInt(e.amount) || 0;
      return `<div class="expense-item"><span>${e.category}</span><span>₹${parseInt(e.amount).toLocaleString("en-IN")}</span></div>`;
    }).join("") + `<hr><div class="expense-total"><span>Total</span><span>₹${total.toLocaleString("en-IN")}</span></div>`;
  }
}

const insightsEl = document.getElementById("smartInsights");
const insights = [];
if (topCat) {
  const pct = Math.round((topCat[1] / totalSpent) * 100);
  insights.push(`🍔 ${topCat[0]} contributes ${pct}% of your total expenses.`);
}
if (money > 0 && totalSpent > 0) {
  const rem = money - totalSpent;
  if (rem > 0) insights.push(`💡 You can still save ₹${rem.toLocaleString("en-IN")} this month.`);
  else insights.push(`⚠️ You've overspent by ₹${Math.abs(rem).toLocaleString("en-IN")}!`);
}
if (expenses.length > 0) insights.push(`📋 You've logged ${expenses.length} expense(s) so far.`);

insightsEl.innerHTML = insights.map(i => `<div class="insight">${i}</div>`).join("") || "<div class='insight'>Add expenses via the chatbot to see insights.</div>";

const lineLabels = Object.keys(dateMap).slice(-7);
const lineData = lineLabels.map(d => dateMap[d]);

const lineCtx = document.getElementById("lineChart");
new Chart(lineCtx, {
  type: "line",
  data: {
    labels: lineLabels.length ? lineLabels : ["No data"],
    datasets: [{
      label: "Spending ₹",
      data: lineData.length ? lineData : [0],
      borderColor: "#6366f1",
      backgroundColor: "rgba(99,102,241,0.2)",
      tension: 0.4,
      fill: true
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } }
  }
});

const pieLabels = Object.keys(catMap);
const pieData = Object.values(catMap);
const pieColors = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#a855f7"];

const pieCtx = document.getElementById("pieChart");
new Chart(pieCtx, {
  type: "doughnut",
  data: {
    labels: pieLabels.length ? pieLabels : ["No data"],
    datasets: [{
      data: pieData.length ? pieData : [1],
      backgroundColor: pieColors
    }]
  },
  options: {
    cutout: "70%",
    plugins: { legend: { position: "bottom" } }
  }
});

const heatmapEl = document.getElementById("heatmapGrid");
if (heatmapEl) {
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
  heatmapEl.innerHTML = "";
  for (let i = 0; i < firstDay; i++) {
    heatmapEl.innerHTML += `<div class="empty"></div>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const amt = monthMap[d] || 0;
    let cls = "none";
    if (amt > 0) {
      const ratio = amt / maxVal;
      if (ratio < 0.33) cls = "low";
      else if (ratio < 0.66) cls = "medium";
      else cls = "high";
    }
    heatmapEl.innerHTML += `<div class="day ${cls}" title="₹${amt}">${d}</div>`;
  }

  
  const headEl = document.getElementById("heatmapHeading");
  if (headEl) headEl.textContent = `📅 ${now.toLocaleString("en-IN", { month: "long" })} ${year} – Spending Heatmap`;
}
