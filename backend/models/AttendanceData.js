const mongoose = require('mongoose');

const valueSchema = new mongoose.Schema({}, { strict: false }); 
const attendanceSchema = new mongoose.Schema({
  month: { type: String, required: true },
  name: { type: String, required: true }, 
  values: { type: [valueSchema], required: true }, 
  TH: { type: Number, required: true }, 
  TL: { type: Number, required: true }, 
  id: { type: String, required: true, unique: true } 
}, { collection: 'attendanceData' }); 
const Attendance = mongoose.model('AttendanceData', attendanceSchema);
module.exports = Attendance;
