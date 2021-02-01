const express = require("express");
const Route = express.Router();
const tabel = require("../models/model-index");
const { auth, randomString, as } = require("../controllers/module");
const moduleCustom = require("../controllers/module");
const respon2 = require("../controllers/respon2");
const url = require("url");
const {Op} = require('sequelize');

// Definisikan
Route.get("/", async function (req, res) {
    const {order, book, member} = await tabel();
    const allOlder = await order.findAll();
    const resultBook = await book.findAll()
    const resultMember = await member.findAll({
      where: {
        isAdmin: false
      }
    })


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
    // console.log(await allOlder[0].getBook({
    //   attributes: ['id', 'book_title']
    // }))
    const coloumn = await Object.keys(order.rawAttributes);
    const without = ["id", "createdat", "updatedat"]
    res.render("table", {
        data: allOlder,
        select: {
            book_id : resultBook,
            member_id: resultMember
        },
        coloumn,
        without,
        modalwithout: [...without,`order_price`, 'id_transaction', `return_status`, 'order_date'],
        title: "Order list",
        active: "order",
        module: require("../controllers/module"),
        buttonHeader: {
          add: {
            class: 'fas fa-user mr-2',
            id: 'addActionButton'
          }
        },
        as: [
            new as({show: true, target: 'book_id', showName: 'Book', type: 'select', without: [0]}),
            new as({target: 'member_id', showName: 'Member', type: 'select',})
        ],
        buttonAction: false
    });
});



Route.post("/", async function (req, res) {
  try {
    const token = await auth(req, false);
    if (token) {
      const {order_day, member_id, book_id} = req.body;
      const bookId = req.body.book_id;
      const { order, book } = await tabel();
      const bookData = await book.findOne({
        where: {
          id: book_id,
        },
        raw: true,
      });

      const waktu = new Date().getTime();
      console.log(waktu)
      const codeTransaksi = randomString(26);
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
        order_date: waktu
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
    }
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
  await order.update({return_status: true}, {
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
      moduleCustom
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
