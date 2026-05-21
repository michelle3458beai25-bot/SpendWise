async function loadCurrencyWidget() {
  const widget = document.getElementById("currencyWidget");
  if (!widget) return;

  try {
    const response = await fetch("https://open.er-api.com/v6/latest/INR");
    const data = await response.json();

    if (data.result !== "success") throw new Error("API failed");

    const rates = data.rates;
    const usd = (1 / rates.USD).toFixed(4);   
    const eur = (1 / rates.EUR).toFixed(4);
    const gbp = (1 / rates.GBP).toFixed(4);

    const isStudent = localStorage.getItem("userMode") === "student";
    const budget = parseInt(isStudent ? localStorage.getItem("money") : localStorage.getItem("salary")) || 0;
    const expKey = isStudent ? "expenses" : "proExpenses";
    const expenses = JSON.parse(localStorage.getItem(expKey)) || [];
    const spent = expenses.reduce((s, e) => s + (parseInt(e.amount) || 0), 0);
    const remaining = budget - spent;

    const inUSD = (remaining * rates.USD).toFixed(2);
    const inEUR = (remaining * rates.EUR).toFixed(2);
    const inGBP = (remaining * rates.GBP).toFixed(2);

    widget.innerHTML = `
      <h3>💱 Live Currency Rates <span style="font-size:11px;font-weight:400;color:#6b7a99">(via ExchangeRate API)</span></h3>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:12px;">
        <div style="flex:1;min-width:80px;background:#1a2235;border-radius:10px;padding:12px;text-align:center;">
          <div style="font-size:11px;color:#6b7a99;margin-bottom:4px;">1 USD</div>
          <div style="font-size:18px;font-weight:700;color:#f0f4ff;">₹${(1 / rates.USD).toFixed(2)}</div>
        </div>
        <div style="flex:1;min-width:80px;background:#1a2235;border-radius:10px;padding:12px;text-align:center;">
          <div style="font-size:11px;color:#6b7a99;margin-bottom:4px;">1 EUR</div>
          <div style="font-size:18px;font-weight:700;color:#f0f4ff;">₹${(1 / rates.EUR).toFixed(2)}</div>
        </div>
        <div style="flex:1;min-width:80px;background:#1a2235;border-radius:10px;padding:12px;text-align:center;">
          <div style="font-size:11px;color:#6b7a99;margin-bottom:4px;">1 GBP</div>
          <div style="font-size:18px;font-weight:700;color:#f0f4ff;">₹${(1 / rates.GBP).toFixed(2)}</div>
        </div>
      </div>
      ${remaining > 0 ? `
      <div style="margin-top:14px;padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.07);background:#111827;">
        <div style="font-size:12px;color:#6b7a99;margin-bottom:8px;">Your remaining ₹${remaining.toLocaleString("en-IN")} equals:</div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;">
          <span style="font-size:14px;font-weight:600;color:#00d4aa;">$${inUSD} USD</span>
          <span style="font-size:14px;font-weight:600;color:#00d4aa;">€${inEUR} EUR</span>
          <span style="font-size:14px;font-weight:600;color:#00d4aa;">£${inGBP} GBP</span>
        </div>
      </div>` : ""}
      <div style="font-size:10px;color:#6b7a99;margin-top:8px;">Updated: ${new Date(data.time_last_update_utc).toLocaleString("en-IN")}</div>
    `;
  } catch (err) {
    widget.innerHTML = `<h3>💱 Currency Rates</h3><p style="color:#6b7a99;font-size:13px;">⚠️ Could not load rates. Check your internet connection.</p>`;
    console.error("ExchangeRate API error:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadCurrencyWidget);
