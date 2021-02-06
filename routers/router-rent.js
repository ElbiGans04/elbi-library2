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
    let { role, id: userID } = req.user;

    // Import Model
    const { order, book, member, Op } = await tabel();

    // Ambil Semua Orderan
    const allOlder = await order.findAll();

    // Ambil Semua Buku
    const resultBook = await book.findAll({
      raw: true,
      attributes: ["id", ["book_title", "value"]],
    });

    // Ambil semua user dengan role user BUKAN ADMIN & LIBRARIAN
    const resultMember = await member.findAll({
      where: {
        role: "user",
      },
      attributes: ["id", ["email", "value"]],
      raw: true,
    });

    // Cari User bedasarkan id yang didapat dari req.user
    let name = await member.findOne({
      where: {
        id: userID,
      },
      raw: true,
      attributes: ["email"],
    });

    // Mengambil Data dari tabel relasi
    for (let value in allOlder) {
      const result = await allOlder[value].getBook({
        raw: true,
        attributes: ["id", ["book_title", "title"]],
      });
      const result2 = await allOlder[value].getMember({
        raw: true,
        attributes: ["id", ["email", `title`]],
      });

      allOlder[value].dataValues.book_id = result;
      allOlder[value].dataValues.member_id = result2;
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
      active: "order",
      name: name.email,
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
          target: "member_id",
          showName: "Member",
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
    const { order_day, member_id, book_id } = req.body;
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
      member_id,
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
        message: codeTransaksi,
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
    let { member, book, id_transaction } = req.body;

    // Check Apakah Orderan tsb ada
    const resultOrder = await order.findAll({
      where: {
        [Op.and]: {
          member_id: member,
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
      { return_status: 'has been returned', order_officer_return: req.user.email },
      {
        where: {
          [Op.and]: {
            member_id: member,
            book_id: book,
            id_transaction,
          },
        },
      }
    );

    // Kirim Respon
    res.json(new respon2({ message: "success", code: 200 }));
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
          return_status: 'has been returned',
        },
      },
    });

    // Ambil Data dari foreign Key
    for (let index in dataOrder) {
      const dataOrderMember = await dataOrder[index].getMember({
        attributes: [["email", "title"], "id"],
        raw: true,
      });
      const dataOrderBook = await dataOrder[index].getBook({
        attributes: [["book_title", "title"], "id", [`book_fines`, "fines"]],
        raw: true,
      });

      dataOrder[index].dataValues.member_id = dataOrderMember;
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
          member_id: paramId,
          return_status: false,
        },
      },
    });

    // Jika Ga ada
    if (dataOrder.length <= 0)
      throw new respon2({ message: "not found. Please check again" });

    // Ambil Data dari foreign Key
    for (let index in dataOrder) {
      const dataOrderMember = await dataOrder[index].getMember({
        attributes: [["email", "title"], "id"],
        raw: true,
      });
      const dataOrderBook = await dataOrder[index].getBook({
        attributes: [["book_title", "title"], "id", [`book_fines`, "fines"]],
        raw: true,
      });

      dataOrder[index].dataValues.member_id = dataOrderMember;
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
