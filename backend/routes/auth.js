const express = require('express');
const router = express.Router();
const User = require('../models/EmployeesData'); // Ensure this matches your users model

router.post('/users', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Check if password matches
        if (user.password !== password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // If login is successful, return user details
        res.json({
            email: user.email,
            role: user.role,
            name: user.Name,
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
