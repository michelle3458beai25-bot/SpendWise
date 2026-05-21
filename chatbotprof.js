let stepProf = 1;
let expenseProf = { amount: "", category: "" };

function sendMessageProf() {
  const input = document.getElementById("proUserInput");
  const chatArea = document.getElementById("proChatArea");
  const userText = input.value.trim();
  if (userText === "") return;

  chatArea.innerHTML += `<div class="user">${userText}</div>`;
  input.value = "";

  if (stepProf === 1) {
    const amt = parseInt(userText);
    if (isNaN(amt) || amt <= 0) {
      chatArea.innerHTML += `<div class="bot">Please enter a valid amount (numbers only).</div>`;
    } else {
      expenseProf.amount = amt;
      chatArea.innerHTML += `<div class="bot">Which category? (Food, Travel, Bills, Shopping, Entertainment, Health, Other)</div>`;
      stepProf = 2;
    }
  } else if (stepProf === 2) {
    expenseProf.category = userText;
    chatArea.innerHTML += `<div class="bot success">✅ ₹${expenseProf.amount} added under ${expenseProf.category}!</div>`;
    saveExpenseProf(expenseProf);
    updateProfDashboard();
    expenseProf = { amount: "", category: "" };
    stepProf = 1;
    setTimeout(() => {
      chatArea.innerHTML += `<div class="bot">Want to add another? Enter the amount:</div>`;
      chatArea.scrollTop = chatArea.scrollHeight;
    }, 600);
  }

  chatArea.scrollTop = chatArea.scrollHeight;
}

function saveExpenseProf(exp) {
  let expenses = JSON.parse(localStorage.getItem("proExpenses")) || [];
  expenses.push({ amount: exp.amount, category: exp.category, date: new Date().toLocaleDateString("en-IN") });
  localStorage.setItem("proExpenses", JSON.stringify(expenses));
}

function updateProfDashboard() {
  const salary = parseInt(localStorage.getItem("salary")) || 0;
  const expenses = JSON.parse(localStorage.getItem("proExpenses")) || [];
  let totalSpent = 0;
  expenses.forEach(e => totalSpent += parseInt(e.amount) || 0);
  const remaining = salary - totalSpent;

  const salaryEl = document.getElementById("monthlySalary");
  const spentEl = document.getElementById("totalSpent");
  const remEl = document.getElementById("remaining");
  if (salaryEl) salaryEl.textContent = "₹" + salary.toLocaleString("en-IN");
  if (spentEl) spentEl.textContent = "₹" + totalSpent.toLocaleString("en-IN");
  if (remEl) remEl.textContent = "₹" + remaining.toLocaleString("en-IN");

  const alertEl = document.getElementById("smartAlert");
  const pct = salary > 0 ? (totalSpent / salary) * 100 : 0;
  if (alertEl) {
    if (pct >= 80) { alertEl.textContent = "⚠️ You've crossed " + Math.round(pct) + "% of your monthly salary!"; alertEl.style.color = "#ef4444"; }
    else if (pct >= 50) { alertEl.textContent = "🔔 You've used " + Math.round(pct) + "% of your salary."; alertEl.style.color = "#f59e0b"; }
    else { alertEl.textContent = "✅ On track! " + Math.round(pct) + "% of salary spent."; alertEl.style.color = "#22c55e"; }
  }

  const weekly = expenses.slice(-7).reduce((s, e) => s + (parseInt(e.amount) || 0), 0);
  const weekEl = document.getElementById("weeklySpend");
  if (weekEl) weekEl.textContent = "₹" + weekly.toLocaleString("en-IN");

  const recentEl = document.getElementById("recentExpenses");
  if (recentEl) {
    const recent = expenses.slice(-5).reverse();
    recentEl.innerHTML = recent.length === 0 ? "<p style='color:#888'>No expenses logged yet.</p>" :
      recent.map(e => `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;">
        <span>${e.category}</span><span style="font-weight:600">₹${parseInt(e.amount).toLocaleString("en-IN")}</span>
        <span style="color:#888;font-size:12px">${e.date}</span></div>`).join("");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("proUserInput");
  if (input) input.addEventListener("keypress", e => { if (e.key === "Enter") sendMessageProf(); });
  updateProfDashboard();
});
