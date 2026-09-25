require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const ContactMessage = require('../models/ContactMessage');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        // Clear all existing data
        await User.deleteMany();
        await Company.deleteMany();
        await Job.deleteMany();
        await Application.deleteMany();
        await SavedJob.deleteMany();
        await ContactMessage.deleteMany();
        console.log('Collections cleared');

        // Create Users
        const usersData = [
            { name: 'Admin User', email: 'admin@internhub.dev', password: 'Admin@12345', role: 'admin' },
            { name: 'Rahul Sharma', email: 'employer@internhub.dev', password: 'Employer@12345', role: 'employer' },
            { name: 'Priya Patel', email: 'priya@internhub.dev', password: 'Employer@12345', role: 'employer' },
            { name: 'Arjun Mehta', email: 'student@internhub.dev', password: 'Student@12345', role: 'student' },
            { name: 'Sneha Reddy', email: 'sneha@internhub.dev', password: 'Student@12345', role: 'student' }
        ];

        const createdUsers = await User.create(usersData);
        console.log('Users created');

        const employer1Id = createdUsers[1]._id;
        const employer2Id = createdUsers[2]._id;

        // Create Companies
        const companiesData = [
            { name: 'NovaTech Solutions', industry: 'Technology', location: 'Bengaluru', companySize: '501-1000', foundedYear: 2015, description: 'Leading cloud and AI solutions provider.', createdBy: employer1Id },
            { name: 'CodeSphere', industry: 'Technology', location: 'Pune', companySize: '51-200', foundedYear: 2018, description: 'Innovative software development firm.', createdBy: employer1Id },
            { name: 'FinEdge Analytics', industry: 'Finance', location: 'Mumbai', companySize: '201-500', foundedYear: 2016, description: 'Data-driven financial consulting and analytics.', createdBy: employer2Id },
            { name: 'PixelWorks Studio', industry: 'Technology', location: 'Delhi', companySize: '11-50', foundedYear: 2020, description: 'Creative UI/UX design studio.', createdBy: employer2Id },
            { name: 'CloudNexa', industry: 'Technology', location: 'Hyderabad', companySize: '1000+', foundedYear: 2010, description: 'Enterprise cloud transformation experts.', createdBy: employer1Id },
            { name: 'BrightLabs', industry: 'Technology', location: 'Chennai', companySize: '51-200', foundedYear: 2019, description: 'Next-gen product development lab.', createdBy: employer2Id }
        ];

        const createdCompanies = await Company.create(companiesData);
        console.log('Companies created');

        // Helper date generator
        const futureDate = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

        // Create Jobs
        const jobsData = [
            {
                title: 'Senior Backend Developer', company: createdCompanies[0]._id, postedBy: employer1Id,
                location: 'Bengaluru', jobType: 'Full Time', category: 'Software Development', experience: '3-5 years',
                salary: { min: 80000, max: 120000 },
                skills: ['Node.js', 'MongoDB', 'Express', 'Redis'],
                responsibilities: ['Design APIs', 'Optimize DB queries', 'Mentor juniors'],
                requirements: ['3+ years in backend tech', 'Strong CS fundamentals', 'Experience with microservices'],
                benefits: ['Health Insurance', 'Remote work options', 'Annual bonuses'],
                deadline: futureDate(60), isInternship: false, description: 'Looking for an experienced backend dev to scale our cloud services.'
            },
            {
                title: 'Frontend Developer', company: createdCompanies[1]._id, postedBy: employer1Id,
                location: 'Pune', jobType: 'Full Time', category: 'Software Development', experience: '1-2 years',
                salary: { min: 50000, max: 70000 },
                skills: ['React', 'JavaScript', 'CSS', 'Redux'],
                responsibilities: ['Build UI components', 'Integrate with REST APIs', 'Improve performance'],
                requirements: ['1+ year in React', 'Good eye for design', 'Version control skills'],
                benefits: ['Flexible hours', 'Gym membership', 'Snacks'],
                deadline: futureDate(90), isInternship: false, description: 'Join our agile team to build responsive modern web applications.'
            },
            {
                title: 'Data Analyst', company: createdCompanies[2]._id, postedBy: employer2Id,
                location: 'Mumbai', jobType: 'Full Time', category: 'Data Science', experience: '2-3 years',
                salary: { min: 60000, max: 90000 },
                skills: ['Python', 'SQL', 'Tableau', 'Excel'],
                responsibilities: ['Analyze datasets', 'Create dashboards', 'Present insights'],
                requirements: ['Degree in Stats/CS', 'Strong SQL skills', 'Data visualization experience'],
                benefits: ['Performance bonus', 'Paid time off', 'Training budget'],
                deadline: futureDate(60), isInternship: false, description: 'Help our clients make data-driven financial decisions.'
            },
            {
                title: 'UI/UX Designer', company: createdCompanies[3]._id, postedBy: employer2Id,
                location: 'Delhi', jobType: 'Full Time', category: 'UI/UX Design', experience: '1-2 years',
                salary: { min: 45000, max: 65000 },
                skills: ['Figma', 'Adobe XD', 'Prototyping'],
                responsibilities: ['Create wireframes', 'Design user interfaces', 'Conduct user research'],
                requirements: ['Portfolio required', 'Understanding of color theory', 'Basic HTML/CSS is a plus'],
                benefits: ['Creative environment', 'MacBook provided', 'Work from anywhere'],
                deadline: futureDate(90), isInternship: false, description: 'Design delightful experiences for web and mobile products.'
            },
            {
                title: 'DevOps Engineer', company: createdCompanies[4]._id, postedBy: employer1Id,
                location: 'Hyderabad', jobType: 'Full Time', category: 'Software Development', experience: '3-5 years',
                salary: { min: 90000, max: 130000 },
                skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
                responsibilities: ['Manage infrastructure', 'Setup CI/CD pipelines', 'Ensure high availability'],
                requirements: ['Experience with AWS', 'Strong scripting skills', 'Knowledge of security best practices'],
                benefits: ['Stock options', 'Premium health coverage', 'Relocation assistance'],
                deadline: futureDate(60), isInternship: false, description: 'Lead the infrastructure automation and scaling for our enterprise clients.'
            },
            {
                title: 'Product Manager', company: createdCompanies[5]._id, postedBy: employer2Id,
                location: 'Chennai', jobType: 'Full Time', category: 'Product', experience: '2-3 years',
                salary: { min: 70000, max: 100000 },
                skills: ['Agile', 'Scrum', 'Jira', 'Roadmapping'],
                responsibilities: ['Define product vision', 'Manage backlog', 'Coordinate with engineering'],
                requirements: ['Previous PM experience', 'Excellent communication', 'Analytical mindset'],
                benefits: ['Equity', 'Annual retreat', 'Education stipend'],
                deadline: futureDate(90), isInternship: false, description: 'Drive the development of next-generation SaaS products.'
            },
            {
                title: 'Cybersecurity Analyst', company: createdCompanies[0]._id, postedBy: employer1Id,
                location: 'Bengaluru', jobType: 'Full Time', category: 'Cybersecurity', experience: '2-3 years',
                salary: { min: 75000, max: 110000 },
                skills: ['Network Security', 'Penetration Testing', 'SIEM'],
                responsibilities: ['Monitor networks', 'Conduct vulnerability assessments', 'Respond to incidents'],
                requirements: ['CEH or CISSP certification', 'Experience with security tools', 'Attention to detail'],
                benefits: ['Health insurance', 'Remote work options', 'Continuous training'],
                deadline: futureDate(60), isInternship: false, description: 'Protect our infrastructure and data from emerging threats.'
            },
            {
                title: 'Marketing Manager', company: createdCompanies[2]._id, postedBy: employer2Id,
                location: 'Mumbai', jobType: 'Full Time', category: 'Marketing', experience: '1-2 years',
                salary: { min: 40000, max: 60000 },
                skills: ['SEO', 'Content Marketing', 'Google Analytics'],
                responsibilities: ['Execute marketing campaigns', 'Manage social media', 'Analyze campaign metrics'],
                requirements: ['Degree in Marketing', 'Creative writing skills', 'Experience with ad platforms'],
                benefits: ['Performance bonus', 'Flexible hours', 'Team lunches'],
                deadline: futureDate(90), isInternship: false, description: 'Lead our digital marketing initiatives and grow our brand presence.'
            },
            {
                title: 'Full Stack Developer', company: createdCompanies[1]._id, postedBy: employer1Id,
                location: 'Remote', jobType: 'Full Time', category: 'Software Development', experience: '1-2 years',
                salary: { min: 55000, max: 80000 },
                skills: ['MERN Stack', 'JavaScript', 'Git'],
                responsibilities: ['Develop end-to-end features', 'Collaborate with cross-functional teams', 'Write clean code'],
                requirements: ['Experience with React and Node.js', 'Problem-solving skills', 'Self-starter'],
                benefits: ['100% Remote', 'Home office setup budget', 'Flexible schedule'],
                deadline: futureDate(60), isInternship: false, description: 'Looking for a versatile full stack dev for our core product.'
            },
            {
                title: 'HR Manager', company: createdCompanies[4]._id, postedBy: employer1Id,
                location: 'Hyderabad', jobType: 'Full Time', category: 'Human Resources', experience: '2-3 years',
                salary: { min: 45000, max: 65000 },
                skills: ['Recruiting', 'Employee Relations', 'HRIS'],
                responsibilities: ['Manage recruitment process', 'Handle employee grievances', 'Implement HR policies'],
                requirements: ['Degree in HR', 'Strong interpersonal skills', 'Knowledge of labor laws'],
                benefits: ['Health insurance', 'Paid time off', 'Wellness programs'],
                deadline: futureDate(90), isInternship: false, description: 'Build and nurture our growing team.'
            },
            // Internships
            {
                title: 'Software Development Intern', company: createdCompanies[0]._id, postedBy: employer1Id,
                location: 'Bengaluru', jobType: 'Internship', category: 'Software Development', experience: '0-1 years',
                salary: { min: 15000, max: 25000 },
                skills: ['Java', 'Python', 'Data Structures'],
                responsibilities: ['Assist in coding features', 'Write unit tests', 'Learn from seniors'],
                requirements: ['Pursuing CS degree', 'Strong programming fundamentals', 'Eager to learn'],
                benefits: ['Mentorship', 'Pre-placement offer chance', 'Free meals'],
                deadline: futureDate(60), isInternship: true, description: 'Kickstart your career with our rigorous internship program.'
            },
            {
                title: 'Data Science Intern', company: createdCompanies[2]._id, postedBy: employer2Id,
                location: 'Mumbai', jobType: 'Internship', category: 'Data Science', experience: '0-1 years',
                salary: { min: 20000, max: 30000 },
                skills: ['Python', 'Pandas', 'Machine Learning'],
                responsibilities: ['Clean data', 'Assist in building ML models', 'Document research'],
                requirements: ['Understanding of statistics', 'Basic Python knowledge', 'Analytical thinking'],
                benefits: ['Mentorship', 'Letter of recommendation', 'Flexible hours'],
                deadline: futureDate(90), isInternship: true, description: 'Learn practical data science applications in the finance sector.'
            },
            {
                title: 'UI/UX Design Intern', company: createdCompanies[3]._id, postedBy: employer2Id,
                location: 'Delhi', jobType: 'Internship', category: 'UI/UX Design', experience: '0-1 years',
                salary: { min: 12000, max: 18000 },
                skills: ['Figma', 'Sketching', 'Wireframing'],
                responsibilities: ['Assist in design iterations', 'Create assets', 'Participate in brainstorms'],
                requirements: ['Design portfolio', 'Basic understanding of UX principles', 'Creative mindset'],
                benefits: ['Creative mentorship', 'Certificate of completion', 'Casual dress code'],
                deadline: futureDate(60), isInternship: true, description: 'Hone your design skills in a fast-paced agency environment.'
            },
            {
                title: 'Marketing Intern', company: createdCompanies[5]._id, postedBy: employer2Id,
                location: 'Chennai', jobType: 'Internship', category: 'Marketing', experience: '0-1 years',
                salary: { min: 10000, max: 15000 },
                skills: ['Social Media', 'Content Creation', 'Canva'],
                responsibilities: ['Draft social posts', 'Assist in market research', 'Organize events'],
                requirements: ['Excellent communication', 'Active on social media', 'Enthusiastic'],
                benefits: ['Letter of recommendation', 'Networking opportunities', 'Fun work environment'],
                deadline: futureDate(90), isInternship: true, description: 'Get hands-on experience in modern digital marketing.'
            },
            {
                title: 'Frontend Development Intern', company: createdCompanies[1]._id, postedBy: employer1Id,
                location: 'Pune', jobType: 'Internship', category: 'Software Development', experience: '0-1 years',
                salary: { min: 15000, max: 20000 },
                skills: ['HTML', 'CSS', 'JavaScript'],
                responsibilities: ['Build web pages from designs', 'Fix UI bugs', 'Learn React'],
                requirements: ['Strong HTML/CSS skills', 'Basic JS knowledge', 'Attention to detail'],
                benefits: ['Mentorship', 'Flexible hours', 'Potential for full-time role'],
                deadline: futureDate(60), isInternship: true, description: 'Learn to build production-ready web interfaces.'
            },
            {
                title: 'Product Management Intern', company: createdCompanies[4]._id, postedBy: employer1Id,
                location: 'Hyderabad', jobType: 'Internship', category: 'Product', experience: '0-1 years',
                salary: { min: 18000, max: 25000 },
                skills: ['Market Research', 'Documentation', 'Communication'],
                responsibilities: ['Conduct competitor analysis', 'Help write PRDs', 'Gather user feedback'],
                requirements: ['Strong analytical skills', 'Good writing skills', 'Interest in tech products'],
                benefits: ['Work with experienced PMs', 'High visibility', 'Stipend'],
                deadline: futureDate(90), isInternship: true, description: 'Learn the ropes of product management at a tech giant.'
            },
            {
                title: 'Cybersecurity Intern', company: createdCompanies[0]._id, postedBy: employer1Id,
                location: 'Bengaluru', jobType: 'Internship', category: 'Cybersecurity', experience: '0-1 years',
                salary: { min: 15000, max: 22000 },
                skills: ['Networking Basics', 'Linux', 'Security Fundamentals'],
                responsibilities: ['Assist in vulnerability scanning', 'Review logs', 'Update security docs'],
                requirements: ['Basic understanding of networks', 'Familiarity with Linux', 'Eagerness to learn security'],
                benefits: ['Hands-on security training', 'Certificate', 'Mentorship'],
                deadline: futureDate(60), isInternship: true, description: 'Start your journey in cybersecurity with practical experience.'
            },
            {
                title: 'HR Intern', company: createdCompanies[2]._id, postedBy: employer2Id,
                location: 'Mumbai', jobType: 'Internship', category: 'Human Resources', experience: '0-1 years',
                salary: { min: 10000, max: 15000 },
                skills: ['Communication', 'Organization', 'MS Office'],
                responsibilities: ['Schedule interviews', 'Maintain employee records', 'Assist in onboarding'],
                requirements: ['Good organizational skills', 'Strong interpersonal skills', 'Detail-oriented'],
                benefits: ['Exposure to HR ops', 'Letter of recommendation', 'Friendly team'],
                deadline: futureDate(90), isInternship: true, description: 'Gain valuable experience in HR operations and recruitment.'
            }
        ];

        await Job.insertMany(jobsData);
        console.log('Jobs created');

        console.log('Seed completed successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error with seed: ${error.message}`);
        process.exit(1);
    }
};

seedData();
