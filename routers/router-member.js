const express = require('express');
const Route = express.Router()
const controllersMember = require('../controllers/controllers-member');

// Definisikan
Route.get('/', controllersMember.getAll)
Route.get('/:id', controllersMember.get);
Route.post('/', controllersMember.post)
Route.put('/:id', controllersMember.put);
Route.delete('/:id', controllersMember.delete);
module.exports = Route