const express = require("express");
const Route = express.Router();
const tabel = require("../models/model-index");
const ModuleTemplate = require('../controllers/module');
const  moduleLibrary = new ModuleTemplate();
const respon2 = require("../controllers/respon");
const url = require("url");
const {Op} = require('sequelize');


// Definisikan
Route.get("/", async function (req, res) {
    let { role } = req.user;
    const {order, book, member, Op} = await tabel();
    const allOlder = await order.findAll();
    const resultBook = await book.findAll({
      raw: true
    })
    const resultMember = await member.findAll({
      where: {
          role : 'user'
      }, 
      raw: true
    });
    
    let newResultBook = moduleLibrary.selectModal(resultBook, 'book_title');
    let newResultMember = moduleLibrary.selectModal(resultMember, 'email');
    
    // Mengambil Data dari tabel relasi
    for(let value in allOlder) {
      const memberId = allOlder[value].dataValues.member_id;
      const bookId = allOlder[value].dataValues.book_id;
      const result = await allOlder[value].getBook({
        raw: true,
        attributes: ['id', 'book_title']
      });
      const result2 = await allOlder[value].getMember({
        raw: true,
        attributes: ['id', 'email']
      });

      allOlder[value].dataValues.book_id = {title: result.book_title, id: result.id};
      allOlder[value].dataValues.member_id = {title: result2.email, id: result2.id};
    }

    const coloumn = await Object.keys(order.rawAttributes);
    const without = ["id", "createdat", "updatedat"]
    res.render("table", {
        data: allOlder,
        role,
        coloumn,
        without,
        modalwithout: [...without,`order_price`, 'id_transaction', `return_status`, 'order_date', `librarian_buy`, 'librarian_return'],
        title: "Order list",
        active: "order",
        module: moduleLibrary,
        role,
        buttonHeader: {
          add: {
            class: 'fas fa-user mr-2',
            id: 'addActionButton'
          }
        },
        as: [
            moduleLibrary.as({show: true, target: 'book_id', showName: 'Book', type: 'select', without: [0], value: newResultBook}),
            moduleLibrary.as({target: 'member_id', showName: 'Member', type: 'select', value: newResultMember})
        ],
        buttonAction: false
    });
});



Route.post("/", async function (req, res) {
  try {
    const token = req.user
    const {order_day, member_id, book_id} = req.body;
    const bookId = req.body.book_id;
    const { order, book } = await tabel();
    const bookData = await book.findOne({
      where: {
        id: book_id,
      },
      raw: true,
    });

    let waktu = new Date();
    waktu.setDate(waktu.getDate() + parseInt(req.body.order_day));
    waktu = waktu.getTime();
    const codeTransaksi =  moduleLibrary.randomString(26);
    if (bookData == null)
      throw new respon2({ message: "book not found", code: 200 });
    if (bookData.book_stock <= 0)
      throw new respon2({ message: "out of stock", code: 200 });
    await order.create({
      member_id,
      book_id,
      id_transaction: codeTransaksi,
      order_price: bookData.book_price,
      order_day,
      order_date: waktu,
      librarian_buy: token.id,
    });
    await book.update(
      { book_stock: bookData.book_stock - 1 },
      {
        where: {
          id: bookId,
        },
      }
    );
    res.json(
      new respon2({
        message: codeTransaksi,
        code: 200,
        type: true,
        redirect: true,
      })
    );

  } catch (err) {
    console.log(err);
    const code = err.code || 500;
    res.status(code).json(err);
  }
});



Route.delete('/', async function(req, res){
  const {order} = await tabel();
  let { member, book, id_transaction } = req.body;
  
  // Check Apakah Orderan tsb ada
  const resultOrder = await order.findAll({
    where: {
      [Op.and] : {
        member_id: member,
        book_id: book,
        id_transaction
      }
    }
  });

  // Jika Ga ada
  if(resultOrder.length <= 0) throw new respon2({message: 'not found. Please check again'});

  // Logic
  await order.update({return_status: true, librarian_return: req.user.id}, {
    where: {
      [Op.and] : {
        member_id: member,
        book_id: book,
        id_transaction
      }
    }
  })
  res.json(new respon2({message: 'success', code: 200}))
});

Route.get('/return', async function(req, res){
  const {order} = await tabel();
  const dataOrder = await order.findAll({
    where: {
      [Op.not] : {
        return_status: true
      }
    }
  });

  for(let index in dataOrder) {
      const dataOrderMember = await dataOrder[index].getMember({attributes: ['email', 'id'],raw:true});
      const dataOrderBook = await dataOrder[index].getBook({attributes: ['book_title', 'id', `book_fines`],raw:true});

      dataOrder[index].dataValues.member_id = {title: dataOrderMember.email, id: dataOrderMember.id};
      dataOrder[index].dataValues.book_id = {title: dataOrderBook.book_title, id: dataOrderBook.id, fines: dataOrderBook.book_fines};
  }   
  
  res.render('returnBook', {
      dataOrder,
      show: [`member_id`, `book_id`],
      moduleCustom : moduleLibrary
  })
});

Route.get('/return/:id', async function(req, res){
  const paramId = req.params.id;
  const {order} = await tabel();
  
  const dataOrder = await order.findAll({
    where: {
      [Op.and] : {
        member_id : paramId,
        return_status: false
      }
    }
  });

  for(let index in dataOrder) {
    const dataOrderMember = await dataOrder[index].getMember({attributes: ['email', 'id', 'book_fines'],raw:true});
    const dataOrderBook = await dataOrder[index].getBook({attributes: ['book_title', 'id'],raw:true});

    dataOrder[index].dataValues.member_id = {title: dataOrderMember.email, id: dataOrderMember.id};
    dataOrder[index].dataValues.book_id = {title: dataOrderBook.book_title, id: dataOrderBook.id, fines: dataOrderBook.book_fines};
  };

  res.json(dataOrder)
});
module.exports = Route;
