document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  
  // Mobile hamburger menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Active link highlighting
  highlightActiveLink();

  // Sticky navbar
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 0) {
        header.classList.add('shadow-md');
      } else {
        header.classList.remove('shadow-md');
      }
    });
  }

  // Homepage specifics
  if (document.body.classList.contains('homepage')) {
    initHomepage();
  }

  // Footer year
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});

function initNavbar() {
  const loggedOutNav = document.getElementById('logged-out-nav');
  const studentNav = document.getElementById('student-nav');
  const employerNav = document.getElementById('employer-nav');
  const adminNav = document.getElementById('admin-nav');

  if (loggedOutNav) loggedOutNav.classList.add('hidden');
  if (studentNav) studentNav.classList.add('hidden');
  if (employerNav) employerNav.classList.add('hidden');
  if (adminNav) adminNav.classList.add('hidden');

  if (isLoggedIn()) {
    const user = getCurrentUser();
    if (user && user.role === 'student' && studentNav) {
      studentNav.classList.remove('hidden');
      studentNav.classList.add('flex');
    } else if (user && user.role === 'employer' && employerNav) {
      employerNav.classList.remove('hidden');
      employerNav.classList.add('flex');
    } else if (user && user.role === 'admin' && adminNav) {
      adminNav.classList.remove('hidden');
      adminNav.classList.add('flex');
    }
  } else {
    if (loggedOutNav) {
      loggedOutNav.classList.remove('hidden');
      loggedOutNav.classList.add('flex');
    }
  }

  // Attach logout handler
  document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  });
}

function highlightActiveLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath && currentPath !== '/') {
      link.classList.add('text-blue-600', 'font-semibold');
      link.classList.remove('text-gray-600');
    }
  });
}

function initHomepage() {
  // Hero search form
  const heroSearchForm = document.getElementById('hero-search-form');
  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = document.getElementById('hero-search-input')?.value || '';
      const loc = document.getElementById('hero-location-input')?.value || '';
      window.location.href = `/jobs.html?search=${encodeURIComponent(q)}&location=${encodeURIComponent(loc)}`;
    });
  }

  // Category clicks
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      if (category) {
        window.location.href = `/jobs.html?category=${encodeURIComponent(category)}`;
      }
    });
  });

  // Load featured jobs
  const featuredJobsContainer = document.getElementById('featured-jobs-container');
  if (featuredJobsContainer) {
    apiRequest('/jobs?limit=6&sort=newest').then(data => {
      const jobs = data.data || [];
      if (jobs.length === 0) {
        featuredJobsContainer.innerHTML = '<p class="text-gray-500 col-span-full text-center">No featured jobs available.</p>';
        return;
      }
      // get saved jobs if logged in
      if (isLoggedIn() && getCurrentUser()?.role === 'student') {
        apiRequest('/saved-jobs').then(savedData => {
          const savedIds = (savedData.data || []).map(j => j._id || j.job?._id);
          featuredJobsContainer.innerHTML = jobs.map(job => createJobCard(job, savedIds)).join('');
        });
      } else {
        featuredJobsContainer.innerHTML = jobs.map(job => createJobCard(job)).join('');
      }
    }).catch(err => {
      featuredJobsContainer.innerHTML = '<p class="text-red-500 col-span-full text-center">Failed to load featured jobs.</p>';
    });
  }

  // Load featured internships
  const featuredInternshipsContainer = document.getElementById('featured-internships-container');
  if (featuredInternshipsContainer) {
    apiRequest('/jobs?isInternship=true&limit=6').then(data => {
      const jobs = data.data || [];
      if (jobs.length === 0) {
        featuredInternshipsContainer.innerHTML = '<p class="text-gray-500 col-span-full text-center">No featured internships available.</p>';
        return;
      }
      if (isLoggedIn() && getCurrentUser()?.role === 'student') {
        apiRequest('/saved-jobs').then(savedData => {
          const savedIds = (savedData.data || []).map(j => j._id || j.job?._id);
          featuredInternshipsContainer.innerHTML = jobs.map(job => createJobCard(job, savedIds)).join('');
        });
      } else {
        featuredInternshipsContainer.innerHTML = jobs.map(job => createJobCard(job)).join('');
      }
    }).catch(err => {
      featuredInternshipsContainer.innerHTML = '<p class="text-red-500 col-span-full text-center">Failed to load featured internships.</p>';
    });
  }

  // Animate stats counters on scroll
  const stats = document.querySelectorAll('.stat-counter');
  let observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const count = parseInt(target.dataset.count);
        let curr = 0;
        const increment = Math.ceil(count / 50);
        const interval = setInterval(() => {
          curr += increment;
          if (curr >= count) {
            target.textContent = count + '+';
            clearInterval(interval);
          } else {
            target.textContent = curr + '+';
          }
        }, 30);
        observer.unobserve(target);
      }
    });
  });
  stats.forEach(stat => observer.observe(stat));

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      if (answer.classList.contains('hidden')) {
        answer.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
      } else {
        answer.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
      }
    });
  });
}
