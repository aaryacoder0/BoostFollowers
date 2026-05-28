// ==========================================================
// FILE: routes/userRoutes.js
// DESCRIPTION: Complete User & Admin Management Router (Fully Updated & Secured)
// ==========================================================

const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Database User Model

// ==================== 1. USER REGISTRATION ====================
router.post('/register', async (req, res) => {
    try {
        const { name, identifier, password } = req.body;

        // Validation: Check karna ki sabhi fields bheje gaye hain ya nahi
        if (!name || !identifier || !password) {
            return res.status(400).json({ error: "Name, Identifier aur Password teeno zaroori hain!" });
        }

        // Check karna ki yeh identifier pehle se register toh nahi hai
        const userExists = await User.findOne({ identifier });
        if (userExists) {
            return res.status(400).json({ error: "Yeh Email/Phone/Username pehle se register hai!" });
        }

        // Naya user create karna
        const newUser = new User({
            name,
            identifier, // Isme user ka email, phone ya username jo bhi usne dala hoga, save ho jayega
            password
        });

        const savedUser = await newUser.save();
        res.status(201).json({
            message: "User successfully register ho gaya!",
            user: {
                id: savedUser._id,
                name: savedUser.name,
                identifier: savedUser.identifier
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== 2. USER LOGIN ====================
router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ error: "Identifier aur Password dono zaroori hain!" });
        }

        // Database me seedha identifier match karna
        const user = await User.findOne({ identifier });

        // Agar user nahi mila
        if (!user) {
            return res.status(404).json({ error: "User nahi mila! Kripya sahi details dalein." });
        }

        // Password check karna
        if (user.password !== password) {
            return res.status(401).json({ error: "Galat password!" });
        }

        // Login Success
        res.json({
            message: `Welcome back, ${user.name}! Login safal raha. 🎉`,
            user: {
                id: user._id,
                name: user.name,
                identifier: user.identifier
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== 3. ADMIN: FETCH ALL RECORDS (SECURED VIA .ENV) ====================
router.get('/all-records', async (req, res) => {
    try {
        // Frontend ke request header se admin pin uthana
        const adminPin = req.headers['x-admin-pin'];
        
        // 🔒 .env file ke ADMIN_SECRET_PIN variable se match karna
        if (!adminPin || adminPin !== process.env.ADMIN_SECRET_PIN) {
            return res.status(403).json({ error: "Access Denied: Invalid Admin PIN!" });
        }

        // Database se saare users ko fetch karna aur naye users ko sabse upar dikhana
        const users = await User.find({}).sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Database se records fetch karne mein dikkat aayi!" });
    }
});

// ==================== 4. ADMIN: DELETE A RECORD (SECURED VIA .ENV) ====================
router.delete('/delete-record/:id', async (req, res) => {
    try {
        // Frontend ke request header se admin pin uthana
        const adminPin = req.headers['x-admin-pin'];
        
        // 🔒 .env file ke ADMIN_SECRET_PIN variable se match karna
        if (!adminPin || adminPin !== process.env.ADMIN_SECRET_PIN) {
            return res.status(403).json({ error: "Access Denied: Invalid Admin PIN!" });
        }

        const userId = req.params.id;

        // MongoDB ID ke zariye specific user ko permanently hatana
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ error: "Record nahi mila ya pehle hi delete ho chuka hai!" });
        }

        res.status(200).json({ message: "Record database se permanently delete ho gaya!" });
    } catch (error) {
        res.status(500).json({ error: "Record delete karne mein koi takleef aayi!" });
    }
});

module.exports = router;
