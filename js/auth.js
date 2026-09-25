/* =========================================================
   Internhub — Auth page logic (login.html / register.html)
   Simulates the register/login API using localStorage. Built to
   mirror the shape a real /api/auth/login response would have,
   so it's a small change to swap in real fetch() calls later.
   ========================================================= */

const USERS_KEY = "internhub_users"; // locally "registered" demo users

function getStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}
function saveStoredUser(user) {
  const users = getStoredUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function findUserByEmail(email) {
  const local = getStoredUsers().find((u) => u.email === email.toLowerCase());
  if (local) return local;
  const demo = DEMO_ACCOUNTS.find((u) => u.email === email.toLowerCase());
  return demo || null;
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  const showing = input.type === "text";
  input.type = showing ? "password" : "text";
  btn.textContent = showing ? "Show" : "Hide";
}

/* ---------- Login page ---------- */
function initLoginPage() {
  const form = document.getElementById("login-form");
  if (!form) return;

  document.querySelectorAll("[data-toggle-password]").forEach((btn) => {
    btn.addEventListener("click", () => togglePasswordVisibility(btn.dataset.togglePassword, btn));
  });

  const forgotLink = document.getElementById("forgot-link");
  if (forgotLink) {
    forgotLink.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("Password reset isn't available in this demo. Use a demo account below.", "default");
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const banner = document.getElementById("form-banner");
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const submitBtn = form.querySelector('button[type="submit"]');

    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
      banner.textContent = "Incorrect email or password. Try a demo account below.";
      banner.className = "form-banner form-banner--error is-visible";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in…";

    setTimeout(() => {
      setCurrentUser({ name: user.name, email: user.email, role: user.role });
      showToast(`Welcome back, ${user.name.split(" ")[0]}.`, "success");
      const redirect = getParam("redirect");
      if (redirect) {
        window.location.href = decodeURIComponent(redirect);
      } else if (user.role === "employer") {
        window.location.href = "employer-dashboard.html";
      } else if (user.role === "admin") {
        window.location.href = "admin-dashboard.html";
      } else {
        window.location.href = "dashboard.html";
      }
    }, 400);
  });

  document.querySelectorAll("[data-demo-login]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("email").value = btn.dataset.email;
      document.getElementById("password").value = btn.dataset.password;
    });
  });
}

/* ---------- Register page ---------- */
function initRegisterPage() {
  const form = document.getElementById("register-form");
  if (!form) return;

  document.querySelectorAll("[data-toggle-password]").forEach((btn) => {
    btn.addEventListener("click", () => togglePasswordVisibility(btn.dataset.togglePassword, btn));
  });

  const roleOptions = document.querySelectorAll(".role-option");
  roleOptions.forEach((opt) => {
    opt.addEventListener("click", () => {
      roleOptions.forEach((o) => o.classList.remove("is-active"));
      opt.classList.add("is-active");
      opt.querySelector("input").checked = true;
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const banner = document.getElementById("form-banner");
    banner.className = "form-banner form-banner--error";

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm-password").value;
    const role = form.querySelector('input[name="role"]:checked').value;

    if (name.length < 2) return showError(banner, "Please enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return showError(banner, "Please enter a valid email address.");
    if (password.length < 8) return showError(banner, "Password must be at least 8 characters.");
    if (password !== confirm) return showError(banner, "Passwords do not match.");
    if (findUserByEmail(email)) return showError(banner, "An account with this email already exists.");

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Creating account…";

    setTimeout(() => {
      saveStoredUser({ name, email, password, role });
      window.location.href = "login.html?registered=1";
    }, 400);
  });

  function showError(banner, msg) {
    banner.textContent = msg;
    banner.classList.add("is-visible");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initLoginPage();
  initRegisterPage();

  if (getParam("registered") === "1") {
    showToast("Account created. Log in to continue.", "success");
  }
});
