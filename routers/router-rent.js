const express = require("express");
const Route = express.Router();
const tabel = require("../models/model-index");
const { auth, randomString, as } = require("../controllers/module");
const moduleCustom = require("../controllers/module");
const respon2 = require("../controllers/respon2");
const url = require("url");
// Definisikan
Route.get("/", async function (req, res) {
    const {order, book, member} = await tabel();
    const allOlder = await order.findAll();
    const resultBook = await book.findAll()
    const resultMember = await member.findAll({})


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
        modalwithout: [...without,`order_price`, 'id_transaction', `return_status`],
        title: "Order list",
        active: "order",
        module: require("../controllers/module"),
        buttonHeader: {
          add: {
            class: 'fas fa-user mr-2',
            id: 'addActionButton'
          },
          return: {
            class: 'fas fa-user mr-2',
            id: 'returnButton'
          },
          
        },
        as: [
            new as({show: true, target: 'book_id', showName: 'Book', type: 'select', without: [0]}),
            new as({target: 'member_id', showName: 'Member', type: 'select',})
        ],
        buttonAction: false
    });
});

Route.get("/product", async function (req, res) {
  const { book } = await tabel();
  const result = await book.findAll({
    raw: true,
  });

  res.render("order", {
    result,
  });
});

Route.get("/product/:id", async function (req, res) {
  const id = req.params.id;
  const { book } = await tabel();
  let result = await book.findOne({
    where: {
      id,
    },
    raw: true,
  });

  result.book_image = result.book_image.toString("base64");

  res.render("product", {
    result,
  });
});

Route.get("/product/:id/confirmation", async function (req, res) {
  const { member } = await tabel();
  const user = await member.findAll();
  res.render("confirmation", {
    user,
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

Route.get("/success", function (req, res) {
  const alamat = url.parse(req.url, true).query;
  res.render("success");
});

Route.delete('/', function(req, res){
  console.log(req.body)
  res.send("Allright")
});

Route.get('/return', async function(req, res){
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
module.exports = Route;
