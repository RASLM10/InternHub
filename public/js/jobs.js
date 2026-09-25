document.addEventListener('DOMContentLoaded', () => {
  const isInternship = window.location.pathname.includes('internships.html');
  const containerId = isInternship ? 'internships-container' : 'jobs-container';
  const apiEndpoint = '/jobs';

  initFilters();
  loadJobs();

  function initFilters() {
    // Fill from URL
    const search = getUrlParam('search');
    const location = getUrlParam('location');
    const category = getUrlParam('category');
    
    if (search && document.getElementById('search-input')) document.getElementById('search-input').value = search;
    if (location && document.getElementById('location-input')) document.getElementById('location-input').value = location;
    if (category && document.getElementById('category-filter')) document.getElementById('category-filter').value = category;

    // Listeners
    document.querySelectorAll('.filter-input').forEach(input => {
      input.addEventListener('change', () => {
        updateUrlFromFilters();
        loadJobs();
      });
    });

    const searchForm = document.getElementById('job-search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateUrlFromFilters();
        loadJobs();
      });
    }

    const clearBtn = document.getElementById('clear-filters');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        document.querySelectorAll('.filter-input').forEach(input => {
          if (input.type === 'checkbox' || input.type === 'radio') input.checked = false;
          else input.value = '';
        });
        updateUrlFromFilters();
        loadJobs();
      });
    }
  }

  function updateUrlFromFilters() {
    const params = {};
    const search = document.getElementById('search-input')?.value;
    const location = document.getElementById('location-input')?.value;
    const sort = document.getElementById('sort-select')?.value;
    
    if (search) params.search = search;
    if (location) params.location = location;
    if (sort) params.sort = sort;

    const checkedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
    if (checkedCategories.length > 0) params.category = checkedCategories.join(',');
    
    const checkedTypes = Array.from(document.querySelectorAll('input[name="jobType"]:checked')).map(cb => cb.value);
    if (checkedTypes.length > 0) params.jobType = checkedTypes.join(',');
    
    setUrlParams(params);
  }

  async function loadJobs() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    showSkeletons(containerId, 5);
    
    try {
      const queryParams = new URLSearchParams(window.location.search);
      if (isInternship) queryParams.set('isInternship', 'true');
      
      const queryString = queryParams.toString();
      const endpoint = `${apiEndpoint}${queryString ? '?' + queryString : ''}`;
      
      const [jobsData, savedJobsData] = await Promise.all([
        apiRequest(endpoint),
        isLoggedIn() && getCurrentUser()?.role === 'student' ? apiRequest('/saved-jobs').catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
      ]);
      
      const jobs = jobsData.data || [];
      const savedIds = (savedJobsData.data || []).map(j => j._id || j.job?._id);
      
      const resultsCount = document.getElementById('results-count');
      if (resultsCount) resultsCount.textContent = `Showing ${jobs.length} results`;
      
      if (jobs.length === 0) {
        showEmptyState(containerId, 'Try adjusting your filters or search query to find more opportunities.');
      } else {
        container.innerHTML = jobs.map(job => createJobCard(job, savedIds)).join('');
      }
    } catch (error) {
      container.innerHTML = `<p class="text-red-500 col-span-full py-10 text-center">Error loading jobs: ${error.message}</p>`;
    }
  }
});
