# Internhub

Internhub is a job and internship discovery platform built as a college assignment. This is the **frontend build**: multi-page HTML/CSS/vanilla JavaScript, with an in-browser demo dataset standing in for a real API so the site is fully interactive without a backend.

**Tagline:** Find the opportunity. Build your future.

## Live demo data / accounts
No signup needed to explore — or use these demo accounts on the Login page:
- Student: `student@internhub.demo` / `student123`
- Employer: `employer@internhub.demo` / `employer123`

## Pages
- `index.html` — homepage with hero search, categories, featured jobs/internships, FAQ
- `jobs.html` — searchable, filterable job listings
- `internships.html` — same listing experience, internships only
- `job-details.html?id=<id>` — full job detail + apply flow
- `login.html` / `register.html` — auth (demo, backed by localStorage)
- `dashboard.html` — student dashboard: stats, applications, recommendations

## Tech
HTML5, CSS3 (custom design system, no framework), vanilla JavaScript (`fetch`-ready structure). No React/Vue/Angular, no Tailwind/Bootstrap, no TypeScript.

## Run locally
No build step. Serve the folder statically, e.g.:
```
npx serve .
```
or open `index.html` directly in a browser.

## Architecture note
`js/data.js` holds the demo dataset in the same shape a real `GET /api/jobs` response would use. `js/utils.js` centralizes the "API-like" calls (`getApplications`, `toggleSavedJob`, `getCurrentUser`, etc.) behind small functions — swapping these for real `fetch()` calls against an Express/MongoDB backend later is a localized change, not a rewrite.

## Next steps (not yet built)
Employer dashboard, post-job, applicants, admin dashboard, companies pages, profile/applications/saved-jobs pages, and the real Express + MongoDB Atlas backend described in the original spec were deferred to ship a working core flow (search → job details → apply → dashboard) fast, per request. Structure is ready to extend page-by-page.
