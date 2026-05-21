let step = 1;
let expense = { amount: "", category: "" };

function sendMessage() {
  const input = document.getElementById("userInput");
  const chatArea = document.getElementById("chatArea");
  const userText = input.value.trim();
  if (userText === "") return;

  chatArea.innerHTML += `<div class="user">${userText}</div>`;
  input.value = "";

  if (step === 1) {
    const amt = parseInt(userText);
    if (isNaN(amt) || amt <= 0) {
      chatArea.innerHTML += `<div class="bot">Please enter a valid amount (numbers only).</div>`;
    } else {
      expense.amount = amt;
      chatArea.innerHTML += `<div class="bot">Which category? (Food, Travel, Shopping, Entertainment, Education, Health, Other)</div>`;
      step = 2;
    }
  } else if (step === 2) {
    expense.category = userText;
    chatArea.innerHTML += `<div class="bot success">✅ ₹${expense.amount} added under ${expense.category}!</div>`;
    saveExpense(expense);
    updateDashboard();
    expense = { amount: "", category: "" };
    step = 1;
    setTimeout(() => {
      chatArea.innerHTML += `<div class="bot">Want to add another? Enter the amount:</div>`;
      chatArea.scrollTop = chatArea.scrollHeight;
    }, 600);
  }

  chatArea.scrollTop = chatArea.scrollHeight;
}

function saveExpense(exp) {
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses.push({ amount: exp.amount, category: exp.category, date: new Date().toLocaleDateString("en-IN") });
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function updateDashboard() {
  const money = parseInt(localStorage.getItem("money")) || 0;
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  let totalSpent = 0;
  expenses.forEach(e => totalSpent += parseInt(e.amount) || 0);
  const remaining = money - totalSpent;

  document.getElementById("totalSpent").textContent = "₹" + totalSpent.toLocaleString("en-IN");
  document.getElementById("remaining").textContent = "₹" + remaining.toLocaleString("en-IN");

  const alertEl = document.getElementById("smartAlert");
  const pct = money > 0 ? (totalSpent / money) * 100 : 0;
  if (pct >= 80) { alertEl.textContent = "⚠️ You've crossed " + Math.round(pct) + "% of your budget!"; alertEl.style.color = "#ef4444"; }
  else if (pct >= 50) { alertEl.textContent = "🔔 You've used " + Math.round(pct) + "% of your budget."; alertEl.style.color = "#f59e0b"; }
  else { alertEl.textContent = "✅ You're on track! " + Math.round(pct) + "% of budget used."; alertEl.style.color = "#22c55e"; }

  const weekly = expenses.slice(-7).reduce((s, e) => s + (parseInt(e.amount) || 0), 0);
  const weekEl = document.getElementById("weeklySpend");
  if (weekEl) weekEl.textContent = "₹" + weekly.toLocaleString("en-IN");

  const recentEl = document.getElementById("recentExpenses");
  if (recentEl) {
    const recent = expenses.slice(-5).reverse();
    recentEl.innerHTML = recent.length === 0 ? "<p style='color:#888'>No expenses yet.</p>" :
      recent.map(e => `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;">
        <span>${e.category}</span><span style="font-weight:600">₹${parseInt(e.amount).toLocaleString("en-IN")}</span>
        <span style="color:#888;font-size:12px">${e.date}</span></div>`).join("");
  }

  const badgeEl = document.getElementById("badge");
  if (badgeEl) {
    if (pct < 30) badgeEl.textContent = "💎 Super Saver";
    else if (pct < 60) badgeEl.textContent = "⭐ Smart Saver";
    else if (pct < 80) badgeEl.textContent = "👍 Budget Tracker";
    else badgeEl.textContent = "⚠️ Overspending";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("userInput");
  if (input) input.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });
  updateDashboard();
});
