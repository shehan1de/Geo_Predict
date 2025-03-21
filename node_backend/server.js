const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const authRoutes = require("./Route/authRoutes");
const userRoutes = require("./Route/userRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(helmet());

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => {
        console.error("MongoDB Connection Failed:", err);
        process.exit(1);
    });

app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/image", express.static(path.join(__dirname, "image")));
console.log("Serving images from:", path.join(__dirname, "image"));

app.use((req, res) => {
    console.warn(`Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
