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


        // Cari order
        const resultOrder = await order.findOne({
            where: {
                id_transaction: req.params.id,
                return_status: false
            },
            attributes: ['book_id', 'user_id', ['order_date', 'order_rental_time'], 'order_price', ['order_day', 'order_duration']]
        });
        
        // Jika tidak ada
        if(!resultOrder) throw new respon({message: 'not found', code: 200, alert: true});

        // Ambil Dari relasi buku
        let resultBook = await resultOrder.getBook({
            raw: true,
            attributes: [[`book_title`, 'nameBook'], ['book_price', 'priceBook']]
        });

        let harga = parseInt(resultOrder.dataValues.order_price);
        

        resultOrder.dataValues.order_book = resultBook.nameBook;
        resultOrder.dataValues.order_price = resultBook.priceBook;
        delete resultOrder.dataValues.book_id;
        
        let resultUser = resultOrder.dataValues.user_id = await resultOrder.getUser({
            raw: true,
            attributes: ['name']
        });


        resultOrder.dataValues.order_user = resultUser.name;
        delete resultOrder.dataValues.user_id;

        
        // ubah Date;
        let waktu = new Date(parseInt(resultOrder.dataValues.order_rental_time))
        resultOrder.dataValues.order_rental_time = `${waktu.getFullYear()}/${waktu.getMonth()}/${waktu.getDate()}`;
        let { days } = moduleLibrary.getTime(waktu.getTime(), resultOrder.dataValues.order_duration);
        resultOrder.dataValues.order_price += (days * harga) + (resultOrder.dataValues.order_duration * harga);

        
        
        res.json(new respon({message: 'success', code: 200, data: resultOrder, type: true}))
    } catch (err) {
        next(err)
    }
});


Route.post('/:id', async function(req, res, next){
    try {
        let id = req.params.id;
        const order = model.order;
        const report = model.report;
        
        const resultOrder = await order.findOne({
            where: {
                id_transaction: id,
                return_status: false
            },
        });

        
        
        // Ambil Data Dari entitas
        let resultUser = await resultOrder.getUser();
        let resultBook = await resultOrder.getBook();
        
        // Jika tidak ada
        if(!resultOrder || !resultUser || !resultBook) throw new respon({message: 'order not found', code: 200});
        
        // Hitung Denda
        let waktu = new Date(parseInt(resultOrder.dataValues.order_date))
        waktuBaru = `${waktu.getFullYear()}/${waktu.getMonth() + 1}/${waktu.getDate()}`;
        let {days} = moduleLibrary.getTime(waktu.getTime(), parseInt(resultOrder.dataValues.order_day));
        let price = resultOrder.dataValues.order_price;
        let total = (days * price) + (price * resultOrder.dataValues.order_day) + resultBook.dataValues.book_price;
        
        // Jika ada  
        await order.update({
            return_status : true
        }, {
            where: {
                id_transaction: id
            }
        });


        // Report
        let reportCreate = await report.create({id_transaction: id, date: waktuBaru, price: total});
        await reportCreate.setUsers(resultUser);
        await reportCreate.setBooks(resultBook);

        res.json({message: 'success', type: true, alert: true, redirect: '/report'})
        
    } catch (err) {
        next(err)
    }
})

module.exports = Route