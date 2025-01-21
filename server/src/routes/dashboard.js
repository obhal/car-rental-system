// server/src/routes/dashboard.js
const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { adminAuth } = require('../middleware/auth');

const CURRENT_TIMESTAMP = '2025-01-21 11:07:04';
const CURRENT_USER = 'OmkarNarayanBhal';

// Dashboard Overview Stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    // Get counts and stats
    const [
      totalBookings,
      activeBookings,
      totalCars,
      availableCars,
      totalRevenue
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'confirmed' }),
      Car.countDocuments(),
      Car.countDocuments({ available: true }),
      Booking.aggregate([
        {
          $match: { status: { $in: ['confirmed', 'completed'] } }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalPrice' }
          }
        }
      ])
    ]);

    // Get recent bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email')
      .populate('carId', 'name model');

    // Get popular cars
    const popularCars = await Booking.aggregate([
      {
        $group: {
          _id: '$carId',
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { bookings: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'cars',
          localField: '_id',
          foreignField: '_id',
          as: 'carInfo'
        }
      }
    ]);

    // Get booking trends
    const bookingTrends = await Booking.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 7 }
    ]);

    res.json({
      timestamp: CURRENT_TIMESTAMP,
      userInfo: {
        login: CURRENT_USER
      },
      overview: {
        totalBookings,
        activeBookings,
        totalCars,
        availableCars,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      recentActivity: {
        bookings: recentBookings.map(booking => ({
          id: booking._id,
          user: booking.userId?.name || 'Unknown User',
          car: booking.carId?.name || 'Unknown Car',
          status: booking.status,
          startDate: booking.startDate,
          endDate: booking.endDate,
          totalPrice: booking.totalPrice
        }))
      },
      popularCars: popularCars.map(car => ({
        name: car.carInfo[0]?.name || 'Unknown Car',
        model: car.carInfo[0]?.model || 'Unknown Model',
        bookings: car.bookings,
        revenue: car.revenue,
        imageUrl: car.carInfo[0]?.imageUrl
      })),
      trends: {
        bookings: bookingTrends.map(trend => ({
          date: trend._id,
          bookings: trend.bookings,
          revenue: trend.revenue
        }))
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      timestamp: CURRENT_TIMESTAMP,
      userInfo: {
        login: CURRENT_USER
      },
      message: 'Error fetching dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Detailed Car Analytics
router.get('/cars/analytics', adminAuth, async (req, res) => {
  try {
    const carAnalytics = await Car.aggregate([
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'carId',
          as: 'bookings'
        }
      },
      {
        $project: {
          name: 1,
          model: 1,
          year: 1,
          price: 1,
          available: 1,
          totalBookings: { $size: '$bookings' },
          revenue: {
            $sum: {
              $map: {
                input: '$bookings',
                as: 'booking',
                in: { 
                  $cond: [
                    { $in: ['$$booking.status', ['confirmed', 'completed']] },
                    '$$booking.totalPrice',
                    0
                  ]
                }
              }
            }
          }
        }
      },
      { $sort: { totalBookings: -1 } }
    ]);

    res.json({
      timestamp: CURRENT_TIMESTAMP,
      userInfo: {
        login: CURRENT_USER
      },
      carAnalytics
    });

  } catch (error) {
    console.error('Car analytics error:', error);
    res.status(500).json({ 
      timestamp: CURRENT_TIMESTAMP,
      userInfo: {
        login: CURRENT_USER
      },
      message: 'Error fetching car analytics' 
    });
  }
});

// Booking Analytics
router.get('/bookings/analytics', adminAuth, async (req, res) => {
  try {
    const bookingAnalytics = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    const monthlyTrends = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      timestamp: CURRENT_TIMESTAMP,
      userInfo: {
        login: CURRENT_USER
      },
      statusDistribution: bookingAnalytics,
      monthlyTrends: monthlyTrends.map(trend => ({
        period: `${trend._id.year}-${trend._id.month.toString().padStart(2, '0')}`,
        bookings: trend.bookings,
        revenue: trend.revenue
      }))
    });

  } catch (error) {
    console.error('Booking analytics error:', error);
    res.status(500).json({ 
      timestamp: CURRENT_TIMESTAMP,
      userInfo: {
        login: CURRENT_USER
      },
      message: 'Error fetching booking analytics' 
    });
  }
});

module.exports = router;