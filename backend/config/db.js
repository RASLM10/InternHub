const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('placeholder')) {
            console.warn('⚠️ Warning: MONGO_URI is not configured with a valid MongoDB Atlas connection string.');
            console.warn('👉 Please update .env with your MongoDB Atlas connection string to enable database operations.');
            return;
        }
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.warn('👉 Please check your IP whitelist in MongoDB Atlas Network Access and verify credentials in .env.');
    }
};

module.exports = connectDB;
