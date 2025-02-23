// const express = require("express");
// const router = express.Router();
// const TrainingData = require("../models/TrainingData");
// const mongoose = require("mongoose"); // Import mongoose to validate IDs

// // ✅ GET: Fetch all training records
// router.get("/", async (req, res) => {
//   try {
//     const trainings = await TrainingData.find();
//     res.json(trainings);
//   } catch (error) {
//     console.error("Error fetching training data:", error);
//     res.status(500).json({ error: "Error fetching training data" });
//   }
// });

// // ✅ POST: Add a new training record
// router.post("/", async (req, res) => {
//   try {
//     const newTraining = new TrainingData(req.body);
//     await newTraining.save();
//     res.status(201).json(newTraining);
//   } catch (error) {
//     console.error("Error adding training record:", error);
//     res.status(500).json({ error: "Error adding training record" });
//   }
// });

// // ✅ PATCH: Update training details (Partial Update)
// router.patch("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     // 🛑 Validate MongoDB ID before querying
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid Training ID" });
//     }

//     const updatedTraining = await TrainingData.findByIdAndUpdate(id, req.body, {
//       new: true, // Return updated document
//       runValidators: true, // Ensure data validation rules are applied
//     });

//     if (!updatedTraining) {
//       return res.status(404).json({ error: "Training record not found" });
//     }

//     res.json(updatedTraining);
//   } catch (error) {
//     console.error("Error updating training record:", error);
//     res.status(500).json({ error: "Error updating training record" });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Training = require('../models/TrainingData');
const mongoose = require('mongoose');

// Fetch all training data
router.get('/', async (req, res) => {
  try {
    const trainingData = await Training.find();
    res.json(trainingData);
  } catch (error) {
    console.error('Error fetching training data:', error);
    res.status(500).send(error);
  }
});

// Update training data
router.put('/:id', async (req, res) => {
  try {
    const updatedTraining = await Training.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTraining);
  } catch (error) {
    res.status(500).json({ message: 'Error updating training', error });
  }
});

// Add new training
router.post('/', async (req, res) => {
  try {
    const newTraining = new Training(req.body);
    await newTraining.save();
    res.status(201).json(newTraining);
  } catch (error) {
    console.error('Error adding training:', error);
    res.status(500).json({ message: 'Error adding training', error });
  }
});

// Upload multiple training data entries
router.post('/upload', async (req, res) => {
  try {
    const newTrainings = req.body;
    if (!Array.isArray(newTrainings) || newTrainings.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty data' });
    }
    await Training.insertMany(newTrainings);
    res.status(201).json({ message: 'Training data added successfully' });
  } catch (error) {
    console.error('Error uploading training data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a training entry
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Training ID format' });
    }
    const deletedTraining = await Training.findByIdAndDelete(id);
    if (!deletedTraining) {
      return res.status(404).json({ message: 'Training entry not found' });
    }
    res.status(200).json({ message: 'Training entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting training:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
