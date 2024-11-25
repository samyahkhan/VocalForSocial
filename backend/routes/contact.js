const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Contact schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model("Contact", contactSchema);

// Endpoint to save contact form data
router.post("/submit", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newContact = new Contact({ name, email, message });
    const savedContact = await newContact.save();
    res.json({ message: "Contact form submitted successfully", data: savedContact });
  } catch (error) {
    console.error("Error saving contact form data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
