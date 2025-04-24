const Notification = require('../model/notification.model');
const { getIO } = require('../utils/io');
Notification;
// get all Notification
const getAllNotificationServices = async (filters, queries) => {
    const Notifications = await Notification.find(filters)
        .skip(queries.skip)
        .limit(queries.limit)
        .sort({
            createdAt: -1,
            updatedAt: -1,
        });
    const totalNotificationLists = await Notification.countDocuments(filters);
    const page = Math.ceil(totalNotificationLists / queries.limit);
    return { totalNotificationLists, page, Notifications };
};

// create Notification
const createNotificationServices = async (NotificationInfo) => {
    const notification = await Notification.create(NotificationInfo);

    // Emit the notification to all connected clients
    const io = getIO();
    io.emit('new-notification', notification);

    return notification;
};

//  find Notification
const findByNotificationIdServices = async (id) => {
    return await Notification.findOne({ _id: id });
};
// update  Notification
const updateNotificationByIdServices = async (id, data) => {
    return await Notification.updateOne(
        { _id: id },
        { $set: data },
        {
            runValidators: true,
        }
    );
};

// delete by id
const deleteNotificationByIdService = async (id) => {
    const result = await Notification.deleteOne({ _id: id });
    return result;
};

module.exports = {
    getAllNotificationServices,
    createNotificationServices,
    findByNotificationIdServices,
    updateNotificationByIdServices,
    deleteNotificationByIdService,
};
