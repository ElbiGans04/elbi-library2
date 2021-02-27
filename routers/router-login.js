const express = require('express');
const Route = express.Router()
const respon2 = require('../controllers/respon');
const index = require(`../db/models/index`);
const ModuleLibrary = require('../controllers/module');
const moduleLibrary = new ModuleLibrary();
const jwt = require('jsonwebtoken');

// Definisikan
Route.get('/', (req, res) => res.render('login'));

Route.post('/', async function (req, res, next) {
    try {
        let { email, password: password2 } = req.body;

        // Jika ga ada
        if(!email || !password2) throw new respon2({message: 'email/password invalid', code: 200, alert: true})

        // Hashing
        password2 = moduleLibrary.hashing(password2);
    
        let result = await index.officer.findOne({
            where: {
                email,
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            include: {
                model: index.role,
                through: {
                    attributes: []
                },
            },
            raw: true
        });

        if(!result) throw new respon2({message: `accouunt not found`, code: 200});

        let {id, email: userEmail, password} = result;
        let roles = result['roles.name']
        if(password !== password2) throw new respon2({message: 'password wrong', code: 200})

        const token = jwt.sign({id, email: userEmail, role: roles}, process.env.APP_PRIVATE_KEY, {
            algorithm: 'RS256',
            expiresIn: '1d'
        });

        res.cookie('token', token, {
            maxAge: process.env.APP_MAX_AGE * 1000
        })


        // Kirim Respon
        res.json(new respon2({message: `success. the page will redirect in `, type: true, redirect: '/users', code: 200, delay: 3}))
        // res.json(new respon2({message: `success. the page will redirect in `, code: 200, delay: 3}))
        
    } catch (err) {
        next(err)
    }
    
})




// Export
module.exports = Route