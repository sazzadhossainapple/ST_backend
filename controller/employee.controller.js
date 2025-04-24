const asyncWrapper = require('../middleware/asyncWrapper');
const fs = require('fs');
const path = require('path');
const Employee = require('../model/employee.model');

const { GeneralError } = require('../utils/error');
const uploadFile = require('../middleware/uploader');
const {
    getAllEmployeeServices,
    createEmployeeServices,
    findByEmployeeIdServices,
    updateEmployeeByIdServices,
    deleteEmployeeByIdService,
} = require('../service/employee.service');

/**
 * get all employee
 *
 * URI: /api/emplyee
 *
 * @param {req} req
 * @param {res} res
 * @param {next} next
 * @returns
 */
const index = asyncWrapper(async (req, res, next) => {
    let filters = {};

    //Status filter: Only add if it's explicitly 'true' or 'false'
    if (req.query.status === 'true') {
        filters.status = true;
    } else if (req.query.status === 'false') {
        filters.status = false;
    }

    // Department filter: Only add if it's not empty
    if (req.query.department && req.query.department.trim() !== '') {
        filters.department = new RegExp(req.query.department.trim(), 'i');
    }

    // Name Search (Case-Insensitive, Supports Partial Matches)
    if (req.query.name && req.query.name.trim() !== '') {
        filters.name = { $regex: new RegExp(req.query.name.trim(), 'i') };
    }

    // Pagination
    const queries = {};
    if (req.query.page) {
        const { page = 1, limit = 6 } = req.query;
        queries.skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        queries.limit = parseInt(limit, 10);
    }

    const result = await getAllEmployeeServices(filters, queries);
    res.success(result, 'Employee successfully');
});

/**
 * create employee
 *
 * URI: /api/employee
 *
 * @param {req} req
 * @param {res} res
 * @param {next} next
 * @returns
 */

const store = asyncWrapper(async (req, res, next) => {
    await uploadFile(req, res);
    const { name, email, phone, address, department } = req.body;

    const result = await createEmployeeServices({
        name,
        email,
        phone,
        address,
        department,
        image: req.file ? `images/${req.file.filename}` : '',
    });

    res.success(result, 'Employee create succssfully');
});

/**
 * get by employee id
 *
 * URI: /api/emplyee/:id
 *
 * @param {req} req
 * @param {res} res
 * @param {next} next
 * @returns
 */

const getById = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const result = await findByEmployeeIdServices(id);
    res.success(result, 'Employee successfully');
});

/**
 * update employee
 *
 * URI: /api/employee/:id
 *
 * @param {req} req
 * @param {res} res
 * @param {next} next
 * @returns
 */

const update = asyncWrapper(async (req, res, next) => {
    await uploadFile(req, res);

    const { id } = req.params;
    const { name, email, phone, address, department, status } = req.body;

    // Find the existing employee record
    const employee = await Employee.findById(id);
    if (!employee) {
        return res.error('Employee not found', 404);
    }

    const updateData = {
        name,
        email,
        phone,
        address,
        department,
        status,
    };

    if (req.file) {
        const image = `images/${req.file.filename}`;
        updateData.image = image;
    }

    // if (req.file) {
    //     // Delete previous image if it exists
    //     if (employee.image) {
    //         const oldImagePath = path.join(__dirname, '..', employee.image); // Correct image path
    //         if (fs.existsSync(oldImagePath)) {
    //             try {
    //                 fs.unlinkSync(oldImagePath); // Delete old image
    //                 console.log(
    //                     'Old image deleted successfully:',
    //                     oldImagePath
    //                 );
    //             } catch (err) {
    //                 console.error('Failed to delete old image:', err);
    //             }
    //         } else {
    //             console.warn('Old image not found:', oldImagePath);
    //         }
    //     }

    //     // Save the new image path relative to the 'images' folder
    //     updateData.image = `images/${req.file.filename}`;
    // }

    const result = await updateEmployeeByIdServices(id, updateData);

    res.success(result, 'Employee updated successfully');
});

/**
 * delete employee
 *
 * URI: /api/employee/:id
 *
 * @param {req} req
 * @param {res} res
 * @param {next} next
 * @returns
 */
const destroy = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const result = await deleteEmployeeByIdService(id);
    if (!result.deletedCount) {
        throw new GeneralError("Could't delete the employee.");
    }

    res.success(result, 'Employee delete successfully.');
});

module.exports = {
    index,
    store,
    destroy,
    update,
    getById,
};
