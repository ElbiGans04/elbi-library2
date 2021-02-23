const express = require('express');
const Route = express.Router();
const model = require('../db/models/index');
const respon = require('../controllers/respon');
const ModuleLibrary = require('../controllers/module');
const moduleLibrary = new ModuleLibrary();

Route.get('/', async function(req, res){
    try {
        // ambil name
        let about = model.about;
        let {appName} = await about.findOne({
            raw: true,
            attributes: ['appName']
        });
        res.render('report', {
            appName,
            module: moduleLibrary,
            title: 'Damaged or lost books',
            name: req.user.email
        })
    } catch (err) {
        next(err)
    }
});

Route.get('/:id', async function(req,res, next){
    try {
        const order = model.order;
        const resultOrder = await order.findOne({
            where: {
                id_transaction: req.params.id,
                return_status: false
            }
        });
        
        if(!resultOrder) throw new respon({message: 'not found', code: 404});
        resultOrder.dataValues.book_id = await resultOrder.getBook({
            raw: true,
            attributes: ['id', [`book_title`, 'name'], ['book_price', 'price']]
        });

        resultOrder.dataValues.user_id = await resultOrder.getUser({
            raw: true,
            attributes: ['id', 'name']
        })

        res.json(new respon({message: 'success', code: 200, data: resultOrder}))
    } catch (err) {
        next(err)
    }
});


Route.post('/', async function(req, res, next){
    try {
        let { id, user, book } = req.body;
        const order = model.order;
        
        const resultOrder = await order.findOne({
            where: {
                user_id: user,
                book_id: book,
                id_transaction: id
            }
        });

        if(!resultOrder) throw new respon({message: 'order not found', code: 200});


        // Jika ada
        await order.update({
            return_status : true
        }, {
            where: {
                user_id: user,
                book_id: book,
                id_transaction: id
            }
        });

        res.json({message: 'success', type: true})
        
    } catch (err) {
        next(err)
    }
})

module.exports = Route