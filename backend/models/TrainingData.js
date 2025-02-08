const mongoose = require('mongoose');

const trainingDataSchema = new mongoose.Schema({
  TrainingTitle: String,
  TrainingType: String,
  PlannedDate: Date,
  StartDate: Date,
  EndDate: Date,
  Reference: String,
  Name: String,
  Status: String,
  Mode: String,
  id: String,
});

// Ensure the collection name matches the database collection
const TrainingData = mongoose.model('trainingData', trainingDataSchema, 'trainingData');

module.exports = TrainingData;
