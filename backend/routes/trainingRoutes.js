const express = require('express');
const router = express.Router();
const Training = require('../models/TrainingData.js');
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
