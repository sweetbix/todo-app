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
    origin: process.env.CLIENT_ORIGIN,
    credentials: true
}));

const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/authRoutes");
app.use("/api/todos", todoRoutes);
app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB!");
        app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    }) 
    .catch(err => console.error("MongoDB connection error:", err));
