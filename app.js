// Dependensi
const express = require("express");
const app = express();
const dotenv = require("dotenv").config({ path: "./config/.env" });
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const port = process.env.APP_PORT || 3000;
const { multer } = require("./middleware/multer");
const ModuleLibrary = require('./controllers/module');
const moduleLibrary = new ModuleLibrary();


// Router
const memberRouter = require("./routers/router-member");
const bookRouter = require("./routers/router-book");
const login = require("./routers/router-login");
const logout = require("./routers/router-logout");
const rentRoute = require("./routers/router-rent");
const indexRoute = require("./routers/router-index");
const forgetRoute = require("./routers/router-forget");


// // // Instalasi Project // // //
app.use("/assets", express.static("./public"));
app.use("/bootstrap", express.static("./node_modules/bootstrap/dist/"));
app.use("/jquery", express.static("./node_modules/jquery/dist/"));
app.use(multer({ dest: multer.disk }).single("book_image"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookie());
app.set("view engine", "pug");
app.set("views", "./views");

const modelIndex = require("./models/model-index");
const respon2 = require("./controllers/respon");

(async function() {
  // let { sequelize, officer, role } = await modelIndex();
  // await sequelize.sync({force: true});
  
  // let password = moduleLibrary.hashing('123');
  // let role2 = await role.create({name: 'librarian'});
  // let role3 = await officer.create({email: 'rhafaelbijaksana04@gmail.com', password, name: 'elbi'});
  // await role2.addOfficer(role3)
  // let role4 = await memberRole.create({});

  // await member.create({email: 'user@gmail.com', password});

  app.get("/", auth, roleAuth, indexRoute);
  app.use("/users", auth, roleAuth, memberRouter);
  app.use("/books", auth, roleAuth, bookRouter);
  app.use("/rent", auth, roleAuth, rentRoute);
  app.use("/login", login);
  app.use("/logout", logout);
  app.use('/forget', forgetRoute)
  app.listen(port, function (err) {
    if (err) throw err;
    console.log(`Server telah dijalankan pada port ${port}`);
  });

})()


async function auth(req, res, next) {
  try {
    const token = req.cookies.token;
    let { officer } = await modelIndex();

    // Jika Token Tidak ada
    if (!token) return res.redirect('/login')
    const tokenJwt = jwt.verify(token, process.env.APP_PUBLIC_KEY, {
      algorithms: "RS256",
    });

    const user = await officer.findOne({
      where: {
        id: tokenJwt.id,
        email: tokenJwt.email
      },
    });

    // Jika user tidak ada
    if (!user) return res.redirect('/login')

    req.user = tokenJwt;

    next();
  } catch (err) {
    console.log(err)
  }
}

async function roleAuth(req, res, next) {
  try {
    let permission = {
      admin: ['/users'],
      librarian: ['/users', '/books', '/rent', '/return']
    };

    let url = req.originalUrl;
    // Import Model
    let { role } = await modelIndex();
  
    // User
    let {role: userROLE} = req.user
    
    // Cari
    let findRole = await role.findOne({
      where: {
        name: userROLE
      }
    });
  
    // Jika Tidak Ditemukan
    if(!findRole) new Error('Role Invalid');

    // Logic
    // permission[userROLE].forEach(function(el, idx){
    //   if ( el == url ) console.log(el)
    // // });
    // if( moduleLibrary.termasuk(permission[userROLE], url) ) {
    //   next();
    // } else {
    //   if(req.method == 'GET') {
    //     return res.redirect('/login');
    //   } else {
    //     throw new Error('not permission')
    //   }
    // }

    next()    
  } catch (err) {
    console.log(err)
    const code = err.code || 200;
    res.status(code).json(err)
  }
}