const express = require("express");
const Route = express.Router();
const tabel = require("../models/model-index");
const { auth, randomString } = require("../controllers/module");
const respon2 = require("../controllers/respon2");
const url = require("url");
// Definisikan
Route.get("/", async function (req, res) {
    const {order} = await tabel();
    const allOlder = await order.findAll({});
    const coloumn = await Object.keys(order.rawAttributes);
    res.render("table", {
        data: allOlder,
        coloumn,
        without: ["id", "createdat", "updatedat", 'id_transaction', 'order_status'],
        title: "Order list",
        active: "order",
        module: require("../controllers/module"),
        buttonAdd: "fas fa-user mr-2",
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

Route.post("/product/:id/confirmation", async function (req, res) {
  try {
    const token = await auth(req, false);
    if (token) {
      const bookId = req.params.id;
      const { order, book } = await tabel();
      const bookData = await book.findOne({
        where: {
          id: bookId,
        },
        raw: true,
      });

      const codeTransaksi = randomString(26);
      if (bookData == null)
        throw new respon2({ message: "book not found", code: 200 });
      if (bookData.book_stock <= 0)
        throw new respon2({ message: "out of stock", code: 200 });
      await order.create({
        member_id: token.id,
        book_id: bookId,
        id_transaction: codeTransaksi,
        order_price: bookData.book_price,
        order_day: req.body.day,
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
module.exports = Route;
