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


//-------------------------------------------------------------------------
//-------------------------------------------------------------------------
//-------------------------------------------------------------------------


// Route to fetch all USERS
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to FETCH all employees
app.get('/employeesData', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).send(error);
  }
});

// UPDATE members in TEAM MEMBERS TABLE
app.put('/employeesData/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee', error });
  }
});

// Route to ADD new member in TEAM MEMBERS TABLE
app.post('/employeesData', async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ message: 'Error adding employee', error });
  }
});

// UPLOAD members in TEAM MEMBERS TABLE form device using Excel sheet
app.post('/employeesData/upload', async (req, res) => {
  try {
    const newEmployees = req.body; // Data from frontend
    if (!Array.isArray(newEmployees) || newEmployees.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty data' });
    }

    await Employee.insertMany(newEmployees);
    res.status(201).json({ message: 'Employees added successfully' });

  } catch (error) {
    console.error('Error uploading employees:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE an employee from TEAM MEMBERS TABLE
app.delete('/employeesData/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if id is a correct MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Employee ID format' });
    }

    // Find and delete the employee using `_id`
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
});





//-------------------------------------------------------------------------
//-------------------------------------------------------------------------
//-------------------------------------------------------------------------


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
