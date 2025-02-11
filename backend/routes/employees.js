const express = require("express");
const router = express.Router();
const EmployeesData = require("../models/EmployeesData");
const mongoose = require("mongoose"); // Import mongoose to validate IDs

// ✅ GET: Fetch all employees
router.get("/", async (req, res) => {
  try {
    const employees = await EmployeesData.find();
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Error fetching employees" });
  }
});

// ✅ PATCH: Update employee details (Partial Update)
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 🛑 Validate MongoDB ID before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Employee ID" });
    }

    const updatedEmployee = await EmployeesData.findByIdAndUpdate(id, req.body, {
      new: true, // Return updated employee
      runValidators: true, // Ensure data validation rules are applied
    });

    if (!updatedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ error: "Error updating employee" });
  }
});

// DELETE: Remove an employee
router.delete("/:empId", async (req, res) => {
  try {
    const { empId } = req.params;

    // Find and delete employee by EmpId instead of MongoDB _id
    const deletedEmployee = await EmployeesData.findOneAndDelete({ EmpId: empId });

    if (!deletedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Error deleting employee" });
  }
});

module.exports = router;
