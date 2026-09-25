const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        res.json({ success: true, count: users.length, data: users });
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        if (req.params.id === req.user.id) {
            res.status(400);
            throw new Error('Cannot delete your own admin account');
        }
        
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.getAllJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find().populate('company');
        res.json({ success: true, count: jobs.length, data: jobs });
    } catch (error) {
        next(error);
    }
};

exports.deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            res.status(404);
            throw new Error('Job not found');
        }
        res.json({ success: true, message: 'Job deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.getAllApplications = async (req, res, next) => {
    try {
        const applications = await Application.find()
            .populate('applicant', 'name email')
            .populate('job', 'title')
            .populate('company', 'name');
            
        res.json({ success: true, count: applications.length, data: applications });
    } catch (error) {
        next(error);
    }
};

exports.getAllCompanies = async (req, res, next) => {
    try {
        const companies = await Company.find().populate('createdBy', 'name');
        res.json({ success: true, count: companies.length, data: companies });
    } catch (error) {
        next(error);
    }
};

exports.getStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();
        const totalCompanies = await Company.countDocuments();
        const studentCount = await User.countDocuments({ role: 'student' });
        const employerCount = await User.countDocuments({ role: 'employer' });
        
        res.json({
            success: true,
            data: {
                totalUsers,
                totalJobs,
                totalApplications,
                totalCompanies,
                studentCount,
                employerCount
            }
        });
    } catch (error) {
        next(error);
    }
};
