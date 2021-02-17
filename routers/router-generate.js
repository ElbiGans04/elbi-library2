module.exports = (model, title) => {
    const express = require('express');
    const Route = express.Router();
    const Group = require('./router-group');
    let group = new Group(model, title)
    
    Route.get('/', group.getAll);  
    Route.get('/:id', group.get);  
    Route.post('/', group.post);  
    Route.put('/:id', group.put);  
    Route.delete('/:id', group.delete);  


    return Route
}