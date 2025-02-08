const mongoose = require('mongoose');

// Define the schema for the user
const userSchema = new mongoose.Schema({
  EmpId: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  Name: { type: String, required: true },
  id: { type: Number, required: true }
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
