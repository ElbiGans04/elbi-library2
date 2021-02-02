const express = require('express');
const Route = express.Router()
// Definisikan
Route.get('/', function(req, res){
    res.cookie('token', {}, {
        maxAge: -1000000
    });

    console.log("Cookie Telah Dihapus");
    res.redirect('/login')
})
module.exports = Route