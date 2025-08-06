const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // for creating login tokens
const cookieParser = require("cookie-parser");
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
        const token = jwt.sign({ userId: newUser._id, username: newUser.username }, JWT_SECRET, {
            expiresIn: JWT_EXPIRATION,
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // set true for prod
            sameSite: "Strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        res.json({ message: "Registered successfully" });

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

        if (!user) return res.status(404).json({ message: "User not found" });

        // compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        // create JWT token
        const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { 
            expiresIn: JWT_EXPIRATION,
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // set true for prod
            sameSite: "Strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        res.json({ message: "Logged in successfully "});

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.get("/check", (req,res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Not logged in" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ username: decoded.username });
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly:true,
        secure:false, // set true for prod
        sameSite:"Strict",
    });
    res.json({ message: "Logged out successfully" });
})

module.exports = router;