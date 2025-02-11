const express = require("express");
const router = express.Router();
const TrainingData = require("../models/TrainingData");
const mongoose = require("mongoose"); // Import mongoose to validate IDs

// ✅ GET: Fetch all training records
router.get("/", async (req, res) => {
  try {
    const trainings = await TrainingData.find();
    res.json(trainings);
  } catch (error) {
    console.error("Error fetching training data:", error);
    res.status(500).json({ error: "Error fetching training data" });
  }
});

// ✅ POST: Add a new training record
router.post("/", async (req, res) => {
  try {
    const newTraining = new TrainingData(req.body);
    await newTraining.save();
    res.status(201).json(newTraining);
  } catch (error) {
    console.error("Error adding training record:", error);
    res.status(500).json({ error: "Error adding training record" });
  }
});

// ✅ PATCH: Update training details (Partial Update)
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 🛑 Validate MongoDB ID before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Training ID" });
    }

    const updatedTraining = await TrainingData.findByIdAndUpdate(id, req.body, {
      new: true, // Return updated document
      runValidators: true, // Ensure data validation rules are applied
    });

    if (!updatedTraining) {
      return res.status(404).json({ error: "Training record not found" });
    }

    res.json(updatedTraining);
  } catch (error) {
    console.error("Error updating training record:", error);
    res.status(500).json({ error: "Error updating training record" });
  }
});

module.exports = router;