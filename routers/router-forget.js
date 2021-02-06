const express = require('express');
const Route = express.Router();
const respon = require('../controllers/respon');
const tabel = require('../models/model-index')
const mail = require('../middleware/mailer');
const ModuleLibrary = require('../controllers/module');
const moduleLibrary = new ModuleLibrary();

Route.get('/', function(req, res){
    res.render('forget')
});

Route.get('/:token', async function(req, res){
    try {

        const token = req.params.token;
        let { member, forget } = await tabel();
        let waktu = new Date();

        const result = await forget.findOne({
            where: {
                token
            },
            raw: true
        });
        
        if(!result) throw new respon ({message: 'token is invalid', code: 200})
        if(waktu.getTime() > result.tokenExp) throw new respon ({message: 'token has expired', code: 200})
    
        res.render('updatePassword', {
            hiddenValue: token
        })
    } catch (err) {
        console.log(err);
        const code = err.code || 200
        res.status(code).json(err)
    }
});

Route.post('/update', async function(req, res){
    try {

        const token = req.body.token;
        let { member, forget } = await tabel();
    
        let waktu = new Date();
    
        const result = await forget.findOne({
            where: {
                token
            },
            raw: true
        });
        
        if(!result) throw new respon ({message: 'token is invalid. please try again', code: 200, delay: 3, redirect: '/forget'})
        if(waktu.getTime() > result.tokenExp) throw new respon ({message: 'token has expired', code: 200, delay: 3, redirect: '/forget'});
        
        await member.update(req.body, {
            where: {
                id: result.member_id
            }
        });

        res.json(new respon({message: 'success. will redirect in ', delay: 3, redirect: '/login', type: true}))
    } catch (err) {
        console.log(err);
        let code = err.code || 200 ;
        res.status(code).json(err)
    }
});

Route.post('/', async function(req, res){
    try {
        let {email} = req.body;
        let { member, forget } = await tabel();

        let user = await member.findOne({
            where: {
                email
            }
        })
        if (!user) throw new respon({message: 'member not found', code: 200})
        
        let random = moduleLibrary.randomString(15);
        let fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}/${random}
            \n exp in 1 hour
        `;
        let text = `${fullUrl}`;
        let option = {
            from: 'elbijr2@gmail.com',
            to: email,
            subject: 'Reset Password',
            text,
        };


        let waktu = new Date();
        waktu.setHours(waktu.getHours() + 1)
        
        mail.sendMail(option, function(err, info){
            if (err) throw err;
            console.log(`email sent ${info.response}`)
        });
        
        await forget.create({token: random, tokenExp: waktu.getTime(), member_id: user.id})

        // 
        res.json(new respon({message: 'success. please check your email', type: true}))

    } catch (err) {
        console.log(err)
        let code = err.code || 200;
        res.status(code).json(err);
    }
})

module.exports = Route