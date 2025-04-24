const express = require('express');
const router = express.Router();

const userRoute = require('./user.route');
const employeeRoute = require('./employee.route');
const notificationRoute = require('./notification.route');

const routes = [
    { path: '/user', handler: userRoute },
    { path: '/employee', handler: employeeRoute },
    { path: '/notification', handler: notificationRoute },
];

routes.map((route) => router.use(route?.path, route?.handler));

const configureRoutes = (app) => app.use('/api', router);

module.exports = configureRoutes;
