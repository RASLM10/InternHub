const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');

exports.saveJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        
        const job = await Job.findById(jobId);
        if (!job) {
            res.status(404);
            throw new Error('Job not found');
        }
        
        const alreadySaved = await SavedJob.findOne({ user: req.user.id, job: jobId });
        if (alreadySaved) {
            res.status(409);
            throw new Error('Job already saved');
        }
        
        await SavedJob.create({ user: req.user.id, job: jobId });
        res.status(201).json({ success: true, message: 'Job saved successfully' });
    } catch (error) {
        next(error);
    }
};

exports.unsaveJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        
        const deleted = await SavedJob.findOneAndDelete({ user: req.user.id, job: jobId });
        if (!deleted) {
            res.status(404);
            throw new Error('Saved job not found');
        }
        
        res.json({ success: true, message: 'Job unsaved successfully' });
    } catch (error) {
        next(error);
    }
};

exports.getSavedJobs = async (req, res, next) => {
    try {
        const savedJobs = await SavedJob.find({ user: req.user.id })
            .populate({
                path: 'job',
                populate: { path: 'company', select: 'name logo' }
            });
            
        res.json({ success: true, count: savedJobs.length, data: savedJobs });
    } catch (error) {
        next(error);
    }
};
