const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");

dotenv.config();

const app = express();

// Middleware
app.use(helmet()); 
app.use(cors());
app.use(express.json()); 

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Test route to check if backend is working
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Home route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});


const contactRoutes = require('./routes/contact');
app.use('/api/contact', contactRoutes);


app.use((req, res, next) => {
  console.error(err.stack);
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).json({ error: "Something went wrong!" }); 
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
