// // require('dotenv').config();
// // const express = require('express');
// // const mongoose = require('mongoose');
// // const cors = require('cors');
// // const User = require('./models/User'); // Ensure the correct path
// // const Employee = require('./models/EmployeesData'); // Ensure the correct path
// // const Training = require('./models/TrainingData'); // Ensure the correct path

// // const app = express();

// // const allowedOrigins = [
// //   "http://localhost:5173",  // Local development
// //   "https://team-services.vercel.app/"  // Future deployed frontend
// // ];

// // // Middleware
// // app.use(cors({
// //   origin: function (origin, callback) {
// //     if (!origin || allowedOrigins.includes(origin)) {
// //       callback(null, true);
// //     } else {
// //       callback(new Error("Not allowed by CORS"));
// //     }
// //   }
// // }));
// // app.use(express.json());

// // // Connect to MongoDB
// // // let urlLocal = 'mongodb://localhost:27017/Team-Services';
// // // let urlGlobal = 'mongodb+srv://<username>:<password>@teamservices.jcfta.mongodb.net/Team-Services?retryWrites=true&w=majority';         //URL to connect to database GLOBALLY
// // // let mongoURI = process.env.MONGO_URI;

// // // console.log("MONGO_URI:", process.env.MONGO_URI);

// // mongoose.connect(process.env.MONGO_URI, {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true,
// // })
// //   .then(() => console.log('Connected to MongoDB'))
// //   .catch((error) => console.error('Error connecting to MongoDB:', error));


// // // -------------------------------------------------------------------------
// // // --------------------------- LOGIN ROUTE ---------------------------------
// // // -------------------------------------------------------------------------

// // // Login route to authenticate users
// // app.post('/login', async (req, res) => {
// //   const { email, password } = req.body;

// //   try {
// //     // Find user by email
// //     const user = await User.findOne({ email });

// //     if (!user) {
// //       return res.status(404).json({ message: "Email not found" });
// //     }

// //     // Check if password matches
// //     if (user.password !== password) {
// //       return res.status(401).json({ message: "Incorrect password" });
// //     }

// //     // If email & password are correct, return user details
// //     res.status(200).json({
// //       email: user.email,
// //       role: user.role,
// //       Name: user.Name,
// //       EmpId: user.EmpId
// //     });

// //   } catch (error) {
// //     console.error("Login error:", error);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });

// // // -------------------------------------------------------------------------
// // // -------------------------- USER ROUTES ----------------------------------
// // // -------------------------------------------------------------------------

// // // Fetch all users
// // app.get('/users', async (req, res) => {
// //   try {
// //     const users = await User.find();
// //     res.json(users);
// //   } catch (error) {
// //     console.error('Error fetching users:', error);
// //     res.status(500).json({ message: 'Internal Server Error' });
// //   }
// // });

// // // -------------------------------------------------------------------------
// // // ---------------------- EMPLOYEES DATA ROUTES -----------------------------
// // // -------------------------------------------------------------------------

// // // Fetch all employees
// // app.get('/employeesData', async (req, res) => {
// //   try {
// //     const employees = await Employee.find();
// //     res.json(employees);
// //   } catch (error) {
// //     console.error('Error fetching employees:', error);
// //     res.status(500).send(error);
// //   }
// // });

// // // Update an employee
// // app.put('/employeesData/:id', async (req, res) => {
// //   try {
// //     const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
// //     res.json(updatedEmployee);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error updating employee', error });
// //   }
// // });

// // // Add a new employee
// // app.post('/employeesData', async (req, res) => {
// //   try {
// //     const newEmployee = new Employee(req.body);
// //     await newEmployee.save();
// //     res.status(201).json(newEmployee);
// //   } catch (error) {
// //     console.error('Error adding employee:', error);
// //     res.status(500).json({ message: 'Error adding employee', error });
// //   }
// // });

// // // Upload multiple employees from Excel or bulk data
// // app.post('/employeesData/upload', async (req, res) => {
// //   try {
// //     const newEmployees = req.body;
// //     if (!Array.isArray(newEmployees) || newEmployees.length === 0) {
// //       return res.status(400).json({ message: 'Invalid or empty data' });
// //     }
// //     await Employee.insertMany(newEmployees);
// //     res.status(201).json({ message: 'Employees added successfully' });
// //   } catch (error) {
// //     console.error('Error uploading employees:', error);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // // Delete an employee
// // app.delete('/employeesData/:id', async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     if (!mongoose.Types.ObjectId.isValid(id)) {
// //       return res.status(400).json({ message: 'Invalid Employee ID format' });
// //     }
// //     const deletedEmployee = await Employee.findByIdAndDelete(id);
// //     if (!deletedEmployee) {
// //       return res.status(404).json({ message: 'Employee not found' });
// //     }
// //     res.status(200).json({ message: 'Employee deleted successfully' });
// //   } catch (error) {
// //     console.error('Error deleting employee:', error);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // // -------------------------------------------------------------------------
// // // ------------------------- TRAINING DATA ROUTES ---------------------------
// // // -------------------------------------------------------------------------

// // // Fetch all training data
// // app.get('/trainingData', async (req, res) => {
// //   try {
// //     const trainingData = await Training.find();
// //     res.json(trainingData);
// //   } catch (error) {
// //     console.error('Error fetching training data:', error);
// //     res.status(500).send(error);
// //   }
// // });

// // // Update training data
// // app.put('/trainingData/:id', async (req, res) => {
// //   try {
// //     const updatedTraining = await Training.findByIdAndUpdate(req.params.id, req.body, { new: true });
// //     res.json(updatedTraining);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error updating training', error });
// //   }
// // });

// // // Add new training
// // app.post('/trainingData', async (req, res) => {
// //   try {
// //     const newTraining = new Training(req.body);
// //     await newTraining.save();
// //     res.status(201).json(newTraining);
// //   } catch (error) {
// //     console.error('Error adding training:', error);
// //     res.status(500).json({ message: 'Error adding training', error });
// //   }
// // });

// // // Upload multiple training data entries
// // app.post('/trainingData/upload', async (req, res) => {
// //   try {
// //     const newTrainings = req.body;
// //     if (!Array.isArray(newTrainings) || newTrainings.length === 0) {
// //       return res.status(400).json({ message: 'Invalid or empty data' });
// //     }
// //     await Training.insertMany(newTrainings);
// //     res.status(201).json({ message: 'Training data added successfully' });
// //   } catch (error) {
// //     console.error('Error uploading training data:', error);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // // Delete a training entry
// // app.delete('/trainingData/:id', async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     if (!mongoose.Types.ObjectId.isValid(id)) {
// //       return res.status(400).json({ message: 'Invalid Training ID format' });
// //     }
// //     const deletedTraining = await Training.findByIdAndDelete(id);
// //     if (!deletedTraining) {
// //       return res.status(404).json({ message: 'Training entry not found' });
// //     }
// //     res.status(200).json({ message: 'Training entry deleted successfully' });
// //   } catch (error) {
// //     console.error('Error deleting training:', error);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });


// // // -------------------------------------------------------------------------
// // // ---------------------------- START SERVER -------------------------------
// // // -------------------------------------------------------------------------


// // const port = process.env.PORT || 5000;
// // app.listen(port, () => {
// //   console.log(`Server running on port ${port}`);
// // });




// // //------------------------------------------------------------------------
// // //------------------------------------------------------------------------
// // This upper commented code contains all the routes in this file only.
// // //------------------------------------------------------------------------
// // //------------------------------------------------------------------------



// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();

// // const allowedOrigins = [
// //   "http://localhost:5173",  // Local Development
// //   "https://team-services.vercel.app/",  // Deployed frontend
// //   "http://localhost:4173/Team-Service-UI/login"
// // ];

// // Middleware
// // app.use(cors({
// //   origin: function (origin, callback) {
// //     if (!origin || allowedOrigins.includes(origin)) {
// //       callback(null, true);
// //     } else {
// //       callback(new Error("Not allowed by CORS"));
// //     }
// //   }
// // }));

// app.use(cors({
//   origin: [
//     "http://localhost:5173",  // Local Development
//     "http://localhost:4173",  // Preview Build
//     "https://team-services.vercel.app"  // Deployed frontend
//   ],
//   credentials: true,  // Allows cookies, authorization headers
//   methods: ["GET", "POST", "PUT", "DELETE"],  // Allowed HTTP methods
// }));


// app.use(express.json());

// // Connect to MongoDB
// // let urlLocal = 'mongodb://localhost:27017/Team-Services';
// // let urlGlobal = 'mongodb+srv://<username>:<password>@teamservices.jcfta.mongodb.net/Team-Services?retryWrites=true&w=majority';         //URL to connect to database GLOBALLY
// // let mongoURI = process.env.MONGO_URI;

// // console.log("MONGO_URI:", process.env.MONGO_URI);


// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('Connected to MongoDB'))
//   .catch(error => console.error('Error connecting to MongoDB:', error));


//   // Import Routes
// const authRoutes = require('./routes/authRoutes.js');
// const userRoutes = require('./routes/userRoutes.js');
// const employeeRoutes = require('./routes/employeesRoutes.js');
// const trainingRoutes = require('./routes/trainingRoutes.js');


// // Use Routes
// app.use('/auth', authRoutes);
// app.use('/users', userRoutes);
// app.use('/employeesData', employeeRoutes);
// app.use('/trainingData', trainingRoutes);


// const port = process.env.PORT || 5000;
// app.listen(port, () => console.log(`Server running on port ${port}`));


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User'); // Ensure the correct path
const Employee = require('./models/EmployeesData'); // Ensure the correct path
const Training = require('./models/TrainingData'); // Ensure the correct path

const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",  // Local Development
    "http://localhost:4173",  // Preview Build
    "https://team-services.vercel.app"  // Deployed frontend
  ],
  credentials: true,  // Allows cookies, authorization headers
  methods: ["GET", "POST", "PUT", "DELETE"],  // Allowed HTTP methods
}));


// Connect to MongoDB
// let urlLocal = 'mongodb://localhost:27017/Team-Services';
// let urlGlobal = 'mongodb+srv://<username>:<password>@teamservices.jcfta.mongodb.net/Team-Services?retryWrites=true&w=majority';         //URL to connect to database GLOBALLY
// let mongoURI = process.env.MONGO_URI;

// console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));


// -------------------------------------------------------------------------
// --------------------------- LOGIN ROUTE ---------------------------------
// -------------------------------------------------------------------------

// Login route to authenticate users
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Check if password matches
    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
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
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------------------------------------
// -------------------------- USER ROUTES ----------------------------------
// -------------------------------------------------------------------------

// Fetch all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// -------------------------------------------------------------------------
// ---------------------- EMPLOYEES DATA ROUTES -----------------------------
// -------------------------------------------------------------------------

// Fetch all employees
app.get('/employeesData', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).send(error);
  }
});

// Update an employee
app.put('/employeesData/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee', error });
  }
});

// Add a new employee
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

// Upload multiple employees from Excel or bulk data
app.post('/employeesData/upload', async (req, res) => {
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
app.delete('/employeesData/:id', async (req, res) => {
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

// -------------------------------------------------------------------------
// ------------------------- TRAINING DATA ROUTES ---------------------------
// -------------------------------------------------------------------------

// Fetch all training data
app.get('/trainingData', async (req, res) => {
  try {
    const trainingData = await Training.find();
    res.json(trainingData);
  } catch (error) {
    console.error('Error fetching training data:', error);
    res.status(500).send(error);
  }
});

// Update training data
app.put('/trainingData/:id', async (req, res) => {
  try {
    const updatedTraining = await Training.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTraining);
  } catch (error) {
    res.status(500).json({ message: 'Error updating training', error });
  }
});

// Add new training
app.post('/trainingData', async (req, res) => {
  try {
    const newTraining = new Training(req.body);
    await newTraining.save();
    res.status(201).json(newTraining);
  } catch (error) {
    console.error('Error adding training:', error);
    res.status(500).json({ message: 'Error adding training', error });
  }
});

// Upload multiple training data entries
app.post('/trainingData/upload', async (req, res) => {
  try {
    const newTrainings = req.body;
    if (!Array.isArray(newTrainings) || newTrainings.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty data' });
    }
    await Training.insertMany(newTrainings);
    res.status(201).json({ message: 'Training data added successfully' });
  } catch (error) {
    console.error('Error uploading training data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a training entry
app.delete('/trainingData/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Training ID format' });
    }
    const deletedTraining = await Training.findByIdAndDelete(id);
    if (!deletedTraining) {
      return res.status(404).json({ message: 'Training entry not found' });
    }
    res.status(200).json({ message: 'Training entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting training:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// -------------------------------------------------------------------------
// ---------------------------- START SERVER -------------------------------
// -------------------------------------------------------------------------


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});