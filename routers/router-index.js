const express = require('express');
const Route = express.Router();
const tabel = require('../models/model-index');

Route.get('/', async function(req, res){
    let { role } = req.user;
    let {order, member} = await tabel();
    let Template = require('../controllers/module');
    let moduleLibrary = new Template();
    const resultActive = await order.findAll({
      where: {
        return_status: false
      },
      attributes: [`id`],
      raw: true, 
    });
    
    const resultMember = await member.findAll({
      attributes: ['id'],
      raw: true
    })

    const allOlder = await order.findAll({
      attributes: [`order_date`, 'order_day'],
      raw: true, 
    });
    
    let lateToPay = [];
    let orderDay = 0;
    allOlder.forEach(function(el, i){
      let { days } = moduleLibrary.getTime(el.order_date);
      if(days > 0) lateToPay.push(days)

      // Hitung rata rata orderan
      if(allOlder.length > 0) orderDay += el.order_day
    })

    if(allOlder.length > 0) orderDay = orderDay / allOlder.length
    
    res.render('index', {
      role,
      resultActive,
      allOlder,
      lateToPay: lateToPay.length,
      orderDay,
      users: resultMember
    })
});

module.exports = Route