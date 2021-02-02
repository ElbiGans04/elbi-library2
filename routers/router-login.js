const express = require('express');
const Route = express.Router()
const respon2 = require('../controllers/respon2');
const model = require('../models/model-index');
const {pesanError} = require('../controllers/module');
const jwt = require('jsonwebtoken');

// Definisikan
Route.get('/', function (req, res) {
    res.render('login')
})
Route.post('/', async function (req, res) {
    try {
        const { member } = await model();
        const { email, password: password2 } = req.body;
    
        let result = await member.findAll({
            where: {
                email
            },
            raw: true
        });
        
        if(result.length <= 0) throw new respon2({message: 'accouunt not found', code: 200})
        
        let {id, role, password} = result[0];
        if(password !== password2) throw new respon2({message: 'password wrong', code: 200})

        
        const token = jwt.sign({role, id}, process.env.APP_PRIVATE_KEY, {
            algorithm: 'RS256',
            expiresIn: '1d'
        });

        res.cookie('token', token, {
            maxAge: process.env.APP_MAX_AGE * 1000
        })
        res.json(new respon2({message: `success. the page will redirect in <strong> 3 seconds</strong>`, type: true, redirect: '/members', code: 200}))
        
    } catch (err) {
        if(err instanceof Error) {
            if(err.errors) err.message = pesanError(err);
            err = new respon2({message: err.message, code:200});
        }
        const code = err.code || 200;
        res.status(code).json(err)
    }
    
})
module.exports = Route