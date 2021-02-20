const express = require('express');
const Route = express.Router();
const tabel = require('../models/model-index');
let Template = require('../controllers/module');
let moduleLibrary = new Template();

Route.get('/', async function(req, res){
    let { role, id: userID } = req.user;
    let {order, user, officer} = await tabel();


    // Cari Orderan dengan 
    const resultActive = await order.findAll({
      where: {
        return_status: 'has been returned'
      },
      attributes: [`id`],
      raw: true, 
    });

    // Cari 
    const resultOfficer = await officer.count()

    
    const resultUser = await user.findAll({
      attributes: ['name', 'id'],
      raw: true
    })

    const allOlder = await order.findAll({
      attributes: [`order_date`, 'order_day'],
      raw: true, 
    });
    
    let lateToPay = [];
    let orderDay = 0;
    let name = '';
    // Menghitung orderan yang jatuh tempo dan menghitung rata" orderan
    allOlder.forEach(function(el, i){
      let { days } = moduleLibrary.getTime(el.order_date, el.order_day);
      if(days > 0) lateToPay.push(days)

      // Hitung rata rata orderan
      if(allOlder.length > 0) orderDay += el.order_day
    });

    if(allOlder.length > 0) orderDay = Math.floor(orderDay / allOlder.length)
    
    resultUser.forEach(function(e,i){
      if(e.id == userID) {
        name += e.email
      }
    })

    res.render('index', {
      role,
      resultActive: resultActive.length,
      allOlder: allOlder.length,
      lateToPay: lateToPay.length,
      orderDay,
      users: resultUser.length,
      officer: resultOfficer,
      name: req.user.email,
    })
});

module.exports = Route