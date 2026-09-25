<<<<<<< HEAD
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
=======
# InternHub

> **"Find the opportunity. Build your future."**

InternHub is a full-stack job and internship discovery platform designed specifically for college students, early-career professionals, employers, and administrators. Built with clean, beginner-readable code using pure HTML5, CSS3, Vanilla JavaScript, Node.js, Express.js, and MongoDB Atlas with Mongoose.

---

## 🌟 Key Features

### 🎓 For Students / Job Seekers
* **Authentication:** Secure registration, login with JWT tokens, and persistent sessions.
* **Explore & Filter:** Search jobs and internships by keywords, location (Mumbai, Pune, Bengaluru, Hyderabad, Delhi, Chennai, Remote), job type, category, and experience.
* **Job & Company Details:** Comprehensive job specs (responsibilities, requirements, benefits, salary ranges, deadlines) and detailed company profiles with open position listings.
* **One-Click Application:** Apply with your resume link and a customized cover letter. Duplicate applications to the same job are automatically prevented.
* **Application Tracker:** Live tracking of all your applications with distinct statuses: `Applied`, `Shortlisted`, `Interview`, `Rejected`, and `Selected`.
* **Save/Bookmark Jobs:** Bookmark opportunities to review and apply later.
* **Student Profile:** Manage personal info, professional headline, bio, skills tags, education history, and portfolio/resume links.

### 🏢 For Employers / Recruiters
* **Employer Dashboard:** Key statistics on active listings, total applications received, shortlisted candidates, and interviews.
* **Company Profile Management:** Create and update company brand identity, industry, location, size, and website.
* **Job & Internship Posting:** Multi-field posting form with dynamic responsibility/requirement builders, salary ranges, categories, and deadlines.
* **Applicant Review & Status Management:** View full candidate profiles, review cover letters and resume links, and promote candidates through the hiring pipeline (`Applied` ➔ `Shortlisted` ➔ `Interview` ➔ `Selected` / `Rejected`).

### 🛡️ For Administrators
* **Admin Dashboard:** Platform-wide oversight with real-time statistics (total users, active jobs, applications, registered companies).
* **Content Moderation:** Ability to remove inappropriate listings and manage users.

### 📬 Platform & Communication
* **Contact Us:** Functional contact form connected to MongoDB for student and employer queries.
* **Responsive UI:** Custom-crafted responsive layouts that adapt smoothly across desktop, tablet, and mobile screens without external UI frameworks.

---

## 🏗️ System Architecture

```text
+-----------------------------------------------------------------------+
|                               BROWSER                                 |
|          Semantic HTML5  |  Custom CSS3  |  Vanilla JavaScript        |
|                                                                       |
|   Pages: index, jobs, internships, job-details, companies,            |
|          company-details, login, register, dashboard, profile,        |
|          applications, saved-jobs, employer-dashboard, post-job,      |
|          applicants, admin-dashboard, about, contact                  |
+-----------------------------------+-----------------------------------+
                                    |
                    REST API Calls  |  fetch() with Bearer JWT
                                    v
+-----------------------------------------------------------------------+
|                          EXPRESS.JS BACKEND                           |
|                               (app.js)                                |
|                                                                       |
|   +---------------------------------------------------------------+   |
|   |                         MIDDLEWARE                            |   |
|   |     helmet()  |  cors()  |  express.json()  |  express.static |   |
|   |     authMiddleware (JWT verify) | roleMiddleware (RBAC)       |   |
|   |     errorHandler (centralized error handling)                 |   |
|   +-------------------------------+-------------------------------+   |
|                                   |
|   +-------------------------------v-------------------------------+   |
|   |                           ROUTES                              |   |
|   |   /api/auth       | /api/users        | /api/jobs             |   |
|   |   /api/companies  | /api/applications | /api/saved-jobs       |   |
|   |   /api/contact    | /api/admin        | /api/health           |   |
|   +-------------------------------+-------------------------------+   |
|                                   |
|   +-------------------------------v-------------------------------+   |
|   |                        CONTROLLERS                            |   |
|   |   Business logic, input validation, bcrypt password hashing   |   |
|   +-------------------------------+-------------------------------+   |
+-----------------------------------+-----------------------------------+
                                    |
                        Mongoose 8  |  Models & Queries
                                    v
+-----------------------------------------------------------------------+
|                            MONGODB ATLAS                              |
|                                                                       |
|   Collections: users, companies, jobs, applications, savedjobs,       |
|                contactmessages                                        |
+-----------------------------------------------------------------------+
```

---

## 🗂️ Project Directory Structure

```text
internhub/
├── public/
│   ├── index.html               # Landing page with hero, search, stats, categories, FAQs
│   ├── jobs.html                # Job listings with sidebar filters & search
│   ├── internships.html         # Internships discovery page
│   ├── job-details.html         # Job specifications & application modal/form
│   ├── companies.html           # Directory of registered companies
│   ├── company-details.html     # Company profile & open vacancies
│   ├── about.html               # About InternHub, mission & values
│   ├── contact.html             # Contact page with MongoDB-backed form
│   ├── login.html               # Clean login interface with demo hints
│   ├── register.html            # Registration form with role selector (Student/Employer)
│   ├── dashboard.html           # Student overview & statistics
│   ├── profile.html             # Student resume, skills, and education manager
│   ├── applications.html        # Track student submitted applications
│   ├── saved-jobs.html          # Bookmarked opportunities
│   ├── employer-dashboard.html  # Recruiter metrics & job listings overview
│   ├── post-job.html            # Multi-section job & internship posting form
│   ├── applicants.html          # Candidate review & hiring status pipeline
│   ├── admin-dashboard.html     # Administrative metrics and management
│   │
│   ├── css/
│   │   ├── style.css            # CSS variables, resets, badges, buttons, typography
│   │   ├── navbar.css           # Navigation bar with desktop & mobile drawer
│   │   ├── hero.css             # Hero layout, unified search bar, and FAQs
│   │   ├── cards.css            # Card designs for jobs, companies, stats, & avatars
│   │   ├── forms.css            # Form inputs, labels, buttons, and error states
│   │   ├── dashboard.css        # Dashboard sidebar, tables, and stat counters
│   │   └── responsive.css       # Mobile and tablet media queries
│   │
│   └── js/
│       ├── utils.js             # API helpers, JWT storage, toast notifications, formatting
│       ├── main.js              # Global navbar auth-awareness, mobile menu, home features
│       ├── auth.js              # Login, register, validation, and role redirection
│       ├── jobs.js              # Job listings fetcher, URL filter sync, save toggle
│       ├── internships.js       # Internships-specific filtering and rendering
│       ├── job-details.js       # Single job rendering, company info, and application flow
│       ├── companies.js         # Company directory search and company page
│       ├── dashboard.js         # Student overview stats and recommended jobs
│       ├── profile.js           # Student profile fetch and PUT updates
│       ├── applications.js      # Student applications list and status view
│       ├── saved-jobs.js        # Bookmarked jobs manager
│       ├── employer.js          # Employer statistics, job creation, and applicant pipeline
│       └── admin.js             # Admin statistics and moderation tables
│
├── backend/
│   ├── config/
│   │   └── db.js                # Resilient Mongoose connection to MongoDB Atlas
│   ├── models/
│   │   ├── User.js              # User schema with bcrypt password hashing & methods
│   │   ├── Company.js           # Company details and ownership ref
│   │   ├── Job.js               # Job & internship schema with indexed queries
│   │   ├── Application.js       # Candidate applications with duplicate prevention index
│   │   ├── SavedJob.js          # User bookmarks with compound unique index
│   │   └── ContactMessage.js    # Contact form submissions
│   ├── routes/
│   │   ├── authRoutes.js        # Register, login, me
│   │   ├── userRoutes.js        # Profile retrieval & updates
│   │   ├── companyRoutes.js     # Company directory & creation
│   │   ├── jobRoutes.js         # Jobs CRUD & filtered search
│   │   ├── applicationRoutes.js # Apply, candidate status, and listings
│   │   ├── savedJobRoutes.js    # Bookmark and remove jobs
│   │   ├── contactRoutes.js     # Contact inquiries
│   │   └── adminRoutes.js       # Administrative oversight & deletions
│   ├── controllers/             # Clean MVC controller logic for all routes
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification
│   │   ├── roleMiddleware.js    # Role-based authorization
│   │   └── errorMiddleware.js   # Centralized error handler
│   └── seed/
│       └── seedData.js          # Database seeder with realistic demo data
│
├── app.js                       # Primary Express entry point
├── package.json                 # Project configuration & scripts
├── vercel.json                  # Vercel Serverless deployment routing
├── .env.example                 # Template for environment variables
├── .gitignore                   # Ignores node_modules, .env, and logs
└── README.md                    # Comprehensive documentation
```

---

## 💻 Tech Stack

* **Frontend:** HTML5, Semantic Elements, CSS3 (Custom Variables, Flexbox, Grid), Vanilla JavaScript (ES6+, `fetch()`, `async`/`await`). No external UI frameworks (No Tailwind, No Bootstrap, No React).
* **Backend:** Node.js (>= 18.x), Express.js (REST API, static file serving).
* **Security:** `helmet` for HTTP headers, `cors` for cross-origin security, `bcryptjs` (salt rounds 12) for password hashing, `jsonwebtoken` (JWT) for stateless authentication.
* **Database:** MongoDB Atlas with Mongoose schemas, compound unique indexes, and referential population.
* **Deployment Target:** Vercel (serverless Express integration).

---

## 🔑 Demo Accounts (Pre-configured via Seed)

When you run the database seeder, the following realistic accounts are created:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Student** | `student@internhub.dev` | `Student@12345` | Browse, apply to jobs, save listings, manage profile, track applications |
| **Student 2** | `sneha@internhub.dev` | `Student@12345` | Candidate account |
| **Employer** | `employer@internhub.dev` | `Employer@12345` | Post jobs & internships, manage applicants, change application statuses |
| **Employer 2** | `priya@internhub.dev` | `Employer@12345` | Recruiter account for FinEdge & PixelWorks |
| **Admin** | `admin@internhub.dev` | `Admin@12345` | View platform statistics, moderate jobs, delete users |

---

## 🛠️ Step-by-Step Local Setup

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (Version 18.x or newer installed)
* Git installed on your machine
* A free [MongoDB Atlas](https://www.mongodb.com/atlas) account

### 2. Clone or Navigate to the Workspace
```bash
cd internhub
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory by copying the example template:
```bash
cp .env.example .env
```
Open `.env` and fill in your actual credentials:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/internhub?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_internhub_college_project_2026
NODE_ENV=development
```

---

## 🍃 MongoDB Atlas Setup Guide

1. **Sign Up / Log In:** Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database) and sign in.
2. **Create a Cluster:** Select the free **M0 (Shared)** tier, pick your closest cloud region (e.g., Mumbai, AWS `ap-south-1`), and click **Create Deployment**.
3. **Set Up Database User:**
   * In Atlas, go to **Database Access** under Security.
   * Click **Add New Database User**.
   * Choose **Password Authentication**, enter a username (e.g., `internhub_admin`) and a secure password.
   * Assign Built-in Role: **Read and write to any database**. Click **Add User**.
4. **Configure Network Access (Whitelisting IP):**
   * Go to **Network Access** under Security.
   * Click **Add IP Address**.
   * Click **Allow Access from Anywhere** (`0.0.0.0/0`) or add your current IP address. Click **Confirm**.
5. **Get Your Connection String:**
   * Go to **Database** ➔ click **Connect** on your cluster.
   * Select **Drivers** (Node.js).
   * Copy the connection string. It will look like:
     `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   * Replace `<username>` and `<password>` with your database user credentials.
   * Add `/internhub` before the `?` query parameters so it targets the `internhub` database:
     `mongodb+srv://internhub_admin:MyPassword123@cluster0.xxxxx.mongodb.net/internhub?retryWrites=true&w=majority`
   * Paste this into your `.env` file as `MONGO_URI`.

---

## 🌱 Seeding Demo Data

Once your `MONGO_URI` is populated in `.env`, run the automated seeder:

```bash
npm run seed
```

This will automatically create:
* 5 demo users with securely hashed passwords
* 6 realistic partner companies (NovaTech, CodeSphere, FinEdge, PixelWorks, CloudNexa, BrightLabs)
* 10 full-time jobs with skills, salaries, and requirements
* 8 paid/unpaid internships with stipends and requirements

---

## 🚀 Running the Application

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

Open your browser and navigate to:
* **Home Page:** [http://localhost:5000](http://localhost:5000)
* **Jobs Directory:** [http://localhost:5000/jobs.html](http://localhost:5000/jobs.html)
* **Internships:** [http://localhost:5000/internships.html](http://localhost:5000/internships.html)
* **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📡 REST API Reference

All API requests return standardized JSON responses:
* **Success:** `{ "success": true, "message": "...", "data": ... }`
* **Error:** `{ "success": false, "message": "..." }`

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Create a new account (`name`, `email`, `password`, `role`).
* `POST /api/auth/login` — Authenticate and receive a Bearer JWT.
* `GET /api/auth/me` — Retrieve logged-in user details (Protected).

### Jobs & Internships (`/api/jobs`)
* `GET /api/jobs` — Retrieve active jobs with search & filters (`?search=node&location=Bengaluru&type=Full+Time&category=Software+Development&isInternship=true`).
* `GET /api/jobs/:id` — Retrieve a single job's full details and company data.
* `POST /api/jobs` — Post a new job or internship (Employer only).
* `PUT /api/jobs/:id` — Update an existing job (Job owner or Admin).
* `DELETE /api/jobs/:id` — Delete a job (Job owner or Admin).

### Applications (`/api/applications`)
* `POST /api/applications` — Submit application with `jobId`, `resumeUrl`, and `coverLetter` (Student only).
* `GET /api/applications/my` — Get all applications submitted by the logged-in student.
* `GET /api/applications/job/:jobId` — Get all applicants for a specific job (Employer only).
* `PUT /api/applications/:id/status` — Update candidate status: `Applied` | `Shortlisted` | `Interview` | `Rejected` | `Selected` (Employer only).

### Bookmarked Jobs (`/api/saved-jobs`)
* `GET /api/saved-jobs` — Get list of jobs saved by the student.
* `POST /api/saved-jobs/:jobId` — Save a job bookmark.
* `DELETE /api/saved-jobs/:jobId` — Remove a job bookmark.

### User Profile (`/api/users`)
* `GET /api/users/profile` — Get full student profile with skills, education, and resume.
* `PUT /api/users/profile` — Update candidate profile information.

### Companies (`/api/companies`)
* `GET /api/companies` — List all registered companies.
* `POST /api/companies` — Create a company profile (Employer only).
* `GET /api/companies/:id` — Get single company details and associated open roles.
* `PUT /api/companies/:id` — Edit company details (Company owner).

### Contact & Support (`/api/contact`)
* `POST /api/contact` — Submit an inquiry message (`name`, `email`, `subject`, `message`).

### Admin (`/api/admin`)
* `GET /api/admin/stats` — Overall counts of users, listings, companies, and applications.
* `GET /api/admin/users` — List all users with moderation options.
* `DELETE /api/admin/users/:id` — Delete a user.
* `DELETE /api/admin/jobs/:id` — Remove inappropriate job listings.

---

## ☁️ Vercel Deployment Guide

InternHub is structured to deploy smoothly to Vercel as a full-stack project using Vercel Serverless Functions (`@vercel/node`) for the Express backend and native static hosting for the `public/` directory via `vercel.json`.

### Step 1: Push Project to GitHub
1. Create a new repository on your GitHub account (e.g., `internhub`).
2. Run in your terminal:
   ```bash
   git init -b main
   git add .
   git commit -m "Initial commit: Complete InternHub full-stack platform"
   git remote add origin https://github.com/<your-username>/internhub.git
   git push -u origin main
   ```

### Step 2: Import into Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** ➔ **Project**.
3. Import your `internhub` GitHub repository.
4. Keep the Framework Preset as **Other** (Root directory: `./`).

### Step 3: Configure Environment Variables in Vercel
Under the **Environment Variables** section in Vercel project settings, add:
* `MONGO_URI` = `<your MongoDB Atlas connection string>`
* `JWT_SECRET` = `<your secure JWT secret string>`
* `NODE_ENV` = `production`

### Step 4: Deploy & Verify
1. Click **Deploy**.
2. Once the build finishes, verify:
   * Homepage: `https://your-project.vercel.app/`
   * Health Check: `https://your-project.vercel.app/api/health`
   * Jobs Page: `https://your-project.vercel.app/jobs.html`
   * Login & Application Flows

---

## 🔒 Security Best Practices Implemented

* **No Hardcoded Credentials:** All secrets (database URI, JWT secret) reside in `.env` and are strictly ignored by `.gitignore`.
* **Password Hashing:** Passwords are never stored in plain text; they are hashed with a 12-round bcrypt salt via Mongoose pre-save hooks.
* **Role-Based Access Control (RBAC):** Middleware validates roles on every protected endpoint (`student`, `employer`, `admin`).
* **Duplicate Protection:** Compound unique indexes prevent duplicate applications and duplicate bookmarks in MongoDB.
* **Secure Headers:** Express utilizes `helmet` for XSS protection, MIME sniffing prevention, and security headers.

---

## 📄 License
This project was created for educational and assignment purposes. Built with ❤️ for college project demonstrations.
>>>>>>> 388a84939b4d0f3815b7eaa74104314a1a096ae0
