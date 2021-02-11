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
const classRoute = require("./routers/router-class");
const officerRoute = require("./routers/router-officer");


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
  // let { sequelize, officer, role, userClass, user } = await modelIndex();
  // await sequelize.sync({force: true});
  

  // // Isi Officer dan beri assosiasi
  // // v6nPZnCrdcgRaic4lHYf8WY1NSLdykrTKZiB1A/7eB0=
  // let officer1 = await officer.create({name: 'rhafael', email: 'rhafaelbijaksana04@gmail.com', password:'v6nPZnCrdcgRaic4lHYf8WY1NSLdykrTKZiB1A/7eB0='})
  // let officer2 = await officer.create({name: 'elbi', email: 'elbijr2@gmail.com', password:'v6nPZnCrdcgRaic4lHYf8WY1NSLdykrTKZiB1A/7eB0='})
  
  // let role1 = await role.create({name: 'librarian'})
  // let role2 = await role.create({name: 'admin'});

  // await officer1.setRoles(role1)
  // await officer2.setRoles(role2)


  // // isi users dan assosisasi
  // let user1 = await user.create({name: 'Jacqueline Upton', nisn: '54044'});
  // let user2 = await user.create({name: 'Steven Gleichner I', nisn: '67533'});

  // let userClass1 = await userClass.create({name: '12 rpl 1'});
  // let userClass2 = await userClass.create({name: '12 rpl 2'});

  // await userClass1.setUsers(user1)
  // await userClass2.setUsers(user2)

  app.get("/", auth, indexRoute);
  app.use("/users", auth, roleAuth, memberRouter);
  app.use("/books", auth, roleAuth, bookRouter);
  app.use("/rent", auth, roleAuth, rentRoute);
  app.use("/login", login);
  app.use("/logout", logout);
  app.use('/forget', forgetRoute);


  app.use("/class", auth, roleAuth, classRoute);
  app.use("/officer", auth, roleAuth, officerRoute);
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
    if (!token) throw new Error('token not found')
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
    if (!user) throw new Error('officer not found')

    req.user = tokenJwt;

    next();
  } catch (err) {
    console.log(err)
    if(req.method == 'GET') {
      res.redirect('/login')
    } else {
      res.status(403).json(new respon2({message: 'you dont have permission'}))
    }
  }
}

async function roleAuth(req, res, next) {
  try {
    let permission = {
      admin: ['/users', '/officer', '/class'],
      librarian: ['/users', '/books', '/rent', '/return', '/class', '/officer']
    };

    let url = req.originalUrl;
    // Import Model
    let { role } = await modelIndex();
  
    // User
    let {role: userROLE} = req.user;
    
    // Cari
    let findRole = await role.findOne({
      where: {
        name: userROLE
      }
    });
  
    // Jika Tidak Ditemukan
    if(!findRole) new Error('Role Invalid');
    
    // Logic
    for(let val of permission[userROLE]) {
      if(val, url.indexOf(val) >= 0) {
        return next()
      }
    }

    if(req.method == 'GET') {
      res.redirect('/')
    } else {
      throw new Error(`you don't have permission`)
    }
    // permission[userROLE].forEach(function(el, idx){
    //   // // Jika Url Benar
    //   // if(url.indexOf(el) >= 0) {
    //   //   // Teruskan Ke middleware
    //   //   next()
    //   // } else {

    //   //   // Jika request berupa get
    //   //   if(req.method == 'GET') {
    //   //     return res.redirect('/');
    //   //   } else {
    //   //     throw new Error('not permission')
    //   //   }

    //   // }
    // });
    
    // if( moduleLibrary.termasuk(permission[userROLE], url) ) {
    //   next();
    // } else {
      // if(req.method == 'GET') {
      //   return res.redirect('/login');
      // } else {
      //   throw new Error('not permission')
      // }
    // }

    // next()    
  } catch (err) {
    console.log(err)
    const code = err.code || 403;
    res.status(code).json(err.message)
  }
}