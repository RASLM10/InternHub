const ContactMessage = require('../models/ContactMessage');

exports.createContact = async (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body;
        
        if (!name || !email || !subject || !message) {
            res.status(400);
            throw new Error('Please provide name, email, subject and message');
        }
        
        await ContactMessage.create({ name, email, subject, message });
        
        res.status(201).json({ 
            success: true, 
            message: 'Thank you for contacting InternHub. We will get back to you soon!' 
        });
    } catch (error) {
        next(error);
    }
};
