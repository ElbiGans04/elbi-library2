// Dependensi
const express = require("express");
const app = express();
const dotenv = require("dotenv").config({ path: "./config/.env" });
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 3000;
const multer = require("./middleware/multer");
const morgan = require('morgan');
const modelIndex = require("./db/models/index");
const respon = require("./controllers/respon");




// Router
const memberRouter = require("./routers/router-member");
const bookRouter = require("./routers/router-book");
const login = require("./routers/router-login");
const rentRoute = require("./routers/router-rent");
const indexRoute = require("./routers/router-index");
const forgetRoute = require("./routers/router-forget");
const officerRoute = require("./routers/router-officer");
const convertRoute = require("./routers/router-convert");
const group = require("./routers/router-generate");
const report = require('./routers/router-report');
const about = require('./routers/router-about');
const update = require('./routers/router-update');


// // // Instalasi Project // // //
app.use("/assets", express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookie());
app.set("view engine", "pug");
app.set("views", "./views");
app.use(morgan('tiny'));
app.use(multer.single("book_image"));


(async function () {
  app.get("/", auth, indexRoute);
  app.use("/users", auth,  memberRouter);
  app.use("/books", auth, roleAuth,bookRouter);
  app.use("/rent", auth, roleAuth, rentRoute);
  app.use("/login", login);
  app.get("/logout", function (req, res) {
    res.cookie(
      "token",
      {},
      {
        maxAge: -1000000,
      }
    );

    console.log("Cookie Telah Dihapus");
    res.redirect("/login");
  });
  
  
  app.use("/forget", forgetRoute);
  app.use("/class", auth, roleAuth, group("class", "Class"));
  app.use("/category", auth, roleAuth, group("category", "Category"));
  app.use("/publisher", auth, roleAuth, group("publisher", "Publisher"));
  app.use("/officer", auth, roleAuth, officerRoute);
  app.use("/convert", auth, roleAuth, convertRoute);
  app.use("/about", auth, about);
  app.use("/report", auth, roleAuth, report)
  app.use("/update", auth, update)

  // Handler
  app.get('*', (req, res) => res.render('notfound'));

  // Error Handler
  app.use(function(err, req, res, next) {
    console.log(err.message);
    if (res.headersSent) {
      return next(err)
    }
    
    err = err instanceof respon === false ? new respon({message: err.message, alert: true, code: 200}) : err;
    res.status(err.status || err.code || 200);
    res.json(err)
  });



  app.listen(port, function (err) {
    if (err) throw err;
    console.log(`web runs on the port ${port}`);
  });
})();




// Auth
async function auth(req, res, next) {
  try {
    const token = req.cookies.token;
    const officer = modelIndex.officer;

    // Jika Token Tidak ada
    if (!token) throw new Error("token not found");
    const tokenJwt = jwt.verify(token, process.env.APP_PUBLIC_KEY, {
      algorithms: "RS256",
    });

    const user = await officer.findOne({
      where: {
        id: tokenJwt.id,
        email: tokenJwt.email,
      },
    });

    // Jika user tidak ada
    if (!user) throw new Error("officer not found");

    req.user = tokenJwt;
    next();
  } catch (err) {
    console.log(err);
    if (req.method == "GET") {
      res.redirect("/login");
    } else {
      res
        .status(403)
        .json(new respon({ message: "you dont have permission "}));
    }
  }
}

async function roleAuth(req, res, next) {
  try {
    let permission = {
      admin: ["/users", "/officer", "/class"],
      librarian: "*",
      root: "*",
    };

    let url = req.originalUrl;

    // User
    let { role: userROLE } = req.user;

    // Cari
    let findRole = await modelIndex.role.findOne({
      where: {
        name: userROLE,
      },
    });

    // Jika Tidak Ditemukan
    if (!findRole) new Error("Role is Invalid");

    // Jika == * berarti lewati semua
    if (permission[userROLE] == "*") {
      return next();
    } else {
      for (let val of permission[userROLE]) {
        if ((val, url.indexOf(val) >= 0)) {
          return next();
        }
      }
    }

    if (req.method == "GET") {
      res.redirect("/");
    } else {
      throw new Error(`you don't have permission`);
    }
  } catch (err) {
    console.log(err);
    const code = err.code || 403;
    res.status(code).json(err.message);
  }
}
