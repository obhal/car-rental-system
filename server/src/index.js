//index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const bookingRoutes = require('./routes/bookings');
const registerRoutes = require('./routes/register');
const dashboardRoutes = require('./routes/dashboard');
const usersRoutes = require('./routes/users');

dotenv.config();
const app = express();

// Update CORS configuration to allow both ports
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],  // Allow both ports
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Explicitly allow headers
}));

app.use(express.json());

// API routes
app.use('/auth', authRoutes);  
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes); 
app.use('/register', registerRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/api/admin/users', usersRoutes);
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});