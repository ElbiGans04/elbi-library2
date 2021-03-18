const express = require("express");
const Route = express.Router();
const model = require(`../db/models/index`);
const ModuleTemplate = require("../controllers/module");
const moduleLibrary = new ModuleTemplate();
const respon2 = require("../controllers/respon");
const { Op } = require("sequelize");
const url = require('url');

// Definisikan
Route.get("/", async function (req, res, next) {
  try {
    // Import Model
    const order = model.order;
    const book = model.book;
    const user = model.user;

    // Ambil Semua Orderan
    let allOlder, orderNoLate = [];
    
    // Bedasarkan Kondisi tertentu
    let {group} = url.parse(req.url, true).query;
    if(group === undefined || group.toLowerCase() == "all") allOlder = await order.findAll();
    else {
        group = group == "1" ? true : false;
        let resultOfOrder = await order.findAll({
            where: {
                return_status: group
            }
        });

        // Jika tidak ada
        if(resultOfOrder.length <= 0) allOlder = await order.findAll();  
        else allOlder = resultOfOrder
    };


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


    // ambil name
    let about = model.about;
    let {appName} = await about.findOne({
        raw: true,
        attributes: ['appName']
    });

    

    // Mengambil Data dari tabel relasi
    for (let value in allOlder) {

      // Ubah Format waktu
      let jam = new Date(parseInt(allOlder[value].dataValues.order_date));
      allOlder[value].dataValues.order_date = `${jam.getFullYear()}-${jam.getMonth() + 1}-${jam.getDate()}`

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
    };

    
    // Ambil Column dari model
    const coloumn = await Object.keys(order.rawAttributes);

    // Definisikan modal
    const without = ["id", "createdat", "updatedat"];

    // Render Halaman
    res.render("table", {
      appName,
      data: allOlder,
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
      module: moduleLibrary,
      profile: req.user,
      group: [
        {id: 1, value:'has been returned'},
        {id: 0, value:'not been restored'}
      ],
      buttonHeader: {
        add: {
          class: "fas fa-plus mr-2",
          id: "addActionButton",
        },
        convert_to_excel: {
          class: "fas fa-download mr-2",
          id: 'convertToExcel'
        }
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
        moduleLibrary.as({
          target: "order_date",
          showName: "Date Order"
        }),
        moduleLibrary.as({
          target: "order_day",
          type: 'number'
        }),

      ],
      buttonAction: {
        print: true
      },
    });
  } catch (err) {
    next(err)
  }
});

Route.post("/", async function (req, res, next) {
  try {
    // Ambil TOken
    const {email} = req.user;

    if(!email) throw new respon2({message: 'email not found', code: 200, alert: true})

    // Ambil data bedasarkan apa yang diinputkan user
    const { order_day, user_id, book_id } = req.body;
    const bookId = req.body.book_id;

    if(!bookId || !user_id || !book_id) throw new respon2({message: 'book/user not found', code: 200, alert: true});



    // Import Model
    const order = model.order;
    const book = model.book;
    const user = model.user;
    const about = model.about;

    const {fines} = await about.findOne({
      where: {
        id: 1
      },
      attributes: ['fines'],
      raw: true
    });

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
      throw new respon2({ message: "book not found", code: 200, alert: true });

    // Jika stok habis
    if (bookData.book_stock <= 0)
      throw new respon2({ message: "out of stock", code: 200, alert: true });

    
    // Check APakah user ada
    let resultUser = await user.count({where: {
      id: user_id
    }});

    if(resultUser == 0) throw new respon2({message: 'user not found', code:200, alert: true})

    // Masukan Nilai tambahan
    let waktu = new Date().getTime();
    const codeTransaksi = moduleLibrary.randomString(26);

    // Masukan Data
    await order.create({
      user_id,
      book_id,
      id_transaction: codeTransaksi,
      order_price: fines,
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
    res.json(new respon2({message: 'successfully added', type: true, alert: true, code: 200, show: true, redirect: '/rent'}))
  } catch (err) {
    next(err)
  }
});

////////////////////////////////////////////////////////
////////////////// Return Halaman///////////////////////
////////////////////////////////////////////////


Route.get("/return", async function (req, res, next) {
  try {
    const order = model.order;
    const {fines} = await model.about.findOne({
      where: {
        id: 1
      },
      raw: true,
      attributes: ['fines']
    });

    // Cari order yang belum dikembalikan
    const dataOrder = await order.findAll({
      where: {
          return_status: false,
      },
    });

    // Ambil Data dari foreign Key
    for (let element of dataOrder) {
      const dataOrderMember = await element.getUser({
        attributes: [["name", "title"], "id"],
        raw: true,
      });
      const dataOrderBook = await element.getBook({
        attributes: [["book_title", "title"], "id"],
        raw: true,
      });

      element.dataValues.user_id = dataOrderMember;
      element.dataValues.book_id = dataOrderBook;
      element.dataValues.book_id.fines = element.dataValues.order_price
      // element.dataValues.book_id.fines = fines
    };
    
    // ambil name
    let about = model.about;
    let {appName} = await about.findOne({
        raw: true,
        attributes: ['appName']
    });

    
    // Render halaman
    res.render("returnBook", {
      appName,
      title: 'Return Book',
      dataOrder,
      type: 'return',
      moduleCustom: moduleLibrary,
      name: req.user.email
    });
  } catch (err) {
    next(err)
  }
});

Route.get("/return/:id", async function (req, res, next) {
  try {
    const paramId = req.params.id;
    const order = model.order;
    const {fines} = await model.about.findOne({
      where: {
        id: 1
      },
      raw: true,
      attributes: ['fines']
    });

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
      throw new respon2({ message: "not found. Please check again", alert: true });

    // Ambil Data dari foreign Key
    for (let index in dataOrder) {
      const dataOrderUser = await dataOrder[index].getUser({
        attributes: [["name", "title"], "id"],
        raw: true,
      });
      const dataOrderBook = await dataOrder[index].getBook({
        attributes: [["book_title", "title"], "id"],
        raw: true,
      });

      dataOrder[index].dataValues.user_id = dataOrderUser;
      dataOrder[index].dataValues.book_id = dataOrderBook;
      dataOrder[index].dataValues.book_id.fines = fines;

    }

    // Kembalikan
    res.json(new respon2({message: 'success', data: dataOrder,type: true, alert: true, code: 200, show: true, redirect: '/rent'}))
  } catch (err) {
    next(err)
  }
});

Route.post("/return", async function (req, res, err) {
  try {
    // Import Model
    const order = model.order;
    const book = model.book;

    // Ambil yang diinputkan user
    let { user, book : userBook, id_transaction } = req.body;

    // Jika tidak dimasukan
    if(!user || !userBook || !id_transaction) throw new respon2({message: 'user/book/id_transaction invalid', code: 200, alert: true})

    // Check Apakah Orderan tsb ada
    const resultOrder = await order.findAll({
      where: {
        [Op.and]: {
          user_id: user,
          book_id: userBook,
          id_transaction,
          return_status: false
        },
      },
    });

    // Jika Ga ada
    if (resultOrder.length <= 0)
      throw new respon2({ message: "not found. Please check again" , alert: true});

    // Check apakah buku ada
    let resultBook = await book.findOne({
      where: {
        id: userBook
      },
      raw: true,
      attributes: ['book_stock']
    });

    if(!resultBook) throw new respon2({message: 'book not found', alert: true});

    // Update
    await order.update(
      { return_status: true, order_officer_return	: req.user.email, book },
      {
        where: {
          [Op.and]: {
            user_id: user,
            book_id: userBook,
            id_transaction,
          },
        },
      }
    );
    
    // tambahkan stock lagi
    await book.update({
      book_stock: resultBook.book_stock + 1
    }, {
      where: {
      id: userBook
    }})


    // Kirim Respon
    res.json(new respon2({message: 'success', type: true, alert: true, code: 200, show: true, redirect: '/rent'}))
  } catch (err) {
    next(err)
  }
});















Route.get('/renew', async function (req, res, next){
  try {
    // Import
    const order = model.order;
    let orderNoLate = [], result = await order.findAll({
      where: {
        return_status: false
      }
    });
    const {fines} = await model.about.findOne({
        where: {
          id: 1
        },
        raw: true,
        attributes: ['fines']
    });
    
  
    for(let element of result) {
      let date = new Date(parseInt(element.dataValues.order_date));
      date = date.setDate(date.getDate() + parseInt(element.dataValues.order_day))
  
  
      // Ambil Yang Belum lewat
      if(date > Date.now()) {
        // Push
        orderNoLate.push(element)
  
        // Logic
        let jam = new Date(parseInt(element.dataValues.order_date));
        element.dataValues.order_date = `${jam.getFullYear()}-${jam.getMonth() + 1}-${jam.getDate()}`
  
        // Ubah status
        element.dataValues.return_status = element.dataValues.return_status === true ? "the book has been returned" : "the book has not been returned";
  
  
        element.dataValues.book_id = await element.getBook({
          raw: true,
          attributes: ["id", ["book_title", "title"]],
        });
        element.dataValues.user_id = await element.getUser({
          raw: true,
          attributes: ["id", ["name", `title`]],
        }); 
      };
    };
  
    // ambil name
    let about = model.about;
    let {appName} = await about.findOne({
        raw: true,
        attributes: ['appName']
    });
  
    
    // Render halaman
    res.render("returnBook", {
      appName,
      title: 'Extend the book rental period',
      dataOrder: orderNoLate,
      moduleCustom: moduleLibrary,
      type: 'renew',
      name: req.user.email
    });
  } catch (err) {
    next(err)
  }
});


Route.post('/renew', async function(req, res, next){
  try {
    let {day, user: user_id, book: book_id, id_transaction} = req.body;
    
    // Import
    const order = model.order;
    if(day === undefined || day.length <= 0 || parseInt(day) > 10) throw new respon2({message: 'invalid day', code:200, alert: true})

    // Jika tidak ada
    // Jika tidak dimasukan
    if(!user_id || !book_id || !id_transaction) throw new respon2({message: 'user/book/id_transaction invalid', code: 200, alert: true})

    // Cari Apakah ada
    let validation = await order.findOne({
      where: {
        user_id,
        book_id,
        id_transaction
      }
    });

    // Jika tidak ada 
    if(!validation) throw new respon2({message: 'not found', code: 200, alert: true});

    let newDate = parseInt(day) + parseInt(validation.dataValues.order_day)


    // Check apakah orderan memiliki denda
    const dateNew = new Date(parseInt(validation.dataValues.order_date));
    dateNew.setDate(dateNew.getDate() + parseInt(validation.dataValues.order_day));    
    if(dateNew.getTime() < Date.now()) throw new respon2({message: 'pay the fine in advance', code: 200, alert:true})
    

    // Jika ada
    await order.update({
      order_day: newDate
    }, {
      where: {
        user_id,
        book_id,
        id_transaction
      }
    })
  
    res.json(new respon2({message: 'success', type: true, alert: true, code: 200, show: true, redirect: '/rent/renew'}))
  } catch (err) {
    next(err)
  }
});




// Detail
Route.get('/:id/detail', async function(req, res, next){
  try{
    let rent = model.order;
    let column = Object.keys(await rent.rawAttributes);

    // Cari
    let result = await rent.findOne({
      where: {
        id: req.params.id
      }
    });

    // Tambahkan
    column.pop();
    column.pop();
    column.push('User');
    column.push('Book');

    // Jika tidak ada
    if(!result) throw new respon2({message: 'not found', code: 200, alert: true});

    let resultUser = await result.getUser({
      raw: true,
      attributes: ['name']
    })

    let resultBook = await result.getBook({
      raw: true,
      attributes: [['book_title', 'name']]
    });

    result.dataValues.user = resultUser.name;
    result.dataValues.book = resultBook.name;

    delete result.dataValues.book_id
    delete result.dataValues.user_id;


    // Ubah 
    let waktu = new Date(parseInt(result.dataValues.order_date));
    result.dataValues.order_date = `${waktu.getFullYear()}/${waktu.getMonth() + 1}/${waktu.getDate()}`


    res.locals.column = column;
    res.locals.module = moduleLibrary;
    res.locals.without = ['id'];
    res.locals.data = Object.values(result.dataValues);

    // res.send("OK")
    res.render('detail')
  } catch (err) {
    next(err)
  }
})





// Export 
module.exports = Route;
