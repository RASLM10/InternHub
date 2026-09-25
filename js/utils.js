/* =========================================================
   Internhub — Shared Utilities
   ========================================================= */

/* ---------- Toasts ---------- */
function showToast(message, type = "default") {
  let region = document.getElementById("toast-region");
  if (!region) {
    region = document.createElement("div");
    region.id = "toast-region";
    region.setAttribute("aria-live", "polite");
    document.body.appendChild(region);
  }
  const toast = document.createElement("div");
  toast.className = `toast ${type === "success" ? "toast-success" : type === "error" ? "toast-error" : ""}`;
  toast.textContent = message;
  region.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

/* ---------- Formatting ---------- */
function formatPostedDate(daysAgo) {
  if (daysAgo === 0) return "Posted today";
  if (daysAgo === 1) return "Posted 1 day ago";
  return `Posted ${daysAgo} days ago`;
}

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* ---------- URL params ---------- */
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
function setParams(obj) {
  const params = new URLSearchParams(window.location.search);
  Object.entries(obj).forEach(([k, v]) => {
    if (v) params.set(k, v);
    else params.delete(k);
  });
  return params.toString();
}

/* ---------- Auth state (localStorage-backed demo auth) ---------- */
const AUTH_KEY = "internhub_auth";
const APPLICATIONS_KEY = "internhub_applications";
const SAVED_KEY = "internhub_saved_jobs";

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
  } catch {
    return null;
  }
}
function setCurrentUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}
function logoutUser() {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = "index.html";
}
function requireAuth(role) {
  const user = getCurrentUser();
  if (!user) {
    const redirect = encodeURIComponent(window.location.pathname.split("/").pop() + window.location.search);
    window.location.href = `login.html?redirect=${redirect}`;
    return null;
  }
  if (role && user.role !== role) {
    showToast("You don't have access to that page.", "error");
    window.location.href = "index.html";
    return null;
  }
  return user;
}

/* ---------- Applications (demo, localStorage) ---------- */
function getApplications() {
  try {
    return JSON.parse(localStorage.getItem(APPLICATIONS_KEY)) || [];
  } catch {
    return [];
  }
}
function addApplication(app) {
  const apps = getApplications();
  apps.push(app);
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
}
function hasApplied(jobId, email) {
  return getApplications().some((a) => a.jobId === jobId && a.email === email);
}

/* ---------- Saved jobs (demo, localStorage) ---------- */
function getSavedJobs() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY)) || [];
  } catch {
    return [];
  }
}
function toggleSavedJob(jobId) {
  let saved = getSavedJobs();
  if (saved.includes(jobId)) {
    saved = saved.filter((id) => id !== jobId);
  } else {
    saved.push(jobId);
  }
  localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  return saved.includes(jobId);
}
function isJobSaved(jobId) {
  return getSavedJobs().includes(jobId);
}
