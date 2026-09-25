const Job = require('../models/Job');
const Company = require('../models/Company');

exports.getJobs = async (req, res, next) => {
    try {
        const { search, location, jobType, category, experience, isInternship, sort, page = 1, limit = 10 } = req.query;
        
        const query = { status: 'active' };
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (location) query.location = { $regex: location, $options: 'i' };
        if (jobType) query.jobType = jobType;
        if (category) query.category = category;
        if (experience) query.experience = experience;
        if (isInternship === 'true') query.isInternship = true;
        
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const startIndex = (pageNum - 1) * limitNum;
        
        const total = await Job.countDocuments(query);
        const jobs = await Job.find(query)
            .populate('company', 'name logo industry location')
            .sort(sort ? sort : '-createdAt')
            .skip(startIndex)
            .limit(limitNum);
            
        res.json({
            success: true,
            count: jobs.length,
            total,
            pages: Math.ceil(total / limitNum),
            data: jobs
        });
    } catch (error) {
        next(error);
    }
};

exports.getJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('company')
            .populate('postedBy', 'name');
            
        if (!job) {
            res.status(404);
            throw new Error('Job not found');
        }
        res.json({ success: true, data: job });
    } catch (error) {
        next(error);
    }
};

exports.createJob = async (req, res, next) => {
    try {
        const company = await Company.findById(req.body.company);
        if (!company) {
            res.status(404);
            throw new Error('Company not found');
        }
        
        if (company.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to post jobs for this company');
        }
        
        req.body.postedBy = req.user.id;
        const job = await Job.create(req.body);
        res.status(201).json({ success: true, data: job });
    } catch (error) {
        next(error);
    }
};

exports.updateJob = async (req, res, next) => {
    try {
        let job = await Job.findById(req.params.id);
        if (!job) {
            res.status(404);
            throw new Error('Job not found');
        }
        
        if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to update this job');
        }
        
        job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json({ success: true, data: job });
    } catch (error) {
        next(error);
    }
};

exports.deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            res.status(404);
            throw new Error('Job not found');
        }
        
        if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to delete this job');
        }
        
        await job.deleteOne();
        res.json({ success: true, message: 'Job removed successfully' });
    } catch (error) {
        next(error);
    }
};
