function loadDashboard() {
  const fname = localStorage.getItem("fname") || "Student";
  const money = parseInt(localStorage.getItem("money")) || 0;
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  let totalSpent = 0;
  expenses.forEach(e => totalSpent += parseInt(e.amount) || 0);
  const remaining = money - totalSpent;

  document.getElementById("welcomeName").textContent = fname;
  document.getElementById("pocketMoney").textContent = "₹" + money.toLocaleString("en-IN");
  document.getElementById("totalSpent").textContent = "₹" + totalSpent.toLocaleString("en-IN");
  document.getElementById("remaining").textContent = "₹" + remaining.toLocaleString("en-IN");

  
  const alertEl = document.getElementById("smartAlert");
  const pct = money > 0 ? (totalSpent / money) * 100 : 0;
  if (pct >= 80) {
    alertEl.textContent = "⚠️ You've crossed " + Math.round(pct) + "% of your budget!";
    alertEl.style.color = "#ef4444";
  } else if (pct >= 50) {
    alertEl.textContent = "🔔 You've used " + Math.round(pct) + "% of your budget.";
    alertEl.style.color = "#f59e0b";
  } else {
    alertEl.textContent = "✅ You're on track! " + Math.round(pct) + "% of budget used.";
    alertEl.style.color = "#22c55e";
  }

  
  const weekly = expenses.slice(-7).reduce((s, e) => s + (parseInt(e.amount) || 0), 0);
  document.getElementById("weeklySpend").textContent = "₹" + weekly.toLocaleString("en-IN");
}

loadDashboard();
