function initJobDetailsPage() {
  const root = document.getElementById("job-details-root");
  if (!root) return;
  const id = getParam("id");
  const job = getJobById(id);

  if (!job) {
    root.innerHTML = `<div class="state-box"><h3>This job no longer exists.</h3><p>It may have been removed or the link is incorrect.</p><a class="btn btn-primary" href="jobs.html">Browse jobs</a></div>`;
    return;
  }
  const company = getCompanyById(job.company);
  document.title = `${job.title} at ${company.name} | Internhub`;

  document.getElementById("job-title").textContent = job.title;
  document.getElementById("job-company").textContent = `${company.name} · ${job.location}`;
  document.getElementById("job-logo").textContent = initials(company.name);
  document.getElementById("job-type-badge").textContent = job.jobType;
  document.getElementById("job-experience").textContent = job.experience;
  document.getElementById("job-salary").textContent = job.salary;
  document.getElementById("job-posted").textContent = formatPostedDate(job.postedDaysAgo);
  document.getElementById("job-deadline").textContent = new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  document.getElementById("job-description").textContent = job.description;
  document.getElementById("job-skills").innerHTML = job.skills.map((s) => `<span class="badge badge-muted">${s}</span>`).join("");
  document.getElementById("job-responsibilities").innerHTML = job.responsibilities.map((r) => `<li>${r}</li>`).join("");
  document.getElementById("job-requirements").innerHTML = job.requirements.map((r) => `<li>${r}</li>`).join("");
  document.getElementById("job-benefits").innerHTML = job.benefits.map((r) => `<li>${r}</li>`).join("");

  document.getElementById("company-name-side").textContent = company.name;
  document.getElementById("company-industry-side").textContent = company.industry;
  document.getElementById("company-desc-side").textContent = company.description;

  const saveBtn = document.getElementById("save-job-btn");
  const saved = isJobSaved(job.id);
  saveBtn.textContent = saved ? "Saved" : "Save job";
  saveBtn.classList.toggle("is-saved", saved);
  saveBtn.addEventListener("click", () => {
    if (!getCurrentUser()) return (window.location.href = `login.html?redirect=${encodeURIComponent("job-details.html?id=" + job.id)}`);
    const nowSaved = toggleSavedJob(job.id);
    saveBtn.textContent = nowSaved ? "Saved" : "Save job";
    saveBtn.classList.toggle("is-saved", nowSaved);
    showToast(nowSaved ? "Job saved." : "Removed from saved jobs.", "success");
  });

  const applyPanel = document.getElementById("apply-panel");
  const user = getCurrentUser();

  if (user && hasApplied(job.id, user.email)) {
    applyPanel.innerHTML = `<span class="badge badge-accent">Already applied</span><p class="field-hint">You applied to this role. Track it from your Applications page.</p>`;
    return;
  }

  document.getElementById("apply-btn").addEventListener("click", () => {
    if (!user) {
      window.location.href = `login.html?redirect=${encodeURIComponent("job-details.html?id=" + job.id)}`;
      return;
    }
    if (user.role !== "student") {
      showToast("Only student accounts can apply to jobs.", "error");
      return;
    }
    document.getElementById("apply-form-wrap").hidden = false;
    document.getElementById("apply-btn").hidden = true;
  });

  const applyForm = document.getElementById("apply-form");
  if (applyForm) {
    applyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = applyForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting…";
      setTimeout(() => {
        addApplication({
          jobId: job.id,
          email: user.email,
          resumeUrl: document.getElementById("resume-url").value,
          coverLetter: document.getElementById("cover-letter").value,
          status: "Applied",
          appliedAt: new Date().toISOString(),
        });
        showToast("Application submitted successfully.", "success");
        document.getElementById("apply-form-wrap").innerHTML = `<span class="badge status-Applied">Applied</span><p class="field-hint">Track this application from your dashboard.</p>`;
      }, 500);
    });
  }
}

document.addEventListener("DOMContentLoaded", initJobDetailsPage);
