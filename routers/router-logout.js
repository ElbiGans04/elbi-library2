const express = require('express');
const Route = express.Router()
const controllersMember = require('../controllers/controllers-member');
// Definisikan
Route.get('/', controllersMember.logout)
module.exports = Route