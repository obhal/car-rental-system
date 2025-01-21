const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const { auth, adminAuth } = require('../middleware/auth');

// Helper function to get current UTC date time
const getCurrentDateTime = () => {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
};

// Get all cars with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [cars, totalCount] = await Promise.all([
      Car.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Car.countDocuments()
    ]);

    // Add metadata to response
    res.json({
      timestamp: getCurrentDateTime(),
      currentUser: 'OmkarNarayanBhal',
      data: {
        cars,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ 
      timestamp: getCurrentDateTime(),
      error: true,
      message: error.message 
    });
  }
});

// Get single car
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({
        timestamp: getCurrentDateTime(),
        error: true,
        message: 'Car not found'
      });
    }
    res.json({
      timestamp: getCurrentDateTime(),
      currentUser: 'OmkarNarayanBhal',
      data: car
    });
  } catch (error) {
    res.status(500).json({
      timestamp: getCurrentDateTime(),
      error: true,
      message: error.message
    });
  }
});

// Create car (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json({
      timestamp: getCurrentDateTime(),
      currentUser: 'OmkarNarayanBhal',
      message: 'Car created successfully',
      data: car
    });
  } catch (error) {
    res.status(400).json({
      timestamp: getCurrentDateTime(),
      error: true,
      message: error.message
    });
  }
});

// Update car (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true 
    });
    if (!car) {
      return res.status(404).json({
        timestamp: getCurrentDateTime(),
        error: true,
        message: 'Car not found'
      });
    }
    res.json({
      timestamp: getCurrentDateTime(),
      currentUser: 'OmkarNarayanBhal',
      message: 'Car updated successfully',
      data: car
    });
  } catch (error) {
    res.status(400).json({
      timestamp: getCurrentDateTime(),
      error: true,
      message: error.message
    });
  }
});

// Delete car (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({
        timestamp: getCurrentDateTime(),
        error: true,
        message: 'Car not found'
      });
    }
    res.json({
      timestamp: getCurrentDateTime(),
      currentUser: 'OmkarNarayanBhal',
      message: 'Car deleted successfully',
      data: car
    });
  } catch (error) {
    res.status(500).json({
      timestamp: getCurrentDateTime(),
      error: true,
      message: error.message
    });
  }
});

module.exports = router;