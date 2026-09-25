document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth(['student'])) return;

  const form = document.getElementById('profile-form');
  if (!form) return;

  try {
    const data = await apiRequest('/users/profile');
    const profile = data.data;

    // Populate standard fields
    ['name', 'email', 'phone', 'location', 'headline', 'bio', 'resumeUrl', 'githubUrl', 'linkedinUrl', 'portfolioUrl'].forEach(f => {
      const el = document.getElementById(f);
      if (el && profile[f]) el.value = profile[f];
    });

    // Populate skills
    const skillsInput = document.getElementById('skills-input');
    const skillsContainer = document.getElementById('skills-container');
    let skills = profile.skills || [];
    
    const renderSkills = () => {
      skillsContainer.innerHTML = skills.map((s, i) => `
        <span class="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
          ${s}
          <button type="button" onclick="removeSkill(${i})" class="hover:text-blue-900">&times;</button>
        </span>
      `).join('');
    };

    window.removeSkill = (index) => {
      skills.splice(index, 1);
      renderSkills();
    };

    if (skillsInput) {
      skillsInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          const val = skillsInput.value.trim().replace(',', '');
          if (val && !skills.includes(val)) {
            skills.push(val);
            renderSkills();
          }
          skillsInput.value = '';
        }
      });
    }
    renderSkills();

    // Populate education
    const eduContainer = document.getElementById('education-container');
    const addEduBtn = document.getElementById('add-education-btn');
    let education = profile.education || [];

    const renderEducation = () => {
      eduContainer.innerHTML = education.map((edu, i) => `
        <div class="border border-gray-200 p-4 rounded-lg relative">
          <button type="button" onclick="removeEducation(${i})" class="absolute top-4 right-4 text-red-500 hover:text-red-700">&times; Remove</button>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Institution</label>
              <input type="text" value="${edu.institution || ''}" onchange="updateEdu(${i}, 'institution', this.value)" class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Degree</label>
              <input type="text" value="${edu.degree || ''}" onchange="updateEdu(${i}, 'degree', this.value)" class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
              <input type="text" value="${edu.fieldOfStudy || ''}" onchange="updateEdu(${i}, 'fieldOfStudy', this.value)" class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
              <input type="text" value="${edu.graduationYear || ''}" onchange="updateEdu(${i}, 'graduationYear', this.value)" class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>
          </div>
        </div>
      `).join('');
    };

    window.removeEducation = (index) => {
      education.splice(index, 1);
      renderEducation();
    };

    window.updateEdu = (index, field, value) => {
      education[index][field] = value;
    };

    if (addEduBtn) {
      addEduBtn.addEventListener('click', () => {
        education.push({ institution: '', degree: '', fieldOfStudy: '', graduationYear: '' });
        renderEducation();
      });
    }
    renderEducation();

    // Submit form
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';

      const payload = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        headline: document.getElementById('headline').value,
        bio: document.getElementById('bio').value,
        resumeUrl: document.getElementById('resumeUrl').value,
        githubUrl: document.getElementById('githubUrl').value,
        linkedinUrl: document.getElementById('linkedinUrl').value,
        portfolioUrl: document.getElementById('portfolioUrl').value,
        skills,
        education
      };

      try {
        await apiRequest('/users/profile', {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showToast('Profile updated successfully!', 'success');
        
        // Update local user info
        const user = getCurrentUser();
        user.name = payload.name;
        localStorage.setItem('internhub_user', JSON.stringify(user));
        
      } catch (error) {
        showToast(error.message || 'Error updating profile', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });

  } catch (error) {
    showToast('Failed to load profile data', 'error');
  }
});
