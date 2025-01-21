// src/utils/validation.js
const TimestampService = require('../timestamp');

const validateBookingDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return {
            isValid: false,
            message: 'Invalid date format',
            timestamp: TimestampService.getCurrentTimestamp(),
            user: TimestampService.getCurrentUser()
        };
    }

    if (start < now) {
        return {
            isValid: false,
            message: 'Start date cannot be in the past',
            timestamp: TimestampService.getCurrentTimestamp(),
            user: TimestampService.getCurrentUser()
        };
    }

    if (end <= start) {
        return {
            isValid: false,
            message: 'End date must be after start date',
            timestamp: TimestampService.getCurrentTimestamp(),
            user: TimestampService.getCurrentUser()
        };
    }

    const maxDuration = 30 * 24 * 60 * 60 * 1000;
    if (end - start > maxDuration) {
        return {
            isValid: false,
            message: 'Booking duration cannot exceed 30 days',
            timestamp: TimestampService.getCurrentTimestamp(),
            user: TimestampService.getCurrentUser()
        };
    }

    return {
        isValid: true,
        message: 'Dates are valid',
        timestamp: TimestampService.getCurrentTimestamp(),
        user: TimestampService.getCurrentUser()
    };
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
        isValid: emailRegex.test(email),
        message: emailRegex.test(email) ? 'Valid email' : 'Invalid email format',
        timestamp: TimestampService.getCurrentTimestamp(),
        user: TimestampService.getCurrentUser()
    };
};

const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return {
        isValid: phoneRegex.test(phone),
        message: phoneRegex.test(phone) ? 'Valid phone number' : 'Invalid phone format',
        timestamp: TimestampService.getCurrentTimestamp(),
        user: TimestampService.getCurrentUser()
    };
};

module.exports = {
    validateBookingDates,
    validateEmail,
    validatePhone
};