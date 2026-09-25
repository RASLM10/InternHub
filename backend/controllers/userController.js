const User = require('../models/User');

exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const allowedUpdates = ['name', 'phone', 'location', 'headline', 'bio', 'skills', 'education', 'experience', 'resumeUrl', 'profileImage'];
        const updateData = {};
        
        for (const key of Object.keys(req.body)) {
            if (allowedUpdates.includes(key)) {
                updateData[key] = req.body[key];
            }
        }
        
        const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true, runValidators: true });
        
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};
