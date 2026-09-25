document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth(['student'])) return;

  const container = document.getElementById('saved-jobs-container');
  if (!container) return;

  showSkeletons('saved-jobs-container', 4);

  try {
    const data = await apiRequest('/saved-jobs');
    const saved = data.data || [];

    if (saved.length === 0) {
      showEmptyState('saved-jobs-container', 'You haven\'t saved any jobs yet.', 'Browse Jobs', '/jobs.html');
      return;
    }

    const savedIds = saved.map(s => s.job?._id || s._id);
    // Use createJobCard but pass job object
    container.innerHTML = saved.map(s => {
      const job = s.job;
      if (!job) return '';
      return createJobCard(job, savedIds);
    }).join('');

  } catch (error) {
    container.innerHTML = `<p class="text-red-500 py-8 text-center">Failed to load saved jobs: ${error.message}</p>`;
  }
});
