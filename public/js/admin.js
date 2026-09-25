document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth(['admin'])) return;

  // Load stats
  try {
    const statsData = await apiRequest('/admin/stats');
    const stats = statsData.data || {};
    
    document.getElementById('stat-users').textContent = stats.users || 0;
    document.getElementById('stat-jobs').textContent = stats.jobs || 0;
    document.getElementById('stat-companies').textContent = stats.companies || 0;
    document.getElementById('stat-apps').textContent = stats.applications || 0;
  } catch(e) {
    console.error('Error loading stats', e);
  }

  // Tabs logic
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  const tabPanes = document.querySelectorAll('.admin-tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('border-blue-600', 'text-blue-600');
        b.classList.add('border-transparent', 'text-gray-500');
      });
      btn.classList.add('border-blue-600', 'text-blue-600');
      btn.classList.remove('border-transparent', 'text-gray-500');

      tabPanes.forEach(p => p.classList.add('hidden'));
      document.getElementById(`tab-${btn.dataset.tab}`).classList.remove('hidden');

      loadTabData(btn.dataset.tab);
    });
  });

  // Initial load
  loadTabData('users');

  async function loadTabData(tab) {
    const tbody = document.getElementById(`${tab}-tbody`);
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center">Loading...</td></tr>';

    try {
      if (tab === 'users') {
        const data = await apiRequest('/admin/users');
        const users = data.data || [];
        tbody.innerHTML = users.map(u => `
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${u.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${u.email}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : (u.role === 'employer' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800')}">${u.role}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(u.createdAt)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              ${u.role !== 'admin' ? `<button onclick="deleteUser('${u._id}')" class="text-red-600 hover:text-red-900">Delete</button>` : ''}
            </td>
          </tr>
        `).join('') || '<tr><td colspan="5" class="px-6 py-4 text-center">No users found.</td></tr>';
      }
      else if (tab === 'jobs') {
        const data = await apiRequest('/admin/jobs');
        const jobs = data.data || [];
        tbody.innerHTML = jobs.map(j => `
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              <a href="/job-details.html?id=${j._id}" target="_blank" class="hover:underline">${j.title}</a>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${j.company?.name || j.companyName || '-'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${j.isInternship ? 'Internship' : 'Job'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(j.createdAt)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button onclick="deleteJob('${j._id}')" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        `).join('') || '<tr><td colspan="5" class="px-6 py-4 text-center">No jobs found.</td></tr>';
      }
      else if (tab === 'companies') {
        const data = await apiRequest('/admin/companies');
        const companies = data.data || [];
        tbody.innerHTML = companies.map(c => `
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${c.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${c.industry || '-'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${c.location || '-'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(c.createdAt)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
               <button onclick="deleteCompany('${c._id}')" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        `).join('') || '<tr><td colspan="5" class="px-6 py-4 text-center">No companies found.</td></tr>';
      }
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">Error: ${err.message}</td></tr>`;
    }
  }

  window.deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await apiRequest(`/admin/users/${id}`, { method: 'DELETE' });
      showToast('User deleted', 'success');
      loadTabData('users');
    } catch(e) { showToast(e.message, 'error'); }
  };

  window.deleteJob = async (id) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      await apiRequest(`/admin/jobs/${id}`, { method: 'DELETE' });
      showToast('Job deleted', 'success');
      loadTabData('jobs');
    } catch(e) { showToast(e.message, 'error'); }
  };

  window.deleteCompany = async (id) => {
    if (!confirm('Are you sure you want to delete this company?')) return;
    try {
      await apiRequest(`/admin/companies/${id}`, { method: 'DELETE' });
      showToast('Company deleted', 'success');
      loadTabData('companies');
    } catch(e) { showToast(e.message, 'error'); }
  };
});
