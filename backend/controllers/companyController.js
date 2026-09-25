const Company = require('../models/Company');

exports.createCompany = async (req, res, next) => {
    try {
        const companyData = { ...req.body, createdBy: req.user.id };
        const company = await Company.create(companyData);
        res.status(201).json({ success: true, data: company });
    } catch (error) {
        next(error);
    }
};

exports.getCompanies = async (req, res, next) => {
    try {
        const companies = await Company.find().populate('createdBy', 'name');
        res.json({ success: true, count: companies.length, data: companies });
    } catch (error) {
        next(error);
    }
};

exports.getCompany = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            res.status(404);
            throw new Error('Company not found');
        }
        res.json({ success: true, data: company });
    } catch (error) {
        next(error);
    }
};

exports.updateCompany = async (req, res, next) => {
    try {
        let company = await Company.findById(req.params.id);
        if (!company) {
            res.status(404);
            throw new Error('Company not found');
        }
        
        if (company.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to update this company');
        }
        
        company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json({ success: true, data: company });
    } catch (error) {
        next(error);
    }
};
