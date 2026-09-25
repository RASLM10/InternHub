const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true,
        enum: ['Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'E-Commerce', 'Cybersecurity', 'Consulting', 'Media', 'Other']
    },
    location: {
        type: String,
        required: true
    },
    website: String,
    logo: String,
    companySize: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
    },
    foundedYear: Number,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Company = mongoose.model('Company', companySchema);
module.exports = Company;
