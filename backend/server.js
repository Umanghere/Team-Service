require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());

// Get allowed origins from environment variables
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173']; // fallback for development

app.use(cors({
  origin: allowedOrigins,
  credentials: true,  
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  
  allowedHeaders: ["Content-Type", "Authorization"],  
}));

// Only log in development
if (process.env.NODE_ENV !== 'production') {
  console.log("MONGO_URI:", process.env.MONGO_URI ? 'Connected' : 'Not found');
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => {
    // Don't log full error in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Database connection failed');
    } else {
      console.error('Error connecting to MongoDB:', error);
    }
  });

// Import Routes
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const employeesRoutes = require('./routes/employeesRoutes.js');
const trainingRoutes = require('./routes/trainingRoutes.js');

// Use Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/employeesData', employeesRoutes);
app.use('/trainingData', trainingRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});