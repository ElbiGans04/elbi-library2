const express = require('express');
const Route = express.Router();
const respon = require('../controllers/respon');
const tabel = require('../db/models/index')
const mail = require('../middleware/mailer');
const ModuleLibrary = require('../controllers/module');
const moduleLibrary = new ModuleLibrary();

Route.get('/', function(req, res){
    res.render('forget')
});

Route.post('/', async function(req, res, next){
    try {
        let {email} = req.body;
        const officer = tabel.officer;
        const forget = tabel.forget;

        // Jika email tidak ada
        if(!email) throw new respon({message: `email not found`, code: 200, alert: true})

        let resultOfficer = await officer.findOne({
            where: {
                email
            }
        });

        // Jika tidak ditemukan
        if (!resultOfficer) throw new respon({message: 'not found', code: 200, alert: true})
        
        // Buat string random dan gabungkan dengan url
        let random = moduleLibrary.randomString(15);
        let fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}/${random}
            \n exp in 1 hour
        `;
        let text = `${fullUrl}`;

        // Option Saat kirim email
        let option = {
            from: 'elbijr2@gmail.com',
            to: email,
            subject: 'Reset Password',
            text,
        };

        // ambil waktu sekarang + 1 jam
        let waktu = new Date();
        waktu.setHours(waktu.getHours() + 1)
        

        // Kirim Email
        mail.sendMail(option, async function(err, info){
            if (err) throw err;
            console.log(`email sent ${info.response}`)

            // Buat entitas forget
            await forget.create({token: random, tokenExp: waktu.getTime(), officer_id: resultOfficer.id})
            // Kirim Respon
            res.json(new respon({message: 'success. please check your email', type: true, alert: true}))
        });
        

    } catch (err) {
        next(err)
    }
});

Route.get('/:token', async function(req, res, next){
    try {

        const token = req.params.token;
        const forget = tabel.forget;
        let waktu = new Date();

        const result = await forget.findOne({
            where: {
                token
            },
            raw: true
        });
        
        // Jika token tidak ditemukan didalam database / sudah lewat 1 jam
        if(!result || waktu.getTime() > result.tokenExp) return res.redirect('/forget');


        // Render
        res.render('updatePassword', {
            hiddenValue: token
        })
    } catch (err) {
        next(err)
    }
});

Route.post('/update', async function(req, res, next){
    try {

        const token = req.body.token;
        const officer = tabel.officer;
        const forget = tabel.forget;

        // Jika token ga ada
        if(!token) throw new respon({message: 'token not found', code: 200, alert: true})
    
        //hash
        req.body.password = moduleLibrary.hashing(req.body.password)

        // Ambil Waktu Sekarang
        let waktu = new Date();
        
        // Check apakah token ada
        const result = await forget.findOne({
            where: {
                token
            },
        });

        // Check Jika token valid & check apakah token exp
        if(!result) throw new respon ({message: 'token is invalid. please try again', code: 200, delay: 3, redirect: '/forget', alert:true})

        // Ambil data officer terkait
        const resultOfficer = await result.getOfficer({
            raw: true,
            attributes: ['email']
        })
        if(waktu.getTime() > result.tokenExp) throw new respon ({message: 'token has expired, please resend. The page will be redirected in ', code: 200, delay: 5, redirect: '/forget', alert: true});
        
        
        // Update
        await officer.update(req.body, {
            where: {
                id: result.officer_id
            }
        });

        // Delete Token
        await forget.destroy({
            where : {
                    token,
                    officer_id: result.officer_id
            }
        })

        // Option Saat kirim email
        let option = {
            from: 'elbijr2@gmail.com',
            to: resultOfficer.email,
            subject: 'Reset Password',
            text: 'successfully updated your password',
        };        

        // Kirim Email
        mail.sendMail(option, async function(err, info){
            if (err) throw err;
            console.log(`email sent ${info.response}`)
            
            // Kirim Respon
            res.json(new respon({message: 'success. will redirect in ', delay: 3, redirect: '/login', type: true, alert: true}))
        });
        
    } catch (err) {
        next(err)
    }
});



module.exports = Route