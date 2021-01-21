const express = require('express');
const app = express();
const router = require('./routers/router');
const dotenv = require('dotenv').config({path: './config/.env'})
const cookie = require('cookie-parser');
const {multer} = require('./middleware/multer');

// // // Instalasi Project // // //
app.use('/assets', express.static('./public'));
app.use(multer({dest: multer.disk}).any())
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookie());
app.set('view engine', 'pug');
app.set('views', './views');

const modelIndex = require('./models/model-index');
const db = modelIndex();


db.then(result => {
    // result.sequelize.sync({force: true});
    router(app)
})
