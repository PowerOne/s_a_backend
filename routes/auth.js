const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pool = require('../config/db'); // Database connection from db.js
const router = express.Router();

// Secret Key for JWT (Make sure to configure this securely in .env)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const result = await pool.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id',
            [username, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully', userId: result.rows[0].id });
    } catch (error) {
        if (error.code === '23505') { // Unique constraint error for duplicate usernames
            res.status(400).json({ error: 'Username already exists' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// User login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Find the user in the database
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Compare the password with the stored hash
        const isPasswordMatch = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
            expiresIn: '1h', // Token valid for 1 hour
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
