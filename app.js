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
const data = [
    {book_title: 'Mengejar Mimpi', book_stock:10, book_launching: '102920', book_author: 'Merle Lebsack', book_publisher: 'Balistreri LLC', book_page_thickness: '12', book_isbn: '12'}
]

db.then(result => {
    result.sequelize.sync({force: true}).then(t => {
        result.member.create({email: 'root@gmail.com', password: 123, isAdmin: true}).then(r => {
            result.book.bulkCreate(data).then(r => {
                router(app)
            })
        })
    });
}).catch(fail => {
    console.log(fail);
})
