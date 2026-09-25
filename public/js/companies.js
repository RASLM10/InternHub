document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('companies-container');
  const searchInput = document.getElementById('company-search');
  if (!container) return;

  showSkeletons('companies-container', 8);

  try {
    const data = await apiRequest('/companies');
    let companies = data.data || [];
    
    const render = (list) => {
      if (list.length === 0) {
        showEmptyState('companies-container', 'No companies found matching your criteria.');
        return;
      }
      container.innerHTML = list.map(c => createCompanyCard(c)).join('');
    };

    render(companies);

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = companies.filter(c => 
          c.name.toLowerCase().includes(query) || 
          (c.industry && c.industry.toLowerCase().includes(query))
        );
        render(filtered);
      });
    }
  } catch (error) {
    container.innerHTML = `<p class="text-red-500 col-span-full py-10 text-center">Error loading companies: ${error.message}</p>`;
  }
});
