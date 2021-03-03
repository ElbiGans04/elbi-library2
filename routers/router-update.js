const express = require('express');
const Route = express.Router();
const ModuleLibrary = require('../controllers/module');
const respon = require('../controllers/respon');
const moduleLibrary = new ModuleLibrary();
const model = require('../db/models/index');
const { Op } = require('sequelize');

Route.get('/', async function(req, res, next) {
    try {
        const about = model.about;
        const {appName} = await about.findOne({
            where: {
                id: 1
            },
            raw: true,
            attributes: ['appName']
        });
        

        result = req.user

        
        res.render('updateProfile', {
            profile: req.user,
            module: moduleLibrary,
            appName,
            result,
        })

        // res.send("OK")
    } catch (err) {
        next(err)
    };
});

Route.put('/:id', async function(req, res, next){
    try {
        const id = req.params.id;
        const officer = model.officer;

        // Check
        let validate = await officer.findOne({
            where: {
                id
            }
        });

        // Jika tidak ditemukan
        if(!validate) throw new respon({message: 'officer not found', code: 200, alert: true});
        
        // Jika email sudah ada
        let validate2 = await officer.findOne({
            where: {
                email : req.body.email,
                id: {
                    [Op.not] : id
                }
            }
        });

        // Jika tidak ditemukan
        if(validate2) throw new respon({message: 'email already', code: 200, alert: true});


        // Check Apakah officer yang ditemukan sama dengan yang login sekarang
        if(validate.dataValues.id != req.user.id) throw new respon({message: 'invalid', code:200, alert: true});


        // Encryp password
        req.body.password = moduleLibrary.hashing(`${req.body.password}`);

        // Update
        await officer.update({email: req.body.email, password: req.body.password}, {
            where: {
                id
            }
        });
    
        res.json(new respon({message: "successfully updated data", code: 200, type: true, alert: true, redirect: '/logout'}))
    } catch (err) {
        next(err)
    }
})

module.exports = Route