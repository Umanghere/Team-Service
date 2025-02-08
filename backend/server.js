  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  const User = require('./models/User'); // Ensure the correct path
  const Employee = require('./models/EmployeesData'); // Ensure the correct path
  const Training = require('./models/TrainingData')

  const app = express();
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  
  // Connect to MongoDB
  mongoose.connect('mongodb://localhost:27017/Team-Services')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB', error));
  
  // Login route to authenticate users
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "Email not found" }); // User does not exist
      }
  
      // Check if password matches
      if (user.password !== password) {
        return res.status(401).json({ message: "Incorrect password" }); // Wrong password
      }
  
      // If email & password are correct, return user details
      res.status(200).json({
        email: user.email,
        role: user.role,
        Name: user.Name,
        EmpId: user.EmpId
      });
  
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" }); // Internal error
    }
  });
  
  // Route to fetch all users
  app.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  // Route to fetch all employees
  app.get('/employeesData', async (req, res) => {
    try {
      const employees = await Employee.find();
      res.json(employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      res.status(500).send(error);
    }
  });

  //Update Employee Table
  app.put('/employeesData/:id', async (req, res) => {
    try {
      const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedEmployee);
    } catch (error) {
      res.status(500).json({ message: 'Error updating employee', error });
    }
  });
  
  // Route to fetch training data
  app.get('/trainingData', async (req, res) => {
    try {
      const trainingData = await Training.find();
      res.json(trainingData);
    } catch (error) {
      console.error('Error fetching training data:', error);
      res.status(500).send(error);
    }
  });
  
  // Start the server
  const port = 5000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
    