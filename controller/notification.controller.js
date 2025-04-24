const asyncWrapper = require('../middleware/asyncWrapper');
const {
    getAllNotificationServices,
    createNotificationServices,
    findByNotificationIdServices,
    updateNotificationByIdServices,
    deleteNotificationByIdService,
} = require('../service/notification.service');

const { GeneralError } = require('../utils/error');

/**
 * get all notification
 *
 * URI: /api/notification
 *
 * @param {req} req
 * @param {res} res
 * @param {next} next
 * @returns
 */
const index = asyncWrapper(async (req, res, next) => {
    let filters = { ...req.query };

    //  page, limit, -> exclude
    const excludeFields = ['page', 'limit'];
    excludeFields.forEach((field) => delete filters[field]);

    const queries = {};

    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queries.fields = fields;
    }

    // status filter
    if (req.query.status) {
        queries.status = new RegExp(queries.status, 'i');
    }

    if (req.query.page) {
        const { page = 1, limit = 6 } = req.query;
        const skip = (page - 1) * parseInt(limit);
        queries.skip = skip;
        queries.limit = parseInt(limit);
    }

    const result = await getAllNotificationServices(filters, queries);
    res.success(result, 'Notification list successfully');
});

/**
 * create notification
 *
 * URI: /api/notification
 *
 * @param {req} req
 * @param {res} res
 * @param {next} next
 * @returns
 */

const store = asyncWrapper(async (req, res, next) => {
    const { title, message } = req.body;

    const result = await createNotificationServices({
        title,
        message,
    });

    res.success(result, 'Notification create succssfully');
});

/**
 * get by notification id
 *
 * URI: /api/notification/:id
 *
 * @param {req} req
 * @param {res} res
 * @param {next} next
 * @returns
 */

const getById = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const result = await findByNotificationIdServices(id);
    res.success(result, 'Notification list successfully');
});

/**
 * update notification
 *
 * URI: /api/notification/:id
 *
 * @param {req} req
 * @param {res} res
 * @param {next} next
 * @returns
 */

const update = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const updateData = {
        status,
    };

    const result = await updateNotificationByIdServices(id, updateData);

    res.success(result, 'Notification update successfully');
});

/**
 * delete notification
 *
 * URI: /api/notification/:id
 *
 * @param {req} req
 * @param {res} res
 * @param {next} next
 * @returns
 */
const destroy = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const result = await deleteNotificationByIdService(id);
    if (!result.deletedCount) {
        throw new GeneralError("Could't delete the Notification.");
    }

    res.success(result, 'Notification delete successfully.');
});

module.exports = {
    index,
    store,
    destroy,
    update,
    getById,
};
