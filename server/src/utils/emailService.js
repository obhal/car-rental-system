// src/utils/emailService.js
const TimestampService = require('../timestamp');

const sendBookingConfirmationEmail = async (userEmail, booking) => {
    console.log(`Booking confirmation email sent to ${userEmail}`, {
        ...booking,
        timestamp: TimestampService.getCurrentTimestamp(),
        user: TimestampService.getCurrentUser()
    });
};

const sendBookingStatusUpdateEmail = async (userEmail, { oldStatus, newStatus, bookingDetails }) => {
    console.log(`Booking status update email sent to ${userEmail}`, {
        oldStatus,
        newStatus,
        bookingDetails,
        timestamp: TimestampService.getCurrentTimestamp(),
        user: TimestampService.getCurrentUser()
    });
};

module.exports = {
    sendBookingConfirmationEmail,
    sendBookingStatusUpdateEmail
};