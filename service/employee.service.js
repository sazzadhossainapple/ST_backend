const Employee = require('../model/employee.model');
const fs = require('fs');
const path = require('path');

// get all Employee
const getAllEmployeeServices = async (filters, queries) => {
    const Employees = await Employee.find(filters)
        .skip(queries.skip)
        .limit(queries.limit)
        .sort({
            createdAt: -1,
            updatedAt: -1,
        });

    const totalEmployeeLists = await Employee.countDocuments(filters);
    const page = Math.ceil(totalEmployeeLists / queries.limit);
    return { totalEmployeeLists, page, Employees };
};

// create Employee
const createEmployeeServices = async (EmployeeInfo) => {
    return await Employee.create(EmployeeInfo);
};

//  find Employee
const findByEmployeeIdServices = async (id) => {
    return await Employee.findOne({ _id: id });
};
// update  Employee
const updateEmployeeByIdServices = async (id, data) => {
    return await Employee.updateOne(
        { _id: id },
        { $set: data },
        {
            runValidators: true,
        }
    );
};

// delete by id
const deleteEmployeeByIdService = async (id) => {
    const employee = await Employee.findById(id);

    if (!employee) {
        throw new Error('Employee not found.');
    }

    // Check if there is an image associated with the employee
    if (employee.image) {
        const imageFileName = path.basename(employee.image);
        const imagePath = path.join(__dirname, '..', 'images', imageFileName);

        // Check if the file exists before attempting deletion
        if (fs.existsSync(imagePath)) {
            try {
                fs.unlinkSync(imagePath);
                console.log('Image deleted successfully:', imagePath);
            } catch (err) {
                console.error('Failed to delete image:', err);
            }
        } else {
            console.warn('Image file not found:', imagePath);
        }
    }

    const result = await Employee.deleteOne({ _id: id });
    return result;
};

module.exports = {
    getAllEmployeeServices,
    createEmployeeServices,
    findByEmployeeIdServices,
    updateEmployeeByIdServices,
    deleteEmployeeByIdService,
};
