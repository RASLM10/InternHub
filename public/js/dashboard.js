document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth(['student'])) return;

  const user = getCurrentUser();
  const welcomeEl = document.getElementById('welcome-message');
  if (welcomeEl) welcomeEl.textContent = `Welcome back, ${user.name.split(' ')[0]}!`;

  try {
    // Load stats concurrently
    const [appsData, savedData, profileData] = await Promise.all([
      apiRequest('/applications/my'),
      apiRequest('/saved-jobs'),
      apiRequest('/users/profile').catch(() => ({ data: {} }))
    ]);

    const apps = appsData.data || [];
    const saved = savedData.data || [];
    const profile = profileData.data || {};

    // Update stat cards
    const statApps = document.getElementById('stat-applications');
    const statInterviews = document.getElementById('stat-interviews');
    const statSaved = document.getElementById('stat-saved');
    
    if (statApps) statApps.textContent = apps.length;
    if (statInterviews) statInterviews.textContent = apps.filter(a => a.status === 'interview').length;
    if (statSaved) statSaved.textContent = saved.length;

    // Calculate profile completion
    const fields = ['name', 'email', 'phone', 'location', 'headline', 'bio', 'skills', 'education', 'resumeUrl'];
    let completed = 0;
    fields.forEach(f => {
      if (profile[f] && (Array.isArray(profile[f]) ? profile[f].length > 0 : true)) completed++;
    });
    const percentage = Math.round((completed / fields.length) * 100);
    
    const progressEl = document.getElementById('profile-progress');
    const progressText = document.getElementById('profile-progress-text');
    if (progressEl) progressEl.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${percentage}%`;

    // Recent applications table
    const tbody = document.getElementById('recent-applications-body');
    if (tbody) {
      if (apps.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No applications yet.</td></tr>`;
      } else {
        const recent = apps.slice(0, 5);
        tbody.innerHTML = recent.map(app => `
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${app.job?.title || 'Unknown Job'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${app.job?.company?.name || app.job?.companyName || 'Company'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(app.createdAt)}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${app.status === 'applied' ? 'bg-blue-100 text-blue-800' : ''}
                ${app.status === 'shortlisted' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${app.status === 'interview' ? 'bg-purple-100 text-purple-800' : ''}
                ${app.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                ${app.status === 'selected' ? 'bg-green-100 text-green-800' : ''}">
                ${app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </span>
            </td>
          </tr>
        `).join('');
      }
    }

    // Recommended jobs
    const recContainer = document.getElementById('recommended-jobs');
    if (recContainer) {
      const recData = await apiRequest('/jobs?limit=3');
      const recJobs = recData.data || [];
      if (recJobs.length === 0) {
        recContainer.innerHTML = `<p class="text-gray-500">No recommendations at this time.</p>`;
      } else {
        const savedIds = saved.map(s => s.job?._id || s._id);
        recContainer.innerHTML = recJobs.map(job => createJobCard(job, savedIds)).join('');
      }
    }
  } catch (error) {
    console.error('Error loading dashboard data', error);
  }
});
