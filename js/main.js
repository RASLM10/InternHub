/* =========================================================
   Internhub — Global chrome: navbar + footer + mobile menu
   Injected on every page via #site-header / #site-footer mounts.
   ========================================================= */

function renderHeader() {
  const mount = document.getElementById("site-header");
  if (!mount) return;
  const user = getCurrentUser();
  const current = document.body.dataset.page || "";

  const navItem = (href, label, key) =>
    `<a href="${href}" ${current === key ? 'aria-current="page"' : ""}>${label}</a>`;

  let authArea = `
    <a class="btn btn-outline btn-sm" href="login.html">Log in</a>
    <a class="btn btn-primary btn-sm" href="register.html">Get started</a>`;
  let userArea = "";

  if (user) {
    const dashHref = user.role === "employer" ? "employer-dashboard.html" : user.role === "admin" ? "admin-dashboard.html" : "dashboard.html";
    authArea = `
      <a class="btn btn-outline btn-sm" href="${dashHref}">Dashboard</a>
      <button class="btn btn-primary btn-sm" id="logout-btn" type="button">Log out</button>`;
    userArea = `<div class="nav-user"><span class="logo-chip" style="width:30px;height:30px;border-radius:50%;font-size:0.8rem;">${initials(user.name)}</span> <strong>${user.name}</strong></div>`;
  }

  mount.innerHTML = `
    <header class="site-header">
      <div class="navbar" id="navbar">
        <a class="brand" href="index.html"><span class="brand-mark">IH</span>Internhub</a>
        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false"><span class="visually-hidden">Menu</span></button>
        <ul class="nav-links">
          <li>${navItem("jobs.html", "Jobs", "jobs")}</li>
          <li>${navItem("internships.html", "Internships", "internships")}</li>
          <li>${navItem("login.html#companies", "Companies", "companies")}</li>
        </ul>
        ${userArea}
        <div class="nav-actions">${authArea}</div>
      </div>
    </header>`;

  const toggle = document.getElementById("nav-toggle");
  const navbar = document.getElementById("navbar");
  toggle.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", logoutUser);
}

function renderFooter() {
  const mount = document.getElementById("site-footer");
  if (!mount) return;
  mount.innerHTML = `
    <footer class="site-footer">
      <div class="footer-top">
        <div class="footer-brand">
          <a class="brand" href="index.html"><span class="brand-mark">IH</span>Internhub</a>
          <p>Internhub helps students and early-career professionals discover jobs and internships that fit where they want to go next.</p>
          <div class="footer-social">
            <a href="#" aria-label="Internhub on LinkedIn">in</a>
            <a href="#" aria-label="Internhub on Instagram">ig</a>
            <a href="#" aria-label="Internhub on GitHub">gh</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Platform</h4>
          <ul>
            <li><a href="jobs.html">Jobs</a></li>
            <li><a href="internships.html">Internships</a></li>
            <li><a href="index.html">About</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Candidates</h4>
          <ul>
            <li><a href="jobs.html">Browse jobs</a></li>
            <li><a href="internships.html">Browse internships</a></li>
            <li><a href="dashboard.html">Dashboard</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Employers</h4>
          <ul>
            <li><a href="register.html">Post a job</a></li>
            <li><a href="login.html">Employer login</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:hello@internhub.example">hello@internhub.example</a></li>
            <li><a href="mailto:support@internhub.example">support@internhub.example</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-bottom-inner">
          <span>© 2026 Internhub. All rights reserved.</span>
          <div class="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
});
