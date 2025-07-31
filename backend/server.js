require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",  
    "http://localhost:4173",  
    "https://team-services.vercel.app",
    "https://team-service-71wh.vercel.app"
  ],
  credentials: true,  
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  
  allowedHeaders: ["Content-Type", "Authorization"],  
}));

// Connect to MongoDB
// let urlLocal = 'mongodb://localhost:27017/Team-Services';
// let urlGlobal = 'mongodb+srv://<username>:<password>@teamservices.jcfta.mongodb.net/Team-Services?retryWrites=true&w=majority';         //URL to connect to database GLOBALLY
// let mongoURI = process.env.MONGO_URI;

console.log("MONGO_URI:", process.env.MONGO_URI);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));


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
