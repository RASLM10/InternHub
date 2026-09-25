document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth(['employer'])) return;

  const currentUser = getCurrentUser();

  // DASHBOARD
  if (document.getElementById('employer-dashboard-stats')) {
    try {
      // Get all jobs to find employer's jobs
      const jobsData = await apiRequest('/jobs?limit=100');
      const allJobs = jobsData.data || [];
      const myJobs = allJobs.filter(j => j.postedBy === currentUser.id);

      document.getElementById('stat-active-jobs').textContent = myJobs.filter(j => j.status !== 'closed').length;
      document.getElementById('stat-total-jobs').textContent = myJobs.length;

      // Applications count - need to fetch for all my jobs
      let totalApps = 0;
      for (const job of myJobs) {
         try {
           const appsData = await apiRequest(`/applications/job/${job._id}`);
           totalApps += (appsData.data || []).length;
         } catch(e) {}
      }
      document.getElementById('stat-total-applicants').textContent = totalApps;

      // Render recent jobs table
      const tbody = document.getElementById('recent-jobs-body');
      if (myJobs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No jobs posted yet.</td></tr>`;
      } else {
        tbody.innerHTML = myJobs.slice(0, 5).map(job => `
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${job.title}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(job.createdAt)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${job.jobType}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <a href="/applicants.html?job=${job._id}" class="text-blue-600 hover:text-blue-900">View Applicants</a>
            </td>
          </tr>
        `).join('');
      }
    } catch (error) {
      console.error('Failed to load employer dashboard', error);
    }
  }

  // POST JOB
  const postJobForm = document.getElementById('post-job-form');
  if (postJobForm) {
    let userCompany = null;
    try {
      const compData = await apiRequest('/companies');
      const companies = compData.data || [];
      // Assuming user created the company if they are employer
      userCompany = companies.find(c => c.createdBy === currentUser.id) || companies[0]; // fallback
      
      const compSelect = document.getElementById('company-select');
      if (userCompany && compSelect) {
        compSelect.innerHTML = `<option value="${userCompany._id}">${userCompany.name}</option>`;
      } else if (compSelect) {
         showToast('Please create a company profile first', 'warning');
         // Redirect to company profile creation (not implemented in details but good UX)
      }
    } catch (e) {}

    // Dynamic lists logic
    const setupDynamicList = (containerId, addBtnId, name) => {
      const container = document.getElementById(containerId);
      const btn = document.getElementById(addBtnId);
      if (!container || !btn) return;
      
      btn.addEventListener('click', () => {
        const div = document.createElement('div');
        div.className = 'flex gap-2 mb-2';
        div.innerHTML = `
          <input type="text" name="${name}" class="flex-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
          <button type="button" class="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200" onclick="this.parentElement.remove()">&times;</button>
        `;
        container.appendChild(div);
      });
    };

    setupDynamicList('requirements-container', 'add-requirement', 'requirements');
    setupDynamicList('responsibilities-container', 'add-responsibility', 'responsibilities');
    setupDynamicList('benefits-container', 'add-benefit', 'benefits');

    postJobForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const getArray = (name) => Array.from(postJobForm.querySelectorAll(`input[name="${name}"]`)).map(i => i.value).filter(v => v);
      
      const payload = {
        title: document.getElementById('title').value,
        company: document.getElementById('company-select').value,
        location: document.getElementById('location').value,
        description: document.getElementById('description').value,
        jobType: document.getElementById('jobType').value,
        experience: document.getElementById('experience').value,
        isInternship: document.getElementById('isInternship').checked,
        skills: document.getElementById('skills').value.split(',').map(s => s.trim()).filter(s => s),
        requirements: getArray('requirements'),
        responsibilities: getArray('responsibilities'),
        benefits: getArray('benefits'),
        salary: {
          min: parseInt(document.getElementById('salary-min').value) || 0,
          max: parseInt(document.getElementById('salary-max').value) || 0,
          currency: 'INR'
        }
      };

      const btn = postJobForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Posting...';

      try {
        await apiRequest('/jobs', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showToast('Job posted successfully!', 'success');
        setTimeout(() => window.location.href = '/employer-dashboard.html', 1500);
      } catch (error) {
        showToast(error.message || 'Error posting job', 'error');
        btn.disabled = false;
        btn.textContent = originalText;
      }
    });
  }

  // APPLICANTS
  const jobSelector = document.getElementById('job-selector');
  const applicantsContainer = document.getElementById('applicants-container');
  
  if (jobSelector && applicantsContainer) {
    try {
      const jobsData = await apiRequest('/jobs?limit=100');
      const allJobs = jobsData.data || [];
      const myJobs = allJobs.filter(j => j.postedBy === currentUser.id);
      
      if (myJobs.length === 0) {
        jobSelector.innerHTML = '<option>No jobs posted yet</option>';
        jobSelector.disabled = true;
      } else {
        jobSelector.innerHTML = '<option value="">Select a job to view applicants</option>' + 
          myJobs.map(j => `<option value="${j._id}">${j.title}</option>`).join('');
        
        const preselectedJob = getUrlParam('job');
        if (preselectedJob) {
          jobSelector.value = preselectedJob;
          loadApplicants(preselectedJob);
        }

        jobSelector.addEventListener('change', (e) => {
          if (e.target.value) loadApplicants(e.target.value);
          else applicantsContainer.innerHTML = '';
        });
      }
    } catch(e) {}
  }

  async function loadApplicants(jobId) {
    applicantsContainer.innerHTML = '<div class="col-span-full py-8 text-center text-gray-500">Loading applicants...</div>';
    try {
      const data = await apiRequest(`/applications/job/${jobId}`);
      const apps = data.data || [];
      
      if (apps.length === 0) {
        applicantsContainer.innerHTML = '<div class="col-span-full py-8 text-center text-gray-500">No applicants yet for this job.</div>';
        return;
      }

      applicantsContainer.innerHTML = apps.map(app => {
        const student = app.user || {};
        return `
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
            <div class="flex-1">
              <h3 class="text-lg font-semibold">${student.name || 'Unknown User'}</h3>
              <p class="text-sm text-gray-600 mb-2">${student.email || ''} ${student.phone ? '| ' + student.phone : ''}</p>
              ${app.resumeUrl ? `<a href="${app.resumeUrl}" target="_blank" class="text-blue-600 text-sm hover:underline flex items-center gap-1 mb-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> View Resume</a>` : ''}
              ${app.coverLetter ? `<div class="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded"><strong>Cover Letter:</strong><br>${app.coverLetter}</div>` : ''}
            </div>
            <div class="shrink-0 flex flex-col gap-2 min-w-[150px]">
              <label class="text-xs text-gray-500 font-medium">Update Status</label>
              <select onchange="updateApplicationStatus('${app._id}', this.value)" class="border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="applied" ${app.status === 'applied' ? 'selected' : ''}>Applied</option>
                <option value="shortlisted" ${app.status === 'shortlisted' ? 'selected' : ''}>Shortlisted</option>
                <option value="interview" ${app.status === 'interview' ? 'selected' : ''}>Interview</option>
                <option value="selected" ${app.status === 'selected' ? 'selected' : ''}>Selected</option>
                <option value="rejected" ${app.status === 'rejected' ? 'selected' : ''}>Rejected</option>
              </select>
              <p class="text-xs text-gray-400 mt-2">Applied ${formatDate(app.createdAt)}</p>
            </div>
          </div>
        `;
      }).join('');
    } catch (error) {
      applicantsContainer.innerHTML = `<div class="col-span-full py-8 text-center text-red-500">Failed to load applicants: ${error.message}</div>`;
    }
  }

  window.updateApplicationStatus = async (appId, status) => {
    try {
      await apiRequest(`/applications/${appId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      showToast('Status updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };
});
