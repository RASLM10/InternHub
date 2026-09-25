/* =========================================================
   Internhub — Jobs & Internships listing pages
   Reads filters from the URL, mirrors the query string an API
   like GET /api/jobs?search=&location=&type= would use.
   ========================================================= */

function initJobsListPage({ internshipOnly } = { internshipOnly: false }) {
  const resultsEl = document.getElementById("job-results");
  const countEl = document.getElementById("results-count");
  if (!resultsEl) return;

  const searchInput = document.getElementById("filter-search");
  const locationSelect = document.getElementById("filter-location");
  const sortSelect = document.getElementById("filter-sort");
  const typeChecks = document.querySelectorAll("[data-filter-type]");
  const categoryChecks = document.querySelectorAll("[data-filter-category]");
  const experienceChecks = document.querySelectorAll("[data-filter-experience]");
  const clearBtn = document.getElementById("clear-filters");
  const mobileToggle = document.getElementById("mobile-filter-toggle");
  const filterPanel = document.getElementById("filter-panel");

  function readFiltersFromUrl() {
    searchInput.value = getParam("search") || "";
    locationSelect.value = getParam("location") || "";
    const types = (getParam("type") || "").split(",").filter(Boolean);
    const cats = (getParam("category") || "").split(",").filter(Boolean);
    const exps = (getParam("experience") || "").split(",").filter(Boolean);
    typeChecks.forEach((c) => (c.checked = types.includes(c.value)));
    categoryChecks.forEach((c) => (c.checked = cats.includes(c.value)));
    experienceChecks.forEach((c) => (c.checked = exps.includes(c.value)));
  }

  function currentFilters() {
    return {
      search: searchInput.value.trim().toLowerCase(),
      location: locationSelect.value,
      types: Array.from(typeChecks).filter((c) => c.checked).map((c) => c.value),
      categories: Array.from(categoryChecks).filter((c) => c.checked).map((c) => c.value),
      experiences: Array.from(experienceChecks).filter((c) => c.checked).map((c) => c.value),
      sort: sortSelect.value,
    };
  }

  function applyFilters() {
    const f = currentFilters();
    let results = JOBS.filter((j) => (internshipOnly ? j.isInternship : true));

    if (f.search) {
      results = results.filter((j) => {
        const company = getCompanyById(j.company).name.toLowerCase();
        return (
          j.title.toLowerCase().includes(f.search) ||
          company.includes(f.search) ||
          j.skills.some((s) => s.toLowerCase().includes(f.search))
        );
      });
    }
    if (f.location) results = results.filter((j) => j.location === f.location);
    if (f.types.length) results = results.filter((j) => f.types.includes(j.jobType));
    if (f.categories.length) results = results.filter((j) => f.categories.includes(j.category));
    if (f.experiences.length) results = results.filter((j) => f.experiences.includes(j.experience));

    if (f.sort === "newest") results.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);

    renderResults(results);
    updateUrl(f);
  }

  function renderResults(results) {
    countEl.textContent = `${results.length} ${results.length === 1 ? "opportunity" : "opportunities"} found`;
    if (!results.length) {
      resultsEl.innerHTML = `
        <div class="state-box">
          <h3>No opportunities found</h3>
          <p>Try adjusting your search or clearing filters.</p>
          <button class="btn btn-outline" id="empty-clear">Clear filters</button>
        </div>`;
      document.getElementById("empty-clear").addEventListener("click", clearFilters);
      return;
    }
    resultsEl.innerHTML = results.map(renderJobCard).join("");
    bindSaveButtons(resultsEl);
  }

  function updateUrl(f) {
    const params = new URLSearchParams();
    if (f.search) params.set("search", f.search);
    if (f.location) params.set("location", f.location);
    if (f.types.length) params.set("type", f.types.join(","));
    if (f.categories.length) params.set("category", f.categories.join(","));
    if (f.experiences.length) params.set("experience", f.experiences.join(","));
    const qs = params.toString();
    history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }

  function clearFilters() {
    searchInput.value = "";
    locationSelect.value = "";
    [...typeChecks, ...categoryChecks, ...experienceChecks].forEach((c) => (c.checked = false));
    applyFilters();
  }

  document.getElementById("job-search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    applyFilters();
  });
  locationSelect.addEventListener("change", applyFilters);
  sortSelect.addEventListener("change", applyFilters);
  [...typeChecks, ...categoryChecks, ...experienceChecks].forEach((c) => c.addEventListener("change", applyFilters));
  clearBtn.addEventListener("click", clearFilters);
  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => filterPanel.classList.toggle("is-open"));
  }

  readFiltersFromUrl();
  applyFilters();
}
