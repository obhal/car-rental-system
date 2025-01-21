// server/src/routes/bookings.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const { auth, adminAuth } = require('../middleware/auth');

const CURRENT_TIMESTAMP = '2025-01-21 11:09:45';
const CURRENT_USER = 'OmkarNarayanBhal';

// Create booking
router.post('/', auth, async (req, res) => {
    try {
        const { carId, startDate, endDate } = req.body;
        
        // Check if car exists and is available
        const car = await Car.findById(carId);
        if (!car || !car.available) {
            return res.status(400).json({
                success: false,
                message: 'Car is not available',
                timestamp: CURRENT_TIMESTAMP,
                user: CURRENT_USER
            });
        }

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (start >= end) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date',
                timestamp: CURRENT_TIMESTAMP,
                user: CURRENT_USER
            });
        }

        // Calculate total price
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const totalPrice = days * car.price;

        const booking = new Booking({
            userId: req.user._id,
            carId,
            startDate: start,
            endDate: end,
            totalPrice,
            createdAt: CURRENT_TIMESTAMP,
            createdBy: CURRENT_USER,
            lastUpdated: CURRENT_TIMESTAMP,
            lastUpdatedBy: CURRENT_USER
        });

        await booking.save();
        
        // Update car availability
        car.available = false;
        car.lastUpdated = CURRENT_TIMESTAMP;
        car.lastUpdatedBy = CURRENT_USER;
        await car.save();

        await booking.populate('carId');

        res.status(201).json({
            success: true,
            data: booking,
            timestamp: CURRENT_TIMESTAMP,
            user: CURRENT_USER
        });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(400).json({
            success: false,
            message: error.message,
            timestamp: CURRENT_TIMESTAMP,
            user: CURRENT_USER
        });
    }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate({
                path: 'carId',
                select: 'name price brand model images'
            })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: bookings,
            timestamp: CURRENT_TIMESTAMP,
            user: CURRENT_USER
        });
    } catch (error) {
        console.error('Error in my-bookings:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            timestamp: CURRENT_TIMESTAMP,
            user: CURRENT_USER
        });
    }
});

// Get all bookings (admin only)
router.get('/', adminAuth, async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', '-password')
            .populate('carId')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: bookings,
            timestamp: CURRENT_TIMESTAMP,
            user: CURRENT_USER
        });
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            timestamp: CURRENT_TIMESTAMP,
            user: CURRENT_USER
        });
    }
});

// Update booking status (admin only)
router.patch('/:id/status', adminAuth, async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
                timestamp: CURRENT_TIMESTAMP,
                user: CURRENT_USER
            });
        }

        booking.status = status;
        booking.lastUpdated = CURRENT_TIMESTAMP;
        booking.lastUpdatedBy = CURRENT_USER;
        
        if (status === 'cancelled' || status === 'completed') {
            const car = await Car.findById(booking.carId);
            if (car) {
                car.available = true;
                car.lastUpdated = CURRENT_TIMESTAMP;
                car.lastUpdatedBy = CURRENT_USER;
                await car.save();
            }
        }

        await booking.save();
        await booking.populate('carId');
        await booking.populate('userId', '-password');

        res.json({
            success: true,
            data: booking,
            timestamp: CURRENT_TIMESTAMP,
            user: CURRENT_USER
        });
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(400).json({
            success: false,
            message: error.message,
            timestamp: CURRENT_TIMESTAMP,
            user: CURRENT_USER
        });
    }
});

module.exports = router;