const Application = require('../models/Application');
const Job = require('../models/Job');

exports.applyToJob = async (req, res, next) => {
    try {
        const { jobId, resumeUrl, coverLetter } = req.body;
        
        const job = await Job.findById(jobId);
        if (!job) {
            res.status(404);
            throw new Error('Job not found');
        }
        
        const existingApp = await Application.findOne({ job: jobId, applicant: req.user.id });
        if (existingApp) {
            res.status(409);
            throw new Error('You have already applied to this job');
        }
        
        const application = await Application.create({
            job: jobId,
            applicant: req.user.id,
            company: job.company,
            resumeUrl,
            coverLetter
        });
        
        res.status(201).json({ success: true, data: application });
    } catch (error) {
        next(error);
    }
};

exports.getMyApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ applicant: req.user.id })
            .populate('job', 'title location jobType')
            .populate('company', 'name logo');
            
        res.json({ success: true, count: applications.length, data: applications });
    } catch (error) {
        next(error);
    }
};

exports.getJobApplicants = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            res.status(404);
            throw new Error('Job not found');
        }
        
        if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to view these applications');
        }
        
        const applications = await Application.find({ job: req.params.jobId })
            .populate('applicant', 'name email location skills resumeUrl')
            .populate('job', 'title');
            
        res.json({ success: true, count: applications.length, data: applications });
    } catch (error) {
        next(error);
    }
};

exports.updateApplicationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Applied', 'Shortlisted', 'Interview', 'Rejected', 'Selected'];
        
        if (!validStatuses.includes(status)) {
            res.status(400);
            throw new Error('Invalid status');
        }
        
        let application = await Application.findById(req.params.id).populate('job');
        if (!application) {
            res.status(404);
            throw new Error('Application not found');
        }
        
        if (application.job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to update this application');
        }
        
        application.status = status;
        application.updatedAt = Date.now();
        await application.save();
        
        res.json({ success: true, data: application });
    } catch (error) {
        next(error);
    }
};
