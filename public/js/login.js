document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const elements = {
    loginForm: document.getElementById("loginForm"),
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    loginBtn: document.getElementById("loginBtn"),
    toast: document.getElementById("toast"),
  };

  // Guard: already logged in
  const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
  if (isLoggedIn) {
    window.location.href = "/";
    return;
  }

  // Events
  elements.loginForm.addEventListener("submit", handleLogin);

  function handleLogin(e) {
    e.preventDefault();

    const email = elements.email.value.trim().toLowerCase();
    const password = elements.password.value.trim();

    if (email === "admin@gmail.com" && password === "admin123") {
      localStorage.setItem("isAdminLoggedIn", "true");
      localStorage.setItem(
        "adminUser",
        JSON.stringify({ name: "Admin", email })
      );

      showToast("Login successful", "success");

      setTimeout(() => {
        window.location.href = "/";
      }, 800);
    } else {
      showToast("Invalid email or password", "error");
    }
  }

  function showToast(message, type = "success") {
    elements.toast.textContent = message;
    elements.toast.className = `toast ${type}`;
    elements.toast.classList.add("show");

    setTimeout(() => {
      elements.toast.classList.remove("show");
    }, 3000);
  }
});
