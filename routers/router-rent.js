const express = require("express");
const Route = express.Router();
const tabel = require("../models/model-index");
const ModuleTemplate = require("../controllers/module");
const moduleLibrary = new ModuleTemplate();
const respon2 = require("../controllers/respon");
const { Op } = require("sequelize");

// Definisikan
Route.get("/", async function (req, res) {
  try {
    // Ambil Role dan id dari req.user
    let { role, id: userID, email: officerEmail } = req.user;

    // Import Model
    const { order, book, user, Op } = await tabel();

    // Ambil Semua Orderan
    const allOlder = await order.findAll();

    // Ambil Semua Buku
    const resultBook = await book.findAll({
      raw: true,
      attributes: ["id", ["book_title", "value"]],
    });

    // Ambil semua user dengan role user BUKAN ADMIN & LIBRARIAN
    const resultMember = await user.findAll({
      raw: true,
      attributes: ['id', ["name", "value"]]
    });



    // Mengambil Data dari tabel relasi
    for (let value in allOlder) {

      // Ubah Format waktu
      let jam = new Date(allOlder[value].dataValues.order_date);
      allOlder[value].dataValues.order_date = `${jam.getFullYear()}-${jam.getMonth()}-${jam.getDate()}`

      // Ubah status
      allOlder[value].dataValues.return_status = allOlder[value].dataValues.return_status === true ? "the book has been returned" : "the book has not been returned";


      allOlder[value].dataValues.book_id = await allOlder[value].getBook({
        raw: true,
        attributes: ["id", ["book_title", "title"]],
      });
      allOlder[value].dataValues.user_id = await allOlder[value].getUser({
        raw: true,
        attributes: ["id", ["name", `title`]],
      }); 
    }


    
    // Ambil Column dari model
    const coloumn = await Object.keys(order.rawAttributes);

    // Definisikan modal
    const without = ["id", "createdat", "updatedat"];

    // Render Halaman
    res.render("table", {
      data: allOlder,
      role,
      coloumn,
      without,
      modalwithout: [
        ...without,
        `order_price`,
        "id_transaction",
        `return_status`,
        "order_date",
        `order_officer_buy`,
        "order_officer_return",
      ],
      title: "Order list",
      name: officerEmail,
      module: moduleLibrary,
      role,
      buttonHeader: {
        add: {
          class: "fas fa-user mr-2",
          id: "addActionButton",
        },
      },
      as: [
        moduleLibrary.as({
          show: true,
          target: "book_id",
          showName: "Book",
          type: "select",
          without: [0],
          value: resultBook,
        }),
        moduleLibrary.as({
          target: "user_id",
          showName: "user",
          type: "select",
          value: resultMember,
        }),
      ],
      buttonAction: false,
    });
  } catch (err) {
    console.log(err);
    const code = err.code || 200;
    res.status(code).json(err);
  }
});

Route.post("/", async function (req, res) {
  try {
    // Ambil TOken
    const {email} = req.user;

    // Ambil data bedasarkan apa yang diinputkan user
    const { order_day, user_id, book_id } = req.body;
    const bookId = req.body.book_id;

    // Import Model
    const { order, book } = await tabel();

    // // Validasi

    // Cari Buku
    const bookData = await book.findOne({
      where: {
        id: book_id,
      },
      raw: true,
    });

    // Jika Tidak Ditemukan
    if (bookData == null)
      throw new respon2({ message: "book not found", code: 200 });

    // Jika stok habis
    if (bookData.book_stock <= 0)
      throw new respon2({ message: "out of stock", code: 200 });

    // Masukan Nilai tambahan
    let waktu = new Date();
    waktu.setDate(waktu.getDate() + parseInt(req.body.order_day));
    waktu = waktu.getTime();
    const codeTransaksi = moduleLibrary.randomString(26);

    // Masukan Data
    await order.create({
      user_id,
      book_id,
      id_transaction: codeTransaksi,
      order_price: bookData.book_price,
      order_day,
      order_date: waktu,
      order_officer_buy: email,
    });

    // Update Stock Buku
    await book.update(
      { book_stock: bookData.book_stock - 1 },
      {
        where: {
          id: bookId,
        },
      }
    );

    // Kirim Respon
    res.json(
      new respon2({
        message: "managed to order the book",
        code: 200,
        type: true,
        redirect: true,
      })
    );
  } catch (err) {
    console.log(err);
    const code = err.code || 200;
    res.status(code).json(err);
  }
});

Route.delete("/", async function (req, res) {
  try {
    // Import model
    const { order } = await tabel();

    // Ambil yang diinputkan user
    let { user, book, id_transaction } = req.body;

    // Check Apakah Orderan tsb ada
    const resultOrder = await order.findAll({
      where: {
        [Op.and]: {
          user_id: user,
          book_id: book,
          id_transaction,
        },
      },
    });

    // Jika Ga ada
    if (resultOrder.length <= 0)
      throw new respon2({ message: "not found. Please check again" });

    // Update
    await order.update(
      { return_status: true, order_officer_return: req.user.email },
      {
        where: {
          [Op.and]: {
            user_id: user,
            book_id: book,
            id_transaction,
          },
        },
      }
    );

    // Kirim Respon
    res.json(new respon2({ message: "success", code: 200, type: true, redirect: '/rent' }));
  } catch (err) {
    console.log(err);
    const code = err.code || 200;
    res.status(code).json(err);
  }
});

Route.get("/return", async function (req, res) {
  try {
    const { order } = await tabel();

    // Cari order yang belum dikembalikan
    const dataOrder = await order.findAll({
      where: {
        [Op.not]: {
          return_status: true,
        },
      },
    });

    // Ambil Data dari foreign Key
    for (let index in dataOrder) {
      const dataOrderMember = await dataOrder[index].getUser({
        attributes: [["name", "title"], "id"],
        raw: true,
      });
      const dataOrderBook = await dataOrder[index].getBook({
        attributes: [["book_title", "title"], "id", [`book_fines`, "fines"]],
        raw: true,
      });

      dataOrder[index].dataValues.user_id = dataOrderMember;
      dataOrder[index].dataValues.book_id = dataOrderBook;
    }
    
    // Render halaman
    res.render("returnBook", {
      dataOrder,
      show: [`member_id`, `book_id`],
      moduleCustom: moduleLibrary,
    });
  } catch (err) {
    console.log(err);
    const code = err.code || 200;
    res.status(code).json(err);
  }
});

Route.get("/return/:id", async function (req, res) {
  try {
    const paramId = req.params.id;
    const { order } = await tabel();

    // Cari bedasarkan yang diberi
    const dataOrder = await order.findAll({
      where: {
        [Op.and]: {
          user_id: paramId,
          return_status: false,
        },
      },
    });

    // Jika Ga ada
    if (dataOrder.length <= 0)
      throw new respon2({ message: "not found. Please check again" });

    // Ambil Data dari foreign Key
    for (let index in dataOrder) {
      const dataOrderUser = await dataOrder[index].getUser({
        attributes: [["name", "title"], "id"],
        raw: true,
      });
      const dataOrderBook = await dataOrder[index].getBook({
        attributes: [["book_title", "title"], "id", [`book_fines`, "fines"]],
        raw: true,
      });

      dataOrder[index].dataValues.user_id = dataOrderUser;
      dataOrder[index].dataValues.book_id = dataOrderBook;
    }

    // Kembalikan
    res.json(dataOrder);
  } catch (err) {
    console.log(err);
    const code = err.code || 200;
    res.status(code).json(err);
  }
});
module.exports = Route;
