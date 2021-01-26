const express = require("express");
const app = express();
const fs = require("fs");
const dotenv = require("dotenv").config({ path: "./config/.env" });
const cookie = require("cookie-parser");
const { multer } = require("./middleware/multer");
const port = process.env.APP_PORT || 3000;
const member = require("./routers/router-member");
const book = require("./routers/router-book");
const register = require("./routers/router-register");
const login = require("./routers/router-login");
const logout = require("./routers/router-logout");

// // // Instalasi Project // // //
app.use("/assets", express.static("./public"));
app.use(multer({ dest: multer.disk }).single('book_image'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookie());
app.set("view engine", "pug");
app.set("views", "./views");

// let moduleT = require('./controllers/module');
// console.log(moduleT.jajal([
//   {
//     to: 'book', as: 'test',
//   },

//   {
//     to: 'member', as: 'identifer'
//   }
// ], 'lo'))

const modelIndex = require("./models/model-index");
const db = modelIndex();
const data = [
  {
    book_title: "Mengejar Mimpi",
    book_stock: 10,
    book_launching: "102920",
    book_author: "Merle Lebsack",
    book_publisher: "Balistreri LLC",
    book_page_thickness: "12",
    book_isbn: "12",
    book_image: fs.readFileSync('./public/img/details_close.png'),
    book_type: 'img'
  },
];

db.then((result) => {
  result.sequelize.sync({ force: true }).then((t) => {
    result.member
      .create({ email: "root@gmail.com", password: 123, isAdmin: true })
      .then((r) => {
        result.book.bulkCreate(data).then((r) => {
          app.use("/members", member);
          app.use("/books", book);

          app.use("/register", register);
          app.use("/login", login);
          app.use("/logout", logout);

          app.listen(port, function (err) {
            if (err) throw err;
            console.log(`Server telah dijalankan pada port ${port}`);
          });
        });
      });
  });
}).catch((fail) => {
  console.log(fail);
});
