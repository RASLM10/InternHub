/* Reusable job card markup, shared by index/jobs/internships/dashboard pages. */

function renderJobCard(job) {
  const company = getCompanyById(job.company);
  const saved = isJobSaved(job.id);
  return `
    <article class="job-card">
      <div class="job-card-top">
        <span class="logo-chip" aria-hidden="true">${initials(company.name)}</span>
        <div class="job-card-title">
          <h3><a href="job-details.html?id=${job.id}">${job.title}</a></h3>
          <p class="job-card-company">${company.name} · ${job.location}</p>
        </div>
      </div>
      <div class="job-card-meta">
        <span class="badge">${job.jobType}</span>
        <span>${job.experience}</span>
        <span>${job.salary}</span>
      </div>
      <div class="job-card-skills">
        ${job.skills.slice(0, 3).map((s) => `<span class="badge badge-muted">${s}</span>`).join("")}
      </div>
      <div class="job-card-footer">
        <span class="job-card-posted">${formatPostedDate(job.postedDaysAgo)}</span>
        <div class="job-card-actions">
          <button type="button" class="save-btn ${saved ? "is-saved" : ""}" data-save-job="${job.id}" aria-pressed="${saved}" aria-label="${saved ? "Unsave job" : "Save job"}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${saved ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/></svg>
          </button>
          <a class="btn btn-outline btn-sm" href="job-details.html?id=${job.id}">View job</a>
        </div>
      </div>
    </article>`;
}

function bindSaveButtons(container, onChange) {
  container.querySelectorAll("[data-save-job]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!getCurrentUser()) {
        showToast("Log in to save jobs.", "error");
        return;
      }
      const nowSaved = toggleSavedJob(btn.dataset.saveJob);
      btn.classList.toggle("is-saved", nowSaved);
      btn.setAttribute("aria-pressed", String(nowSaved));
      btn.querySelector("svg").setAttribute("fill", nowSaved ? "currentColor" : "none");
      showToast(nowSaved ? "Job saved." : "Removed from saved jobs.", "success");
      if (onChange) onChange();
    });
  });
}
