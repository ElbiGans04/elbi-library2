const express = require('express');
const Route = express.Router();
const tabel = require('../models/model-index');

Route.get('/', async function(req, res){
    let { role } = req.user;
    let {order} = await tabel();
    let { getTime } = require('../controllers/module');
    const resultActive = await order.findAll({
      where: {
        return_status: false
      },
      attributes: [`id`],
      raw: true, 
    });
    
    const allOlder = await order.findAll({
      attributes: [`order_date`],
      raw: true, 
    });
    
    let lateToPay = [];
    allOlder.forEach(function(el, i){
      let { days } = getTime(el.order_date);
      if(days > 0) lateToPay.push(days)
    })
    
    res.render('index', {
      resultActive,
      allOlder,
      lateToPay: lateToPay.length,
      role,
    })
});

module.exports = Route