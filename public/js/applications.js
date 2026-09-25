document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth(['student'])) return;

  const container = document.getElementById('applications-container');
  if (!container) return;

  showSkeletons('applications-container', 4);

  try {
    const data = await apiRequest('/applications/my');
    const apps = data.data || [];

    if (apps.length === 0) {
      showEmptyState('applications-container', 'You haven\'t applied to any jobs yet.', 'Browse Jobs', '/jobs.html');
      return;
    }

    container.innerHTML = apps.map(app => {
      const job = app.job || {};
      const companyName = job.company?.name || job.companyName || 'Company';
      const color = getAvatarColor(companyName);
      const initials = getInitials(companyName);
      
      let badgeClass = '';
      switch (app.status) {
        case 'applied': badgeClass = 'bg-blue-100 text-blue-800'; break;
        case 'shortlisted': badgeClass = 'bg-yellow-100 text-yellow-800'; break;
        case 'interview': badgeClass = 'bg-purple-100 text-purple-800'; break;
        case 'rejected': badgeClass = 'bg-red-100 text-red-800'; break;
        case 'selected': badgeClass = 'bg-green-100 text-green-800'; break;
        default: badgeClass = 'bg-gray-100 text-gray-800';
      }

      return `
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div class="w-16 h-16 rounded-lg flex items-center justify-center text-white text-xl font-bold shrink-0" style="background-color: ${color}">
            ${initials}
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-semibold text-gray-900 mb-1">
              <a href="/job-details.html?id=${job._id}" class="hover:text-blue-600">${job.title || 'Unknown Job'}</a>
            </h3>
            <p class="text-gray-600 mb-2">${companyName}</p>
            <div class="flex flex-wrap gap-4 text-sm text-gray-500">
              <span class="flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> Applied on ${formatDate(app.createdAt)}</span>
              <span class="flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>${job.location || 'N/A'}</span>
            </div>
          </div>
          <div class="shrink-0 flex flex-col items-end gap-3">
            <span class="px-3 py-1 rounded-full text-sm font-medium ${badgeClass}">
              ${app.status.charAt(0).toUpperCase() + app.status.slice(1)}
            </span>
            <a href="/job-details.html?id=${job._id}" class="text-blue-600 hover:text-blue-700 text-sm font-medium">View Job &rarr;</a>
          </div>
        </div>
      `;
    }).join('');

  } catch (error) {
    container.innerHTML = `<p class="text-red-500 py-8 text-center">Failed to load applications: ${error.message}</p>`;
  }
});
