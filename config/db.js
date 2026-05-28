const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`🟢 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`🔴 MongoDB Connection Error: ${error.message}`);
        process.exit(1); // Server ko rokne ke liye agar DB connect na ho
    }
};

module.exports = connectDB;
