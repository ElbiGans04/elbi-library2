const express = require('express');
const Route = express.Router();
const tabel = require('../models/model-index');
const moduleCustom = require('../controllers/module')

Route.get('/', async function(req, res){
    const {order} = await tabel();
    const dataOrder = await order.findAll();

    for(let index in dataOrder) {
        const dataOrderMember = await dataOrder[index].getMember({attributes: ['email', 'id'],raw:true});
        const dataOrderBook = await dataOrder[index].getBook({attributes: ['book_title', 'id'],raw:true});

        dataOrder[index].dataValues.member_id = {title: dataOrderMember.email, id: dataOrderMember.id};
        dataOrder[index].dataValues.book_id = {title: dataOrderBook.book_title, id: dataOrderBook.id};
    }   

    res.render('returnBook', {
        dataOrder,
        show: [`member_id`, `book_id`],
        moduleCustom
    })
})

module.exports = Route