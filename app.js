// Dependensi
const express = require("express");
const app = express();
const fs = require("fs");
const dotenv = require("dotenv").config({ path: "./config/.env" });
const cookie = require("cookie-parser");
const jwt = require('jsonwebtoken');
const port = process.env.APP_PORT || 3000;
const { multer } = require("./middleware/multer");


// Router
const memberRouter = require("./routers/router-member");
const bookRouter = require("./routers/router-book");
const register = require("./routers/router-register");
const login = require("./routers/router-login");
const logout = require("./routers/router-logout");
const rentRoute = require('./routers/router-rent');
const indexRoute = require('./routers/router-index');


// // // Instalasi Project // // //
app.use("/assets", express.static("./public"));
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist/'))
app.use('/jquery', express.static('./node_modules/jquery/dist/'))
app.use(multer({ dest: multer.disk }).single('book_image'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookie());
app.set("view engine", "pug");
app.set("views", "./views");


const modelIndex = require("./models/model-index");
const respon2 = require("./controllers/respon2");
const data = [
  {
    book_title: "Mengejar Mimpi",
    book_stock: 10,
    book_launching: "102920",
    book_author: "Merle Lebsack",
    book_publisher: "Balistreri LLC",
    book_page_thickness: "12",
    book_isbn: "12",
    book_type: 'img',
    book_price: 30000,
    book_fines: 3000
  },
  {
    book_title: "Mengejar Matahari",
    book_stock: 10,
    book_launching: "102920",
    book_author: "Merle Lebsack",
    book_publisher: "Balistreri LLC",
    book_page_thickness: "12",
    book_isbn: "12",
    book_image: fs.readFileSync('./public/img/gambar2.jpg'),
    book_type: 'jpg',
    book_price: 40000
  },
];

fs.readFile('./public/img/gambar1.jpg', {}, async function(err, file){
  if(err) throw err;
  data[0].book_image = file;
  let {sequelize, member, book, order} = await modelIndex()
  try {
    // await sequelize.sync({force: true})
    // await member.create({email: 'root@gmail.com', password: 123, role: 'librarian'});
    // await member.create({email: 'admin@gmail.com', password: 123, role: 'admin'});
    // await member.create({email: 'rhafaelbijaksana04@gmail.com', password: 123});
    // await book.create(data[0]);
    // await book.create(data[1]);
  
    app.get('/', auth, indexRoute)
    app.use("/members", auth, roleAuth, memberRouter);
    app.use("/books", auth, roleAuthLibrary, bookRouter);
    app.use('/rent', auth , roleAuthLibrary, rentRoute);
    
    // // Jika mau daftar harus melalui fisik
    // app.use("/register",auth, register);
    app.use("/login", login);
    app.use("/logout", logout);
    app.listen(port, function (err) {
      if (err) throw err;
      console.log(`Server telah dijalankan pada port ${port}`);
    });
    
    
    // await book.create(data[1])
    // await book.create(data[0])
    // await book.create(data[1])
    // await book.bulkCreate(data)
    
  } catch (err) {
    console.log(err)
  }
  
})


async function auth (req, res, next){
  try {
    const token = req.cookies.token;
    let {member} = await modelIndex()
    
    // Jika Token Tidak ada
    if(!token) throw new respon2({message: 'token not found', code: 200, redirect: '/login'})
    const tokenJwt = jwt.verify(token, process.env.APP_PUBLIC_KEY, {
      algorithms: 'RS256'
    });

    const user = await member.findOne({
      where: {
        id: tokenJwt.id
      }
    });
    
    // Jika user tidak ada
    if(!user) throw new respon2({message: 'unregistered user', code: 200, redirect: '/login'})
    
    req.user = tokenJwt;

    next();
  } catch (err) {
    if(req.method == 'GET') {
      res.redirect(err.redirect)
    } else {
      res.json(err)
    }
  }
}

async function roleAuth (req, res, next) {
  let { role } = req.user;
  role = role.toLowerCase();
  
  if(role == 'admin' || role == 'librarian') {
    next();
  } else {
    if(req.method == 'GET') {
      res.redirect('/')
    } else {
      res.json(new respon2({message: `you don't have permission`, code: 403}));
    }
  }
}

async function roleAuthLibrary (req, res, next) {
  let { role } = req.user;
  role = role.toLowerCase();
  
  if(role == 'librarian') {
    next();
  } else {
    if(req.method == 'GET') {
      res.redirect('/')
    } else {
      res.json(new respon2({message: `you don't have permission`, code: 403}));
    }
  }
}