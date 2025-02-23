const express = require('express');
const router = express.Router();
const Employee = require('../models/EmployeesData.js');
const mongoose = require('mongoose');

// Fetch all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).send(error);
  }
});

// Update an employee
router.put('/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee', error });
  }
});

// Add a new employee
router.post('/', async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ message: 'Error adding employee', error });
  }
});

// Upload multiple employees
router.post('/upload', async (req, res) => {
  try {
    const newEmployees = req.body;
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

// Delete an employee
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Employee ID format' });
    }
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

module.exports = router;
