document.addEventListener('DOMContentLoaded', async () => {
  const jobId = getUrlParam('id');
  if (!jobId) {
    window.location.href = '/jobs.html';
    return;
  }

  const container = document.getElementById('job-details-container');
  if (!container) return;

  try {
    const jobData = await apiRequest(`/jobs/${jobId}`);
    const job = jobData.data;
    if (!job) throw new Error('Job not found');

    let hasApplied = false;
    let isSaved = false;
    
    if (isLoggedIn() && getCurrentUser()?.role === 'student') {
      try {
        const [appData, savedData] = await Promise.all([
          apiRequest('/applications/my'),
          apiRequest('/saved-jobs')
        ]);
        hasApplied = (appData.data || []).some(app => app.job?._id === jobId || app.job === jobId);
        isSaved = (savedData.data || []).some(sj => (sj.job?._id || sj._id) === jobId);
      } catch(e) {}
    }

    renderJobDetails(job, hasApplied, isSaved);
    setupApplicationForm(jobId);
  } catch (error) {
    container.innerHTML = `<div class="p-8 text-center text-red-500">Failed to load job details: ${error.message}</div>`;
  }
});

function renderJobDetails(job, hasApplied, isSaved) {
  const companyName = job.company?.name || job.companyName || 'Company Name';
  const color = getAvatarColor(companyName);
  const initials = getInitials(companyName);
  
  // Header
  const headerDiv = document.getElementById('job-header');
  if (headerDiv) {
    headerDiv.innerHTML = `
      <div class="flex items-center gap-6 mb-6">
        <div class="w-20 h-20 rounded-xl flex items-center justify-center text-white text-2xl font-bold" style="background-color: ${color}">
          ${initials}
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">${job.title}</h1>
          <p class="text-xl text-gray-600">${companyName}</p>
        </div>
      </div>
      <div class="flex flex-wrap gap-4 text-sm text-gray-600">
        <span class="flex items-center gap-1"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>${job.location}</span>
        <span class="flex items-center gap-1"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>${job.experience || 'Fresher'}</span>
        <span class="flex items-center gap-1"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>${formatSalary(job.salary)}</span>
        <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">${job.jobType || 'Full-time'}</span>
      </div>
    `;
  }

  // Content
  const descDiv = document.getElementById('job-description');
  if (descDiv) {
    descDiv.innerHTML = `
      <h3 class="text-xl font-semibold mb-4">About the Role</h3>
      <div class="prose max-w-none text-gray-700 mb-8 whitespace-pre-line">${job.description || 'No description provided.'}</div>
      
      ${job.requirements && job.requirements.length > 0 ? `
        <h3 class="text-xl font-semibold mb-4">Requirements</h3>
        <ul class="list-disc pl-5 text-gray-700 mb-8 space-y-2">
          ${job.requirements.map(req => `<li>${req}</li>`).join('')}
        </ul>
      ` : ''}

      ${job.responsibilities && job.responsibilities.length > 0 ? `
        <h3 class="text-xl font-semibold mb-4">Responsibilities</h3>
        <ul class="list-disc pl-5 text-gray-700 mb-8 space-y-2">
          ${job.responsibilities.map(res => `<li>${res}</li>`).join('')}
        </ul>
      ` : ''}
      
      <h3 class="text-xl font-semibold mb-4">Skills Required</h3>
      <div class="flex flex-wrap gap-2 mb-8">
        ${(job.skills || []).map(skill => `<span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-md">${skill}</span>`).join('')}
      </div>
    `;
  }

  // Sidebar actions
  const actionsDiv = document.getElementById('job-actions');
  if (actionsDiv) {
    if (!isLoggedIn()) {
      actionsDiv.innerHTML = `
        <button onclick="redirectToLogin()" class="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors mb-4">
          Log in to Apply
        </button>
      `;
    } else {
      const user = getCurrentUser();
      if (user.role === 'student') {
        let applyBtnHtml = '';
        if (hasApplied) {
          applyBtnHtml = `
            <button disabled class="w-full bg-green-100 text-green-800 font-semibold py-3 rounded-lg mb-4 cursor-not-allowed flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
              Already Applied
            </button>
          `;
        } else {
          applyBtnHtml = `
            <button id="apply-btn" class="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors mb-4">
              Apply Now
            </button>
          `;
        }

        const saveBtnHtml = `
          <button onclick="window.toggleSaveJob('${job._id}', this)" class="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <svg class="w-5 h-5 ${isSaved ? 'fill-blue-600 text-blue-600' : 'fill-none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
            ${isSaved ? 'Saved' : 'Save Job'}
          </button>
        `;

        actionsDiv.innerHTML = applyBtnHtml + saveBtnHtml;

        const applyBtn = document.getElementById('apply-btn');
        if (applyBtn) {
          applyBtn.addEventListener('click', () => {
            document.getElementById('application-modal').classList.remove('hidden');
          });
        }
      } else if (user.role === 'employer' && job.postedBy === user.id) {
         actionsDiv.innerHTML = `
          <button class="w-full bg-yellow-500 text-white font-semibold py-3 rounded-lg hover:bg-yellow-600 transition-colors mb-4">
            Edit Job
          </button>
        `;
      }
    }
  }
}

function setupApplicationForm(jobId) {
  const form = document.getElementById('application-form');
  const modal = document.getElementById('application-modal');
  const cancelBtn = document.getElementById('cancel-apply-btn');

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const resumeUrl = document.getElementById('resumeUrl').value;
      const coverLetter = document.getElementById('coverLetter').value;
      const submitBtn = form.querySelector('button[type="submit"]');
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      try {
        await apiRequest('/applications', {
          method: 'POST',
          body: JSON.stringify({ jobId, resumeUrl, coverLetter })
        });
        showToast('Application submitted successfully!', 'success');
        modal.classList.add('hidden');
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        showToast(error.message || 'Failed to submit application', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
      }
    });
  }
}
