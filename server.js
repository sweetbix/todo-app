const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const todoRoutes = require("./routes/todoRoutes");
const PORT = process.env.PORT || 3001;
const cors = require("cors");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000"
}));
app.use("/api/todos", todoRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB!");
        app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    }) 
    .catch(err => console.error("MongoDB connection error:", err));