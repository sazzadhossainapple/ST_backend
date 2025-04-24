const mongoose = require('mongoose');

// Branch schema design
const notificationSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },

        timestamp: { type: Date, default: Date.now },

        status: {
            type: Boolean,
            default: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
