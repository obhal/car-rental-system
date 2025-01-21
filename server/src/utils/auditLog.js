// src/utils/auditLog.js
const TimestampService = require('../timestamp');

const createAuditLog = async ({ action, performedBy, targetUser, changes, details }) => {
    console.log('Audit Log:', {
        action,
        performedBy,
        targetUser,
        changes,
        details,
        timestamp: TimestampService.getCurrentTimestamp(),
        user: TimestampService.getCurrentUser()
    });
};

module.exports = {
    createAuditLog
};