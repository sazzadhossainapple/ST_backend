const userController = require('./user.controller');
const employeeController = require('./employee.controller');
const notificationController = require("./notification.controller");

const controllers = {
    userController: userController,
    employeeController: employeeController,
    notificationController: notificationController,
};

module.exports = controllers;
