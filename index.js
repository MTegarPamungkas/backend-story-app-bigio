const express = require("express");
const mongoose = require("mongoose");
const storyRoutes = require("./frameworks/routes/storyRoutes");
const connectDB = require("./config/database");
require("dotenv").config();

const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Ganti dengan origin dari aplikasi frontendmu
  })
);
app.use(express.json());

app.use("/api", storyRoutes);
app.use((req, res, next) => {
  res.send("Run");
});

connectDB();
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
