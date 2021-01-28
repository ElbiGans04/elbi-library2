const express = require('express');
const Route = express.Router()

Route.get('/', function(req, res){
    res.send("ok")
})

module.exports = Route