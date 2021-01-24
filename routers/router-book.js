const express = require('express');
const Route = express.Router()
const controllersBook = require('../controllers/controllers-book');

// Definisikan
Route.get('/', controllersBook.getAll)
Route.get('/:id', controllersBook.get);
Route.post('/', controllersBook.post)
Route.put('/:id', controllersBook.put);
Route.delete('/:id', controllersBook.delete);
module.exports = Route