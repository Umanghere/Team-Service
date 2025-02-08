const mongoose = require("mongoose");

const employeesDataSchema = new mongoose.Schema({
  EmpId: String,
  Name: String,
  Grade: String,
  Designation: String,
  Project: String,
  Skills: String,
  Location: String,
  ContactNo: String,
});

// Ensure the collection name matches the database collection
const EmployeesData = mongoose.model("employeesData", employeesDataSchema, "employeesData");

module.exports = EmployeesData;
