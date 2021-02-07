const express = require('express');
const Route = express.Router();
const tabel = require('../models/model-index');

Route.get('/', async function(req, res){
    let { role, id: userID } = req.user;
    let {order, user} = await tabel();
    let Template = require('../controllers/module');
    let moduleLibrary = new Template();
    const resultActive = await order.findAll({
      where: {
        return_status: false
      },
      attributes: [`id`],
      raw: true, 
    });
    
    const resultUser = await user.findAll({
      attributes: ['email', 'id'],
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
      let { days } = moduleLibrary.getTime(el.order_date);
      if(days > 0) lateToPay.push(days)

      // Hitung rata rata orderan
      if(allOlder.length > 0) orderDay += el.order_day
    });

    if(allOlder.length > 0) orderDay = orderDay / allOlder.length
    
    resultUser.forEach(function(e,i){
      if(e.id == userID) {
        name += e.email
      }
    })

    res.render('index', {
      role,
      resultActive,
      allOlder,
      lateToPay: lateToPay.length,
      orderDay,
      users: resultUser,
      name,
    })
});

module.exports = Route