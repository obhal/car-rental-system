// src/utils/notificationService.js
const TimestampService = require('../timestamp');

const createNotification = async ({ userId, type, message, referenceId }) => {
    console.log('Notification created:', {
        userId,
        type,
        message,
        referenceId,
        timestamp: TimestampService.getCurrentTimestamp(),
        user: TimestampService.getCurrentUser()
    });
};

module.exports = {
    createNotification
};