// Dependensi
const express = require("express");
const app = express();
const dotenv = require("dotenv").config({ path: "./config/.env" });
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const port = process.env.APP_PORT || 3000;
const { multer } = require("./middleware/multer");



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
  // let { sequelize, member } = await modelIndex();
  // await sequelize.sync({force: true});
  // await member.create({email: 'rhafaelbijaksana04@gmail.com', password: 123, role: 'librarian'});
  // await member.create({email: 'user@gmail.com', password: 123, role: 'user'});

  
  app.get("/", auth, roleAuth, indexRoute);
  app.use("/members", auth, roleAuth, memberRouter);
  app.use("/books", auth, roleAuthLibrary, bookRouter);
  app.use("/rent", auth, roleAuthLibrary, rentRoute);
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
    let { member } = await modelIndex();

    // Jika Token Tidak ada
    if (!token)
      throw new respon2({
        message: "token not found",
        code: 200,
        redirect: "/login",
      });
    const tokenJwt = jwt.verify(token, process.env.APP_PUBLIC_KEY, {
      algorithms: "RS256",
    });

    const user = await member.findOne({
      where: {
        id: tokenJwt.id,
      },
    });

    // Jika user tidak ada
    if (!user)
      throw new respon2({
        message: "unregistered user",
        code: 200,
        redirect: "/login",
      });

    req.user = tokenJwt;

    next();
  } catch (err) {
    if (req.method == "GET") {
      res.redirect(err.redirect);
    } else {
      res.json(err);
    }
  }
}

async function roleAuth(req, res, next) {
  let { role } = req.user;
  role = role.toLowerCase();

  if (role == "admin" || role == "librarian") {
    next();
  } else {
    if (req.method == "GET") {
      res.redirect("/");
    } else {
      res.json(
        new respon2({ message: `you don't have permission`, code: 403 })
      );
    }
  }
}

async function roleAuthLibrary(req, res, next) {
  let { role } = req.user;
  role = role.toLowerCase();

  if (role == "librarian") {
    next();
  } else {
    if (req.method == "GET") {
      res.redirect("/");
    } else {
      res.json(
        new respon2({ message: `you don't have permission`, code: 403 })
      );
    }
  }
}
