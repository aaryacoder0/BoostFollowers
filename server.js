// ==========================================
// SERVER.JS - MAIN ENTRY POINT
// ==========================================

require('dotenv').config(); // .env file se PORT aur MONGO_URI load karne ke liye
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const connectDB = require('./config/db'); // Database connection logic
const userRoutes = require('./routes/userRoutes'); // Signup API Routes

const app = express();
const PORT = process.env.PORT || 3000;

// 1. DATABASE CONNECTION
connectDB();

// 2. MIDDLEWARES
app.use(cors()); // Cross-Origin Requests allow karne ke liye
app.use(express.json()); // JSON Request Body ko read karne ke liye

// 🔥 Static files serve karne ke liye (CSS, Images ya JS files ke liye)
app.use(express.static(path.join(__dirname, 'public')));


// ==================== 🌐 FRONTEND ROUTES (CLEAN URLs) ====================

// 1. Landing Page -> http://localhost:3000
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 2. Sign Up Page -> http://localhost:3000/signup
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'auth.html'));
});

// 3. Home/Dashboard Page -> http://localhost:3000/home
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// 5. Privacy Policy Page -> http://localhost:3000/privacy
app.get('/privacy', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'privacy.html'));
});

// 6. Terms and Conditions Page -> http://localhost:3000/terms
app.get('/terms', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'terms.html'));
});

// 7. Disclaimer Page -> http://localhost:3000/disclaimer
app.get('/disclaimer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'disclaimer.html'));
});


app.get('/adminLogin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adminLogin.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ==================== ⚙️ BACKEND API ROUTES ====================

// Saari backend APIs is path par chalengi: http://localhost:3000/api/users/register
app.use('/api/users', userRoutes);


// ==================== 🚀 SERVER START ====================
app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🔥 Server successfully running on port: ${PORT}`);
    console.log(`💻 Open in Browser: http://localhost:${PORT}`);
    console.log(`===================================================`);
});
