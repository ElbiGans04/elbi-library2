const express = require('express');
const Route = express.Router()
const respon2 = require('../controllers/respon');
const model = require('../models/model-index');
const ModuleLibrary = require('../controllers/module');
const moduleLibrary = new ModuleLibrary();
const jwt = require('jsonwebtoken');


// Definisikan
Route.get('/', function (req, res) {
    res.render('login')
});

Route.post('/', async function (req, res) {
    try {
        const { officer, role } = await model();
        let { email, password: password2 } = req.body;

        // Hashing
        password2 = moduleLibrary.hashing(password2)
    
        let result = await officer.findOne({
            where: {
                email,
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            include: {
                model: role,
                through: {
                    attributes: []
                },
            },
            raw: true
        });

        
        if(!result) throw new Error(`accouunt not found`)
        
        let {id, email: userEmail, password} = result;
        let roles = result['roles.name']
        if(password !== password2) throw new Error('password wrong')

        
        const token = jwt.sign({id, email: userEmail, role: roles}, process.env.APP_PRIVATE_KEY, {
            algorithm: 'RS256',
            expiresIn: '1d'
        });

        res.cookie('token', token, {
            maxAge: process.env.APP_MAX_AGE * 1000
        })
        res.json(new respon2({message: `success. the page will redirect in `, type: true, redirect: '/users', code: 200, delay: 3}))
        
    } catch (err) {
        console.log(err)
        if(err instanceof Error) {
            if(err.errors) err.message = moduleLibrary.pesanError(err);
            err = new respon2({message: err.message, code:200});
        }
        const code = err.code || 200;
        res.status(code).json(err)
    }
    
})
module.exports = Route