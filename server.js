const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 3001;
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/authRoutes");
app.use("/api/todos", todoRoutes);
app.use("/api/auth", authRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "Server is running" });
});

// Test endpoint to check if auth is working
app.get("/api/test", (req, res) => {
    const token = req.cookies.token;
    if (token) {
        res.json({ message: "Token found", hasToken: true });
    } else {
        res.json({ message: "No token found", hasToken: false });
    }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB!");
        app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    }) 
    .catch(err => console.error("MongoDB connection error:", err));
