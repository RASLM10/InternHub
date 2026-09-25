function initDashboardPage() {
  const root = document.getElementById("dashboard-root");
  if (!root) return;
  const user = requireAuth("student");
  if (!user) return;

  document.getElementById("welcome-name").textContent = user.name.split(" ")[0];

  const apps = getApplications().filter((a) => a.email === user.email);
  const saved = getSavedJobs();

  document.getElementById("stat-applications").textContent = apps.length;
  document.getElementById("stat-saved").textContent = saved.length;
  document.getElementById("stat-interview").textContent = apps.filter((a) => a.status === "Interview").length;
  document.getElementById("stat-selected").textContent = apps.filter((a) => a.status === "Selected").length;

  const recentEl = document.getElementById("recent-applications");
  if (!apps.length) {
    recentEl.innerHTML = `<div class="state-box"><h3>You haven't applied to any opportunities yet.</h3><p>Explore open roles and apply in a few clicks.</p><a class="btn btn-primary" href="jobs.html">Browse jobs</a></div>`;
  } else {
    recentEl.innerHTML = `
      <table class="table">
        <thead><tr><th>Job</th><th>Company</th><th>Applied</th><th>Status</th></tr></thead>
        <tbody>
          ${apps.slice(0, 5).map((a) => {
            const job = getJobById(a.jobId);
            const company = getCompanyById(job.company);
            return `<tr>
              <td><a href="job-details.html?id=${job.id}">${job.title}</a></td>
              <td>${company.name}</td>
              <td>${new Date(a.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
              <td><span class="badge status-${a.status}">${a.status}</span></td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>`;
  }

  const recommended = JOBS.filter((j) => !apps.some((a) => a.jobId === j.id)).slice(0, 3);
  document.getElementById("recommended-jobs").innerHTML = recommended.map(renderJobCard).join("");
  bindSaveButtons(document.getElementById("recommended-jobs"));

  const fields = [user.name, user.email, "Skills", "Resume"];
  const completion = Math.round((fields.filter(Boolean).length / fields.length) * 100);
  document.getElementById("profile-progress-fill").style.width = completion + "%";
  document.getElementById("profile-progress-text").textContent = `${completion}% complete`;
}

document.addEventListener("DOMContentLoaded", initDashboardPage);
