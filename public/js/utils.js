// ============================================================
// InternHub - Shared Utilities
// Used by every page for API calls, auth, UI helpers
// ============================================================

const API_BASE = '/api';

// ---------- Auth Helpers ----------

function getToken() {
  return localStorage.getItem('internhub_token');
}

function getCurrentUser() {
  const user = localStorage.getItem('internhub_user');
  try { return user ? JSON.parse(user) : null; }
  catch (e) { return null; }
}

function isLoggedIn() {
  return !!getToken();
}

function setAuth(token, user) {
  localStorage.setItem('internhub_token', token);
  localStorage.setItem('internhub_user', JSON.stringify(user));
}

function logout() {
  localStorage.removeItem('internhub_token');
  localStorage.removeItem('internhub_user');
  window.location.href = '/';
}

// ---------- API Request Helper ----------

async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(API_BASE + endpoint, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) }
  });

  let data;
  try { data = await response.json(); }
  catch (e) { data = {}; }

  if (!response.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = response.status;
    throw err;
  }
  return data;
}

// ---------- Formatting ----------

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

function timeAgo(dateString) {
  if (!dateString) return '';
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  return formatDate(dateString);
}

function formatSalary(salary) {
  if (!salary || (!salary.min && !salary.max)) return 'Not disclosed';
  const fmt = (n) => n >= 1000 ? `₹${Math.round(n / 1000)}k` : `₹${n}`;
  const period = salary.period || 'month';
  if (salary.min && salary.max) return `${fmt(salary.min)} – ${fmt(salary.max)}/${period}`;
  if (salary.min) return `From ${fmt(salary.min)}/${period}`;
  return `Up to ${fmt(salary.max)}/${period}`;
}

// ---------- URL Helpers ----------

function getUrlParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function setUrlParams(params) {
  const url = new URL(window.location.href);
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '')
      url.searchParams.set(key, params[key]);
    else
      url.searchParams.delete(key);
  });
  window.history.pushState({}, '', url);
}

function redirectToLogin() {
  sessionStorage.setItem('returnUrl', window.location.href);
  window.location.href = '/login.html';
}

// ---------- Avatar Helpers ----------

function getInitials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarColor(name) {
  const colors = [
    '#2563eb','#7c3aed','#db2777','#059669','#d97706',
    '#dc2626','#0891b2','#4f46e5','#65a30d','#ea580c'
  ];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

// ---------- Auth Guards ----------

function requireAuth(allowedRoles = []) {
  if (!isLoggedIn()) { redirectToLogin(); return false; }
  const user = getCurrentUser();
  if (allowedRoles.length > 0 && (!user || !allowedRoles.includes(user.role))) {
    alert('Access denied. You do not have permission to view this page.');
    window.location.href = '/';
    return false;
  }
  return true;
}

// ---------- Toast Notifications ----------

function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const typeClass = type === 'success' ? 'toast-success'
    : type === 'error' ? 'toast-error'
    : type === 'warning' ? 'toast-warning'
    : 'toast-info';

  toast.className = `toast ${typeClass}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;margin-left:1rem;font-size:1.2rem;">&times;</button>
  `;
  toast.style.cssText = 'display:flex;align-items:center;justify-content:space-between;';

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

// ---------- Loading Skeletons ----------

function showSkeletons(containerId, count = 6) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="card" style="animation:pulse 1.5s infinite">
        <div style="display:flex;gap:1rem;margin-bottom:1rem;">
          <div class="skeleton" style="width:48px;height:48px;border-radius:8px;flex-shrink:0;"></div>
          <div style="flex:1;">
            <div class="skeleton" style="height:16px;width:70%;margin-bottom:8px;"></div>
            <div class="skeleton" style="height:12px;width:45%;"></div>
          </div>
        </div>
        <div class="skeleton" style="height:12px;width:90%;margin-bottom:6px;"></div>
        <div class="skeleton" style="height:12px;width:60%;margin-bottom:1rem;"></div>
        <div style="display:flex;gap:0.5rem;">
          <div class="skeleton" style="height:24px;width:60px;border-radius:9999px;"></div>
          <div class="skeleton" style="height:24px;width:60px;border-radius:9999px;"></div>
        </div>
      </div>
    `;
  }
  container.innerHTML = html;
}

// ---------- Empty State ----------

function showEmptyState(containerId, message, ctaText = null, ctaHref = null) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="empty-state" style="grid-column:1/-1;">
      <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin:0 auto 1rem;display:block;color:#9ca3af;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <h3 style="font-size:1.1rem;font-weight:600;color:#374151;margin-bottom:0.5rem;">Nothing here yet</h3>
      <p style="color:#6b7280;max-width:320px;margin:0 auto 1.5rem;">${message}</p>
      ${ctaText && ctaHref ? `<a href="${ctaHref}" class="btn btn-primary">${ctaText}</a>` : ''}
    </div>
  `;
}

// ---------- Job Card ----------

function createJobCard(job, savedJobIds = []) {
  const isSaved = savedJobIds.includes(String(job._id));
  const companyName = (job.company && job.company.name) ? job.company.name : 'Company';
  const color = getAvatarColor(companyName);
  const initials = getInitials(companyName);
  const user = getCurrentUser();
  const isStudent = user && user.role === 'student';

  const skillsHtml = (job.skills || []).slice(0, 3).map(s =>
    `<span class="badge badge-primary" style="font-size:0.72rem;">${escHtml(s)}</span>`
  ).join('');

  const saveBtn = isStudent ? `
    <button
      class="save-btn${isSaved ? ' saved' : ''}"
      data-job-id="${job._id}"
      title="${isSaved ? 'Unsave' : 'Save Job'}"
      style="background:none;border:none;cursor:pointer;padding:4px;color:${isSaved ? 'var(--color-primary)' : '#9ca3af'};"
      onclick="window.toggleSaveJob('${job._id}', this)">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
      </svg>
    </button>` : '';

  return `
    <article class="job-card card card-hover" data-id="${job._id}">
      <div class="job-card-top">
        <div class="company-avatar" style="background:${color};">${initials}</div>
        <div class="job-card-header">
          <div>
            <h3 class="job-title"><a href="/job-details.html?id=${job._id}">${escHtml(job.title)}</a></h3>
            <p class="job-company">${escHtml(companyName)}</p>
          </div>
          ${saveBtn}
        </div>
      </div>
      <div class="job-card-meta">
        <span class="job-meta-item">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          ${escHtml(job.location)}
        </span>
        <span class="job-meta-item">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          ${formatSalary(job.salary)}
        </span>
      </div>
      <div class="job-card-tags">
        <span class="badge badge-info">${escHtml(job.jobType)}</span>
        <span class="badge badge-warning">${escHtml(job.experience || '0-1 years')}</span>
        ${skillsHtml}
      </div>
      <div class="job-card-footer">
        <span class="job-posted-date">Posted ${timeAgo(job.createdAt)}</span>
        <a href="/job-details.html?id=${job._id}" class="btn btn-outline btn-sm">View Job</a>
      </div>
    </article>
  `;
}

// ---------- Company Card ----------

function createCompanyCard(company) {
  const color = getAvatarColor(company.name);
  const initials = getInitials(company.name);
  return `
    <article class="company-card card card-hover" style="text-align:center;">
      <div class="company-avatar-lg" style="background:${color};margin:0 auto 1rem;">${initials}</div>
      <h3 style="font-size:1.1rem;font-weight:700;color:var(--color-dark);margin-bottom:0.25rem;">${escHtml(company.name)}</h3>
      <p style="font-size:0.85rem;color:var(--color-muted);margin-bottom:0.5rem;">${escHtml(company.industry || '')} &bull; ${escHtml(company.location || '')}</p>
      <p style="font-size:0.875rem;color:var(--color-text);margin-bottom:1.25rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${escHtml(company.description || '')}</p>
      <a href="/company-details.html?id=${company._id}" class="btn btn-outline" style="width:100%;">View Company</a>
    </article>
  `;
}

// ---------- HTML Escape ----------

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ---------- Global Save/Unsave ----------

window.toggleSaveJob = async function(jobId, btn) {
  if (!isLoggedIn()) { redirectToLogin(); return; }
  const svg = btn.querySelector('svg');
  const isSaved = svg && svg.getAttribute('fill') === 'currentColor';
  try {
    if (isSaved) {
      await apiRequest(`/saved-jobs/${jobId}`, { method: 'DELETE' });
      svg.setAttribute('fill', 'none');
      btn.style.color = '#9ca3af';
      btn.title = 'Save Job';
      showToast('Job removed from saved list', 'info');
    } else {
      await apiRequest(`/saved-jobs/${jobId}`, { method: 'POST' });
      svg.setAttribute('fill', 'currentColor');
      btn.style.color = 'var(--color-primary)';
      btn.title = 'Unsave';
      showToast('Job saved!', 'success');
    }
  } catch (err) {
    showToast(err.message || 'Error updating saved jobs', 'error');
  }
};
