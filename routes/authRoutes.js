const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // for creating login tokens
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

const { JWT_SECRET, JWT_EXPIRATION } = process.env;

// POST /api/auth/register
router.post("/register", async (req, res) => {
    try {
        let { username, password } = req.body;
        
        username = username.trim().toLowerCase();

        // check empty input
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password required" });
        }

        // check if user already exists
        const existing = await User.findOne({ username });
        if (existing) {
            return res.status(409).json({ message: "Username already in use" });
        }

        // create new user (hashed with pre-save hook)
        const newUser = await User.create({ username, password });

        // auto login after register
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRATION,
        });

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: { id: newUser._id, username: newUser.username }, 
            });

    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        let { username, password } = req.body;

        username = username.trim().toLowerCase();

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password required" });
        }

        // find user in database by username
        const user = await User.findOne({ username });

        if (!user) return res.status(404).json({ error: "User not found" });

        // compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: "Invalid password" });

        // create JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { 
            expiresIn: JWT_EXPIRATION,
        });

        res.json({ token, user: { id: user._id, username: user.username} });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;