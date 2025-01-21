const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');
const admin = require('../config/firebase-admin');

// Helper function to format date in UTC
// At the top of auth.js - Update only this function
const getUTCDateTime = () => {
  const now = new Date();
  return now.toISOString()
    .replace('T', ' ')
    .slice(0, 19);
};


// Firebase authentication routes
router.post('/verify-firebase', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update last login
    user.lastLogin = getUTCDateTime();
    await user.save();

    res.json({ user });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

router.post('/register-firebase', async (req, res) => {
  try {
    const { firebaseUid, email, name } = req.body;
    
    if (!firebaseUid || !email || !name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      firebaseUid,
      email,
      name,
      role: 'user',
      registrationDate: getUTCDateTime(),
      lastLogin: getUTCDateTime()
    });

    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Token verification
router.get('/verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(401).json({
      error: true,
      message: 'Invalid token'
    });
  }
});

// User login
// routes/auth.js - Update only the user login route
// routes/auth.js - Update ONLY the user login route
router.post('/login/user', async (req, res) => {
  try {
    const { email, password } = req.body;
    const currentTime = '2025-01-21 14:50:22'; // Use your current UTC time format

    // Debug log
    console.log('Login attempt:', { email, timestamp: currentTime });

    // Input validation with specific error message
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
        details: !email ? 'Email is missing' : 'Password is missing'
      });
    }

    // Find user with any role (don't restrict to user role)
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If user exists but has no password (Firebase user)
    if (!user.password && user.firebaseUid) {
      return res.status(400).json({ 
        message: 'Please use Google Sign-In for this account' 
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = currentTime;
    await user.save();

    // Generate token with correct payload
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send success response
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user 
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      registrationDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
      lastLogin: new Date().toISOString().replace('T', ' ').slice(0, 19)
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});



// Admin login
router.post('/login/admin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login time
    user.lastLogin = getUTCDateTime();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a route to get user login history (admin only)
router.get('/login-history', adminAuth, async (req, res) => {
  try {
    const users = await User.find({})
      .select('name email role lastLogin registrationDate')
      .sort({ lastLogin: -1 });

    res.json({ users });
  } catch (error) {
    console.error('Error fetching login history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;