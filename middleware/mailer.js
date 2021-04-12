const nodemailer = require('nodemailer');
module.exports = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
        user: 'elbijr2@gmail.com',
        pass: 'elbiakunyoutube04'
    },
});