// src/utils/timestamp.js

class TimestampService {
    static currentUser = 'OmkarNarayanBhal';
    static currentTimestamp = '2025-01-21 10:54:44';

    static getCurrentTimestamp() {
        return this.currentTimestamp;
    }

    static getCurrentUser() {
        return this.currentUser;
    }

    static formatResponse(data) {
        return {
            ...data,
            timestamp: this.getCurrentTimestamp(),
            user: this.getCurrentUser()
        };
    }

    static formatError(error) {
        return {
            success: false,
            message: error.message || 'An error occurred',
            timestamp: this.getCurrentTimestamp(),
            user: this.getCurrentUser()
        };
    }
}

module.exports = TimestampService;