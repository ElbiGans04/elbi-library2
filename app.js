const express = require('express');
const app = express();
const router = require('./routers/router');
const dotenv = require('dotenv').config({path: './config/.env'})

// // // Instalasi Project // // //
app.use('/assets', express.static('./public'))
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set('view engine', 'pug');
app.set('views', './views');


const modelIndex = require('./models/model-index');
const db = modelIndex();
db.then(result => {
    result.sequelize.sync({force: true});
    router(app)
})
