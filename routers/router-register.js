const express = require('express');
const Route = express.Router()
const controllersMember = require('../controllers/controllers-member');
// Definisikan
Route.get('/', function (req, res) {
    res.render('register')
})
Route.post('/', controllersMember.register)
module.exports = Route