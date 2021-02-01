const express = require('express');
const Route = express.Router();
const respon2 = require('../controllers/respon2');
const jwt = require('jsonwebtoken');
const model = require('../models/model-index');
const {pesanError} = require('../controllers/module')
// Definisikan
Route.get('/', function (req, res) {
    res.render('register')
})
Route.post('/', async function(req, res){
    try {
        let { member } = await model();

        // Vadidation 
        let validation = await member.findAll({
            where : {
                email : req.body.email
            },
            raw: true
        });

        // Jika Tidak Ada
        if (validation.length > 0) throw new respon2({message: 'email already register', code: 200})
        let result = await member.create(req.body, {
            attribute: {
                excludes: ['isAdmin']
            }
        });
        const resultId = result.dataValues.id;
        const isAdmin = result.dataValues.isAdmin;

        const token = jwt.sign({id: resultId, isAdmin}, process.env.APP_PRIVATE_KEY, {
            expiresIn: '1d',
            algorithm: 'RS256'
        });

        res.cookie('token', token, {
            maxAge: process.env.APP_MAX_AGE * 1000
        });

        res.json(new respon2({message: 'Register successfully', redirect:'/', type: true}))
    } catch (err) {
        console.log(err)
        if(err instanceof Error) {
            if(err.errors) err.message = pesanError(err)
            else if(err.message == `Cannot read property 'originalname' of undefined`) err.message = 'please insert image'
            err = new respon2({message: err.message, code:200});
        }
        const code = err.code || 200;
        res.status(code).json(err)
    }
})
module.exports = Route