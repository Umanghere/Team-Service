const express = require("express");
const router = express.Router();
const EmployeesData = require("../models/EmployeesData"); // ✅ Use your existing model

// ✅ GET: Fetch all employees
router.get("/", async (req, res) => {
  try {
    const employees = await EmployeesData.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Error fetching employees" });
  }
});

// ✅ PUT: Update employee details
router.put("/:id", async (req, res) => {
  try {
    const updatedEmployee = await EmployeesData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: "Error updating employee" });
  }
});

// ✅ DELETE: Remove an employee (Admin Only)
router.delete("/:id", async (req, res) => {
  try {
    await EmployeesData.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting employee" });
  }
});

module.exports = router;
