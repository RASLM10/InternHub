const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true,
        enum: ['Full Time', 'Part Time', 'Internship', 'Contract']
    },
    category: {
        type: String,
        required: true,
        enum: ['Software Development', 'Data Science', 'UI/UX Design', 'Marketing', 'Finance', 'Human Resources', 'Product', 'Cybersecurity', 'Other']
    },
    experience: {
        type: String,
        enum: ['0-1 years', '1-2 years', '2-3 years', '3-5 years', '5+ years'],
        default: '0-1 years'
    },
    salary: {
        min: Number,
        max: Number,
        currency: { type: String, default: 'INR' },
        period: { type: String, default: 'month' }
    },
    skills: [String],
    responsibilities: [String],
    requirements: [String],
    benefits: [String],
    deadline: Date,
    isInternship: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'closed', 'draft'],
        default: 'active'
    }
}, {
    timestamps: true
});

jobSchema.index({ title: 'text', location: 'text', category: 'text' });
jobSchema.index({ jobType: 1 });
jobSchema.index({ isInternship: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ status: 1 });

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
