const express = require('express');
const route = express.Router();

const homeController = require('./src/Controllers/homeController');
const loginController = require('./src/Controllers/loginController');

// Home Routes
route.get('/', homeController.index);

// Login Routes
route.get('/login', loginController.index);
route.post('/login/register', loginController.register);
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logout);


module.exports = route;