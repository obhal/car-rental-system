// src/utils/dateFormatter.js

class DateFormatter {
    static currentUser = 'OmkarNarayanBhal';
    static currentTimestamp = '2025-01-21 10:58:13';

    static formatDate(date) {
        if (!date) {
            return this.currentTimestamp;
        }

        const d = new Date(date);
        return d.toISOString().slice(0, 19).replace('T', ' ');
    }

    static addAuditInfo(obj) {
        return {
            ...obj,
            createdAt: this.currentTimestamp,
            createdBy: this.currentUser,
            lastUpdated: this.currentTimestamp,
            lastUpdatedBy: this.currentUser
        };
    }

    static updateAuditInfo(obj) {
        return {
            ...obj,
            lastUpdated: this.currentTimestamp,
            lastUpdatedBy: this.currentUser
        };
    }

    static getAuditLog(action) {
        return {
            action,
            timestamp: this.currentTimestamp,
            user: this.currentUser,
            environment: process.env.NODE_ENV || 'development'
        };
    }
}

module.exports = DateFormatter;