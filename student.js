window.addEventListener("DOMContentLoaded", function () {
  const existingEmail = localStorage.getItem("email");
  const existingMode = localStorage.getItem("userMode");
  const existingName = localStorage.getItem("fname");

  
  if (existingMode === "student" && existingEmail) {
    document.getElementById("welcomeBack").style.display = "flex";
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("subtext").textContent = "Welcome back! 👋";
    document.getElementById("wbName").textContent = existingName || "Student";
    document.getElementById("wbEmail").textContent = existingEmail;
  }
});

function goToDashboard() {
  localStorage.setItem("loggedIn", "true");
  window.location.href = "studentdash.html";
}

function showRegisterForm() {
  document.getElementById("welcomeBack").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
  document.getElementById("backBtn").style.display = "inline-block";
  document.getElementById("subtext").textContent = "Create a new account";
}

function showWelcomeBack() {
  document.getElementById("welcomeBack").style.display = "flex";
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("subtext").textContent = "Welcome back! 👋";
}

function saveData(event) {
  event.preventDefault();

  const fname = document.getElementById("fname").value;
  const lname = document.getElementById("lname").value;
  const phone = document.getElementById("phone").value;
  const age = document.getElementById("age").value;
  const money = document.getElementById("money").value;
  const email = document.getElementById("email").value;

  localStorage.setItem("userMode", "student");
  localStorage.setItem("fname", fname);
  localStorage.setItem("lname", lname);
  localStorage.setItem("phone", phone);
  localStorage.setItem("age", age);
  localStorage.setItem("money", money);
  localStorage.setItem("email", email);
  localStorage.setItem("loggedIn", "true");

  if (!localStorage.getItem("expenses")) {
    localStorage.setItem("expenses", JSON.stringify([]));
  }
  if (!localStorage.getItem("spent")) {
    localStorage.setItem("spent", 0);
  }

  window.location.href = "studentdash.html";
}
