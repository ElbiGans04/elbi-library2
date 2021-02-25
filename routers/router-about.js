const express = require('express');
const Route = express.Router();
const ModuleLibrary = require('../controllers/module');
const moduleLibrary = new ModuleLibrary();
const model = require('../db/models/index');
const respon = require('../controllers/respon');

Route.get('/', async function (req, res, next){
    try {
        let result = await model.about.findOne({raw: true});
        res.render('about', {profile: req.user, result, module : moduleLibrary})
    } catch (err) {
        next(err);
    }
});

Route.post('/', async function(req, res, next){
    try {
        let {app, fines} = req.body;
        const about = model.about;
        if(!app || !fines) throw new respon({message: 'app name / fines not found', code: 200, alert: true});
        if(req.user.role == 'admin') throw new respon({message: 'not have permission', code: 200, alert: true});
        

        // Lakukan 
        app = moduleLibrary.encryptPub(app);
        await about.update({appName: app, fines}, {where: {
            id: 1
        }});

        res.json(new respon({message: 'success', code: 200, type: true, alert: true}))
        
    } catch (err) {
        next(err)
    }
})

module.exports = Route