const express = require('express');
const Route = express.Router()
const controllersMember = require('../controllers/controllers-member');
// Definisikan
Route.get('/', function (req, res) {
    res.render('login')
})
Route.post('/', controllersMember.login)
module.exports = Route