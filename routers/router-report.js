const express = require('express');
const Route = express.Router();
const model = require('../db/models/index');
const respon = require('../controllers/respon');

Route.get('/', function(req, res){
    res.render('report', {
        title: 'Damaged or lost books',
        name: req.user.email
    })
});

Route.get('/:id', async function(req,res){
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
        console.log(err)
        const code = err.code || 200
        res.status(code).json(err)
    }
});


Route.post('/', async function(req, res){
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
        console.log(err)
        const code = err.code || 200
        res.status(code).json(err)
    }
})

module.exports = Route