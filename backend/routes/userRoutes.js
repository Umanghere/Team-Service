// const express = require('express');
// const AttendanceData = require('../models/AttendanceData');

// const router = express.Router();

// // Fetch all attendance records
// router.get('/', async (req, res) => {
//   try {
//     const attendance = await AttendanceData.find();
//     res.json(attendance);
//   } catch (error) {
//     console.error('Error fetching attendance:', error);
//     res.status(500).send(error);
//   }
// });

// // Get attendance for a specific employee
// router.get('/:employeeId', async (req, res) => {
//   try {
//     const attendance = await AttendanceData.find({ employeeId: req.params.employeeId });
//     res.json(attendance);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Add or update attendance
// router.post('/', async (req, res) => {
//   try {
//     const { employeeId, date, status } = req.body;

//     // Check if attendance already exists for this employee on the same date
//     let attendance = await AttendanceData.findOne({ employeeId, date });

//     if (attendance) {
//       // Update existing record
//       attendance.status = status;
//     } else {
//       // Create new record
//       attendance = new AttendanceData({ employeeId, date, status });
//     }

//     await attendance.save();
//     res.json({ message: 'Attendance updated successfully', attendance });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Fetch all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
